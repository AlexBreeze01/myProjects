import os
import json
import unidecode

streamName = input("enter the title of this recording (will be displayed to users): ")
vidNo = input("enter url for video no captions (.m3u8): ")
vidEng = input("enter url for video english captions (.m3u8): ")
vidFre = input("enter url for video french captions (.m3u8): ")
audFlo = input("enter url for floor audio (.m3u8): ")
audEng = input("enter url for english audio (.m3u8): ")
audFre = input("enter url for french audio (.m3u8): ")
offset = input("enter the offset of the audio streams (should be something like \"-10\"): ")

file=open('map.json')
aList = json.load(file)
file.close()

wordList = []
wordDict = {}
charCount = 0
transcript = ""

#copy all good words, time and position
print("parsing data")
for item in aList['fragments']:
	wordHold=item['lines'][0].split()
	subCharCount=0
	for word in wordHold:
		w=str.lower(word).replace('.','').replace(',','').replace('[','').replace(']','').replace('(','').replace(')','')
		w=unidecode.unidecode(w)
		wordList.append(w)
		if w in wordDict:
			wordDict[w].append({'startTime':item['begin'],'startText':charCount+subCharCount})
		else:
			wordDict[w] = [{'startTime':item['begin'],'startText':charCount+subCharCount}]
		subCharCount+=len(str.lower(word))+1
	charCount+=len(item['lines'][0])+1
	transcript+=item['lines'][0]+" "

file=open('database.json')
database = json.load(file)
file.close()

print("data parsed, adding to database")
database['streams'].insert(0,{'name':streamName,'audioOffset':offset,'links':{'vidNo':vidNo,'vidEng':vidEng,'vidFre':vidFre,'audFlo':audFlo,'audEng':audEng,'audFre':audFre},'transcript':transcript,'data':wordDict})
for word in wordList:
	database['dictionary'][word] = True

with open('database.json', 'w') as file:
	json.dump(database, file)
with open('data.jsonp', 'w') as file:
	file.write("data=")
	json.dump(database, file)