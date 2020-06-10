from sklearn.metrics import silhouette_samples
import numpy as np
import matplotlib.pyplot as plt
import math
from itertools import combinations
from scipy.spatial.distance import cdist, pdist, squareform
from scipy.stats.mstats import spearmanr
from sklearn import preprocessing
import pandas as pd
import networkx as nx
from sklearn.manifold import TSNE

def connected_component_subgraphs(G):
    for c in nx.connected_components(G):
        yield G.subgraph(c)

def m_tsne(dumps, dim=1, perp=30,lr=100):
    X = np.array([list(sum([(i['projects'][j][0],i['projects'][j][1] )
                       for j in range(len(i['fbs']))], ())) for i in dumps])

    X_embedded = TSNE(n_components=dim,perplexity=perp,learning_rate=lr).fit_transform(X)

    for i in range(len(dumps)):
        dumps[i]['x_tsne'] = float(X_embedded[i][0])
    return dumps

def m_silhouette(projects,fbs):
    similarity_to_cluster_centers = silhouette_samples(np.array([i for i in projects]), labels=np.array( fbs))
    return np.average(similarity_to_cluster_centers)

def m_smallest_dists(projects):
    distances = pdist(projects)
    distances.sort()
    return sum(distances[:len(projects)])/len(projects)


def m_stability(projects,i):
    return math.atan(projects[i][1]/(projects[i][0]+0.0001))

def m_spearmanr(projects):
    return spearmanr([i[0] for i in projects],[i[1] for i in projects]).correlation

def m_scagnostics(graph):
    weights = [graph[a][b]['weight'] for a,b in graph.edges]
    weights.sort()
    quant25 = np.quantile(weights,0.25)
    quant75 = np.quantile(weights,0.75)
    quant10 = np.quantile(weights,0.1)
    quant90 = np.quantile(weights,0.9)
    quant50 = np.quantile(weights,0.5)
    crit = quant75 + 1.5*(quant75-quant25)
    longEdgesSum = np.sum(list(filter(lambda x: x>crit, weights)))
    outlying = longEdgesSum/np.sum(weights)
    skewed = (quant90-quant50)/(quant90-quant10)
    subgraphs = [graph.copy() for a,b in graph.edges]
    edges = [[a,b] for a,b in graph.edges]
    i= 0
    clumpylist = []
    for g in subgraphs:
        g.remove_edge(edges[i][0],edges[i][1])
        minComp = min(connected_component_subgraphs(g), key=len)
        if len(minComp.edges) >0 and graph[edges[i][0]][edges[i][1]]['weight'] > 0:
            maxEdge = max([g[a][b]['weight'] for a,b in minComp.edges])
            maxEdge = max(0.00001,maxEdge)
            val = 1- (maxEdge/graph[edges[i][0]][edges[i][1]]['weight'])
            clumpylist.append(val)
        i+=1
    clumpy = max(clumpylist)
    sparse = min(1,quant90)
    return {'outlying':outlying,'skewed':skewed,'clumpy':clumpy,'sparse':sparse}

def m_mst_graph(projects):
    df = pd.DataFrame(data=projects, columns=['x','y'])
    graph = nx.Graph()
    graph.add_nodes_from(df.iterrows())
    dists = pdist(df[["x", "y"]])
    dists = squareform(dists)
    graph.add_weighted_edges_from([(p1, p2,dists[p1][p2]) for p1, p2 in combinations(df.index.values, 2)])
    graph= nx.minimum_spanning_tree(graph, weight='weight')
    return graph

def m_mean_jaccard(graph1,graph2,v):
    c = 1/v
    sumOfVals = 0
    for i in range(v):
        N1 = [n for n in graph1.neighbors(i)]
        N2 = [n for n in graph2.neighbors(i)]
        sumOfVals+= len(list(set(N1) & set(N2)))/len(list(set(N1) | set(N2)))
    return sumOfVals*c

def m_x_y_spread(projects):
    distances = cdist(projects,[[2,2],[2,-2],[-2,-2],[-2,2]])
    distance_measure = (sum([i[0] for i in distances])/sum([i[1] for i in distances]) +
                        sum([i[2] for i in distances])/sum([i[3] for i in distances]))
    return distance_measure
