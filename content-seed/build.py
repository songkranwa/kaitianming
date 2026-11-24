# Builds worker/seed.json: the starting prediction texts, loaded into D1 once by worker/index.ts.
# Run:  python3 content-seed/build.py
# Bump VERSION when adding new texts here; keys the admin already has in the database are never overwritten.
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import day_numbers, zodiac, transits, constellations

VERSION = 1
texts = {}
for mod in (day_numbers, zodiac, transits, constellations):
    for k, v in mod.T.items():
        assert k not in texts, k
        assert v["th"].strip() and v["en"].strip(), k
        texts[k] = v
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "worker", "seed.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump({"version": VERSION, "texts": texts}, f, ensure_ascii=False, indent=1, sort_keys=True)
print(len(texts), "texts ->", os.path.normpath(out))
