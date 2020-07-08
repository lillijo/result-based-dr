<h1><a id="result-based-dr"></a>result-based-dr</h1>

Bachelor Thesis Lilli Joppien on

"Result-driven Interactive Visual Support of Parameter Selection for Dimensionality Reduction"

This is a variation to the IKON frontend that can be found at:
https://github.com/FUB-HCC/IKON-projektor

The nlp-pipeline results used originate from the IKON backend that can be found here:
https://github.com/FUB-HCC/IKON-backend

## User Guide

In order to run this prototype, you need to request data from me.
You must have npm and node installed on your computer.
If you have the data (all_results_with_measures.json and test.json) you can start the process:

1. First you need to clone the repository. Navigate to the installation folder and execute:

```
git clone https://github.com/lillijo/result-based-dr.git
```

2. Navigate to the computations folder, drop the "all_results_with_measures.json" file you received into it and create the dumps:

```
cd result-based-dr/computations
python main.py
```

3. Drop the "test.json" file into the src/assets folder and start the prototype:

```
cd ..
npm install
npm start
```
