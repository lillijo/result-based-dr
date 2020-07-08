from sklearn.metrics import silhouette_samples
import numpy as np
import math
from itertools import combinations
from scipy.spatial.distance import cdist, pdist, squareform, euclidean
from scipy.stats.mstats import spearmanr
from sklearn import preprocessing
import pandas as pd
import networkx as nx
from scipy.interpolate import griddata

def connected_component_subgraphs(G):
    for c in nx.connected_components(G):
        yield G.subgraph(c)


class EmbeddingResult():
    def __init__(self,data=None,name=None):
        if data:
            self.perp = data[0]['perp']
            self.lr = data[0]['lr']
            self.name = name
            self.seed = name[-9:-8]
            self.projects = preprocessing.minmax_scale([i["mappoint"] for i in data]).tolist()
            self.entropies = [i['entropy'] for i in data]
            self.classes = [i['project_data']['fb'] for i in data]
            self.ids =  [i['project_data']['id'] for i in data]
            self.titles =  [i['project_data']['title'] for i in data]
        else:
            self.perp = None
            self.lr = None
            self.name = None
            self.seed = None
            self.projects = None
            self.entropies = None
            self.classes = None
            self.ids =  None
            self.titles =  None
        self._mst_graph = None
        self.outlying_measure = None
        self.skewed_measure = None
        self.clumpy_measure = None
        self.sparse_measure = None
        self.stringy_measure = None
        self.spearmanr_measure = None
        self.distance_measure = None
        self.silhouette_measure = None
        self.mean_jaccard_measure = None
        self.stability_measure = None
        self.tsne_measure = None
        self.hellinger_measure = None

    def from_dump(self,dump):
        self.perp = dump['perp']
        self.lr = dump['lr']
        self.name = dump['name']
        self.seed = dump['seed']
        self.projects = dump['projects']
        self.classes = dump['classes']
        self.ids = dump['ids']
        self.titles = dump['titles']
        self.entropies = dump['entropies']
        self.outlying_measure = dump['outlying_measure']
        self.skewed_measure = dump['skewed_measure']
        self.clumpy_measure = dump['clumpy_measure']
        self.sparse_measure = dump['sparse_measure']
        self.stringy_measure = dump['stringy_measure']
        self.spearmanr_measure = dump['spearmanr_measure']
        self.distance_measure = dump['distance_measure']
        self.silhouette_measure = dump['silhouette_measure']
        self.mean_jaccard_measure = dump['mean_jaccard_measure']
        self.stability_measure = dump['stability_measure']
        self.tsne_measure = dump['tsne_measure']
        self.hellinger_measure = dump['hellinger_measure']
        return self

    def get_dump(self):
        return { k:v for k,v in vars(self).items() if not k.startswith('_') }

    def compute_uncertainty(self):
        ps = np.array(self.projects)
        vals = self.entropies
        grid_x, grid_y = np.mgrid[np.min(ps[:,0]):np.max(ps[:,0]):50*1j,
                                  np.min(ps[:,1]):np.max(ps[:,1]):50*1j]
        c = griddata(np.array(ps), np.array(vals[:len(ps)]), (grid_x, grid_y), method='linear', fill_value=np.min(vals[:len(ps)]))
        return c.T.flatten().tolist()

    def m_silhouette(self):
        similarity_to_cluster_centers = silhouette_samples(np.array([i for i in self.projects]), labels=np.array( self.classes))
        self.silhouette_measure = max(similarity_to_cluster_centers)

    def m_smallest_dists(self):
        distances = pdist(self.projects)
        distances.sort()
        self.distance_measure = sum(distances[:len(self.projects)])/len(self.projects)

    def m_hellinger(self,other_projects):
        p =  [item for sublist in self.projects for item in sublist]
        q =  [item for sublist in other_projects for item in sublist]
        self.hellinger_measure = euclidean(np.sqrt(p), np.sqrt(q)) / np.sqrt(2)

    def m_stability(self,point):
        self.stability_measure = math.atan(self.projects[point][1]/(self.projects[point][0]+0.0001))

    def m_scagnostics(self):
        graph = self._mst_graph
        weights = [graph[a][b]['weight'] for a,b in graph.edges]
        weights.sort()
        quant25 = np.quantile(weights,0.25)
        quant75 = np.quantile(weights,0.75)
        quant10 = np.quantile(weights,0.1)
        quant90 = np.quantile(weights,0.9)
        quant50 = np.quantile(weights,0.5)
        crit = quant75 + 1.5*(quant75-quant25)
        longEdgesSum = np.sum(list(filter(lambda x: x>crit, weights)))
        subgraphs = [graph.copy() for a,b in graph.edges]
        edges = [[a,b] for a,b in graph.edges]
        clumpylist = []
        i= 0
        for g in subgraphs:
            g.remove_edge(edges[i][0],edges[i][1])
            minComp = min(connected_component_subgraphs(g), key=len)
            if len(minComp.edges) >0 and graph[edges[i][0]][edges[i][1]]['weight'] > 0:
                maxEdge = max([g[a][b]['weight'] for a,b in minComp.edges])
                maxEdge = max(0.00001,maxEdge)
                val = 1- (maxEdge/graph[edges[i][0]][edges[i][1]]['weight'])
                clumpylist.append(val)
            i+=1
        diameter = max([max(i[1][0].values()) for i in nx.all_pairs_dijkstra(graph)])

        self.clumpy_measure  = max(clumpylist)
        self.sparse_measure  = min(1,quant90)
        self.stringy_measure = diameter/graph.size(weight='weight')
        self.spearmanr_measure = spearmanr([i[0] for i in self.projects],[i[1] for i in self.projects]).correlation
        self.outlying_measure = longEdgesSum/np.sum(weights)
        self.skewed_measure = (quant90-quant50)/(quant90-quant10)


    def m_mst_graph(self):
        df = pd.DataFrame(data=self.projects, columns=['x','y'])
        graph = nx.Graph()
        graph.add_nodes_from(df.iterrows())
        dists = pdist(df[["x", "y"]])
        dists = squareform(dists)
        graph.add_weighted_edges_from([(p1, p2,dists[p1][p2]) for p1, p2 in combinations(df.index.values, 2)])
        self._mst_graph = nx.minimum_spanning_tree(graph, weight='weight')
        return self._mst_graph

    def m_mean_jaccard(self,other_graph):
        v = len(self._mst_graph)
        c = 1/v
        sumOfVals = 0
        for i in range(v):
            N1 = [n for n in self._mst_graph.neighbors(i)]
            N2 = [n for n in other_graph.neighbors(i)]
            sumOfVals+= len(list(set(N1) & set(N2)))/len(list(set(N1) | set(N2)))
        self.mean_jaccard_measure = sumOfVals*c

    def compute_all_measures(self,other_graph, other_projects, stability_point):
        self.m_mst_graph()
        if other_graph == None:
            other_graph = self._mst_graph
        if other_projects == None:
            other_projects = self.projects
        self.m_mean_jaccard(other_graph)
        self.m_scagnostics()
        self.m_stability(stability_point)
        self.m_smallest_dists()
        self.m_silhouette()
        self.m_hellinger(other_projects)
