from typing import List

from scipy.sparse import vstack, csr_matrix
from sklearn.metrics import silhouette_samples
from sklearn.pipeline import Pipeline
import numpy as np
from bokeh.palettes import d3
from scipy.stats import entropy
from scipy.spatial.distance import jensenshannon
import json
from Preprocessing.preprocessing import Preprocessing
from Embedding.embedding import Embedding
from Planereduction.planereduction import PlaneReduction
from Linearization.linearization import mapToSpaceSampling, computeClusterTopography
from Debug.debug import Debug

# preload preprocessor
preprocessor = Preprocessing()

# preload models

models = {
	#'Doc2Vec': Embedding(method='Doc2Vec'),
	#'TfIdf': Embedding(method='TfIdf', dict_path='../models/dict/dict.joblib', model_path='../models/tfidf/tfidf.joblib'),
	'HDP': Embedding(method='HDP', dict_path='../models/dict/dict.joblib', model_path='../models/hdp/hdp.joblib'),
	#'BERT': Embedding(method='BERT')
}

print('Finished loading')
with open('projects.json') as json_file:
	projects = json.load(json_file)
descriptions = [i["description"] for i in projects]
print(projects[0]["title"])

for seed in [3,5,7]:
	for p in range(3,19):
		for l in range(10,101,10):
			pipe = Pipeline([('Preprocessing', preprocessor),
	                 ('Embedding', models['HDP']),
	                 ('EmbeddingData', Debug()),
	                 ('PlaneReduction', PlaneReduction(2, method='TSNE', perplexity=p, learning_rate=l, metric=jensenshannon, random_state=seed))])
			tfs_plane = pipe.fit_transform(descriptions)
			tfs_mapped = mapToSpaceSampling(tfs_plane)
			uncertainty =entropy(pipe.named_steps.EmbeddingData.data, axis=1)
			dump =   [{'mappoint':mappoint, 'project_data': project, 'entropy': entropy, "lr":l,"perp":p} for mappoint, project, entropy in zip(tfs_plane.tolist(), projects, uncertainty.tolist())]
			with open('pipeline-results/lr'+str(l)+'_p'+str(p)+'_seed'+str(seed)+'_HDP.txt', 'w') as filehandle:
				json.dump(dump, filehandle)
			print('lr'+str(l)+'_p'+str(p)+'_seed'+str(seed)+'_HDP.txt')
