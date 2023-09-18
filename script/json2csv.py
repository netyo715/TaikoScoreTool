import csv
import json

with open(r".\songInfo.json", mode="r", encoding="utf-8") as f:
    data = json.load(f)

with open(r".\songInfo.csv", mode="w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, ["viewId", "id", "name", "isUra", "mainGenre", "genre1", "genre2", "genre3", "difficulty"])
    writer.writeheader()
    for row in data:
        writer.writerow(row)