import os
import json
import math
from sklearn import preprocessing
import numpy as np
from scipy.interpolate import griddata
import measures as ms

def load_results():
    dumps = []
    for filename in os.listdir('pipeline-results'):
        with open("pipeline-results/"+filename) as json_file:
            projects = json.load(json_file)
            scaledProjects = preprocessing.minmax_scale([i["mappoint"] for i in projects])
        dumps.append({'name':filename,'seed':int(filename[-9:-8]),'projects':scaledProjects.tolist(),
                        'entropies': [i['entropy'] for i in projects], 'lr': projects[0]['lr'], 'perp': projects[0]['perp'],
                      'fbs': [i['project_data']['fb'] for i in projects],'ids': [i['project_data']['id'] for i in projects],
                     'titles': [i['project_data']['title'] for i in projects] })
    return dumps

def calculate_all_measures(dumps):
    dumps = ms.m_tsne(dumps)
    print("tsne mapping computed")
    firstG = ms.m_mst_graph(dumps[0]['projects'])
    for dump in dumps:
        ps = dump['projects']
        graph = ms.m_mst_graph(ps)
        scagnostics = ms.m_scagnostics(graph)
        dump['combDist'] = ms.m_smallest_dists(ps)
        dump['outlying'] = scagnostics['outlying']
        dump['skewed'] = scagnostics['skewed']
        dump['sparse'] = scagnostics['sparse']
        dump['spearmanr'] = ms.m_spearmanr(ps)
        dump['stability'] = ms.m_stability(ps,21)
        dump['silhouette'] = ms.m_silhouette(ps,dump['fbs'])
        dump['clumpy'] = scagnostics['clumpy']
        dump['simFirst'] = ms.m_mean_jaccard(graph,firstG,len(ps))
        dump['x_y_spread'] = ms.m_x_y_spread(ps)
    return dumps

def compute_uncertainties(data):
    uncertainties = []
    for vis in data:
        points = np.array(vis['projects'])
        values = vis['entropies']
        grid_x, grid_y = np.mgrid[np.min(points[:,0]):np.max(points[:,0]):50*1j,
                                  np.min(points[:,1]):np.max(points[:,1]):50*1j]
        c = griddata(np.array(points), np.array(values[:len(points)]), (grid_x, grid_y),
                     method='linear', fill_value=np.min(values[:len(points)]))
        uncertainties.append(c.T.flatten().tolist())
    return uncertainties

def create_new_dump(dumps):
    dumpsToSave = []
    for perp in set([i['perp'] for i in dumps]):
        for lr in set([i['lr'] for i in dumps]):
            current = list(filter(lambda x: x['lr'] ==lr and x['perp'] == perp, dumps))
            if len(current) > 0:
                current.sort(key=lambda tup: tup['stability'])
                dumpsToSave.append(current[0])
    return dumpsToSave

def measure_extraction(recreate=False):
    if not os.path.isfile('currentCombinedMeasures.json') or recreate:
        if os.path.exists('pipeline-results'):
            tsnedumps = load_results()
            print(str(len(tsnedumps)) + " dumps loaded")
            results = calculate_all_measures(tsnedumps)
            print(str(len(results)) + " measures calculated")
            with open('currentCombinedMeasures.json', 'w') as filehandle:
                json.dump(results, filehandle)

    if not os.path.isfile('current_dump.json') or recreate:
        with open('currentCombinedMeasures.json') as json_file:
            loaded_data = json.load(json_file)
            curr_dump = create_new_dump(loaded_data)
            print(str(len(curr_dump)) + " orderings sampled")
            with open('../src/assets/current_dump.json', 'w') as filehandle:
                json.dump(  curr_dump,filehandle)

            uncertainties = compute_uncertainties(curr_dump)
            with open('../src/assets/uncertainties.json', 'w') as filehandle:
                json.dump(uncertainties, filehandle)
            print("uncertainty landscapes computed")

    else:
        with open('current_dump.json') as json_file:
            curr_dump = json.load(json_file)
            print(str(len(curr_dump)) + " orderings from already existing dump")
            with open('../src/assets/current_dump.json', 'w') as filehandle:
                json.dump(  curr_dump,filehandle)
    print("everything is saved")
