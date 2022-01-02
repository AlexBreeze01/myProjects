import os
import json
import unidecode
import re
import datetime
import time

streamName = input("enter the title of this recording (will be displayed to users): ")
vidNo = input("enter url for video no captions (.m3u8): ")
vidEng = input("enter url for video english captions (.m3u8): ")
vidFre = input("enter url for video french captions (.m3u8): ")
audFlo = input("enter url for floor audio (.m3u8): ")
audEng = input("enter url for english audio (.m3u8): ")
audFre = input("enter url for french audio (.m3u8): ")
offset = input("enter the offset of the audio streams (should be something like \"-10\"): ")

rd=open("final.srt","r")
saver = []

while True:
	line=rd.readline()
	line=rd.readline()
	if not line:
		break;
	time=line.strip()
	time=time[:8]
	#time=sum(x * int(t) for x, t in zip([3600, 60, 1], time.split(":"))) 
	line=rd.readline()
	print(line.strip())
	saver.append({'time':time,'text':re.search('7}(.+?)<', line.strip()).group(1)})
	line=rd.readline()
rd.close()
exit()
wordList = []
wordDict = {}
charCount = 0
transcript = ""

#copy all good words, time and position
print("parsing data")
for item in saver:
	wordHold=item['text'].split()
	subCharCount=0
	for word in wordHold:
		w=str.lower(word).replace('.','').replace(',','').replace('[','').replace(']','').replace('(','').replace(')','')
		w=unidecode.unidecode(w)
		wordList.append(w)
		if w in wordDict:
			wordDict[w].append({'startTime':item['time'],'startText':charCount+subCharCount})
		else:
			wordDict[w] = [{'startTime':item['time'],'startText':charCount+subCharCount}]
		subCharCount+=len(str.lower(word))+1
	charCount+=len(item['text'])+1
	transcript+=item['text']+" "

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