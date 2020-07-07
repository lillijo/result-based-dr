import sys
import os
from resultcollection import ResultCollection
#from get_pipeline_results import get_pipeline_results 

def main(argv):
    if len(argv) > 0:
        if argv[0] == "--recreate":
            r = ResultCollection(create=True)
            r.save_as_files()
        elif argv[0] == "--help":
            print("to recompute all measures use --recreate")
        # elif argv[0] == "--compute-new-results":
        #     print("recreating new t-sne embeddings in 'pipeline-results'")
        #     get_pipeline_results()
        #     r = ResultCollection(create=True)
        #     r.save_as_files()
        else:
            print("to get help use --help")
    elif not os.path.isfile('../src/assets/current_dump.json'):
        r = ResultCollection(create=True)
        r.save_as_files()
    else:
        print("to recompute all measures use --recreate")
        s = ResultCollection(create=False)
        s.save_as_files()

if __name__ == "__main__":
   main(sys.argv[1:])
