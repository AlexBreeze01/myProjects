import json
data = {'streams':[],'dictionary':{}}
with open('database.json', 'w') as file:
	json.dump(data, file)