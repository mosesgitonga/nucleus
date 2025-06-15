import json

# Save vocab used during training
with open("classes.json", "w") as f:
    json.dump(dls.vocab, f)
