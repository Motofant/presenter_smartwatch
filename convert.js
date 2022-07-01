import pandas as pd

input = "./settings.csv"

df = pd.read_csv(input)
df.to_json("./newin.json")