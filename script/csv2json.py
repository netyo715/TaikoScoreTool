import csv
import json

data = []
DECIMAL_KEYS = ["viewId", "id", "mainGenre", "genre1", "genre2", "genre3", "difficulty"]
with open(r"./songInfo.csv", mode="r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        for key in DECIMAL_KEYS:
            row[key] = int(row[key])
        row["isUra"] = row["isUra"]=="True"
        data.append(row)

with open(r"./songInfo.json", mode="w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)