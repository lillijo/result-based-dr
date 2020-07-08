import os
import json
import math
from sklearn import preprocessing
import numpy as np
from sklearn.manifold import TSNE
from embeddingresult import EmbeddingResult

class ResultCollection():
    def __init__(self,create=False, dumps=[]):
        self.create = create
        self.dumps = dumps
        self.samples = None

    def load_results(self,path):
        for filename in os.listdir(path):
            with open(path+"/"+filename) as json_file:
                projects = json.load(json_file)
                self.dumps.append(EmbeddingResult(projects,filename))

    def tsne_over_results(self,dim=1, perp=40,lr=100):
        X = np.array([list(sum([(i.projects[j][0],i.projects[j][1] )
            for j in range(len(i.projects))], ())) for i in self.dumps])
        X_embedded = TSNE(n_components=dim,perplexity=perp,learning_rate=lr).fit_transform(X)
        for i in range(len(self.dumps)):
            self.dumps[i].tsne_measure = float(X_embedded[i][0])

    def calculate_all_measures(self):
        if self.create:
            if os.path.exists('pipeline-results'):
                self.load_results('pipeline-results')
                print("dumps loaded")
                self.tsne_over_results()
                print("tsne mapping computed")
                firstG = self.dumps[0].m_mst_graph()
                firstP = self.dumps[0].projects
                for dump in self.dumps:
                    dump.compute_all_measures(firstG,firstP,21)
                print("all measures computed")
                save_file([i.get_dump() for i in self.dumps],'all_results_with_measures.json' )
                print('measures saved')
            else:
                print('there are no scatter plots to be found in pipeline-results. The IKON results can be computed with `get_pipeline_results.py` in the IKON backends topicextraction')
        else:
            print("measures were already saved")


    def create_sampled_dump(self):
        if len(self.dumps) == 0:
            with open('all_results_with_measures.json') as json_file:
                self.dumps = []
                dumps = json.load(json_file)
                for i in dumps:
                    self.dumps.append(EmbeddingResult().from_dump(i))
        dumpsToSave = []
        for perp in set([i.perp for i in self.dumps]):
            for lr in set([i.lr for i in self.dumps]):
                current = list(filter(lambda x: x.lr ==lr and x.perp == perp, self.dumps))
                if len(current) > 0:
                    current.sort(key=lambda tup: tup.tsne_measure)
                    dumpsToSave.append(current[0])
        self.samples = dumpsToSave
        save_file([i.get_dump() for i in self.samples],'../src/assets/current_dump.json' )
        print('samples saved')

    def create_uncertainties_dump(self):
        if not os.path.exists('../src/assets/uncertainties.json' ):
            uncertainties =[i.compute_uncertainty() for i in self.samples]
            save_file(uncertainties,'../src/assets/uncertainties.json' )
            print('uncertainties saved')
        else:
            print("uncertainties were already saved")

    def save_as_files(self):
        self.calculate_all_measures()
        self.create_sampled_dump()
        self.create_uncertainties_dump()

def save_file(data,path):
    with open(path, 'w') as filehandle:
        json.dump(data, filehandle)
        print(path+ " saved")
