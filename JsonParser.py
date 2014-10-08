__author__ = 'Evan B.'

import json
import pprint

jsonFilePath = "/Users/wline/Desktop/kimonoData.json"

json_data = open(jsonFilePath)

data = json.load(json_data)

# pprint.pprint(data)

playerContainer = dict()

for jSonObj in data["results"]['collection1']:

    playerContainer.setdefault( jSonObj['property2']['text'],[]).append( jSonObj['property4'])
    playerContainer.get(jSonObj['property2']['text']).append(jSonObj['property3']['text'])

    #playerContainer[jSonObj['property2']['text']].append(jSonObj['property3']['text'])

print playerContainer

