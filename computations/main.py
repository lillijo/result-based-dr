import sys
from extraction import measure_extraction

def main(argv):
    if len(argv) > 0:
        if argv[0] == "--recreate":
            measure_extraction(recreate=True)
        elif argv[0] == "--help":
            print("to recompute all measures use --recreate")
        else:
            print("to get help use --help")
    else:
        print("to recompute all measures use --recreate")
        measure_extraction(recreate=False)

if __name__ == "__main__":
   main(sys.argv[1:])
