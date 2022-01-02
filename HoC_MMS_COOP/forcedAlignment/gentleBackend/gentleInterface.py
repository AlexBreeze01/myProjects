import os
import requests
import json
import unidecode

vidName = input("enter location of video file (mp3 / other-audio / mp4): ")
textName = input("enter location of transcript file: ")
streamName = input("enter the title of this recording (will be displayed to users): ")
vidNo = input("enter url for video no captions (.m3u8): ")
vidEng = input("enter url for video english captions (.m3u8): ")
vidFre = input("enter url for video french captions (.m3u8): ")
audFlo = input("enter url for floor audio (.m3u8): ")
audEng = input("enter url for english audio (.m3u8): ")
audFre = input("enter url for french audio (.m3u8): ")
offset = input("enter the offset of the audio streams (should be something like \"-10\"): ")

#convert mp4 to mp3
if(vidName[-1]=='4'):
	print("mp4 detected. Gentle sometimes crashes with them, because they're too big for the port. converting to mp3")
	from moviepy.editor import *
	video = VideoFileClip(os.path.join(vidName))
	video.audio.write_audiofile(os.path.join(vidName[:-1]+"3"))

#run gentle
print("running gentle")
params = (('async', 'false'),)
files = {
    'audio': (vidName, open(vidName, 'rb')),
    'transcript': (textName, open(textName, 'rb')),
}
response = requests.post('http://localhost:8765/transcriptions', params=params, files=files)

#finish gentle, put output into raw json file
print("gentle finished, logging in rawOutput.json \a") #\a makes ding to alert that gentle is done
with open(streamName+'RAW.json', 'w') as json_file:
    json.dump(response.json(), json_file)


aList = response.json()
wordList = []
wordDict = {}

#copy all good words, time and position
print("parsing data")
for item in aList['words']:
	if item['case']=="success":
		wordList.append(str.lower(item['word']))
		w=unidecode.unidecode(str.lower(item['word']))
		if w in wordDict:
			wordDict[w].append({'startTime':item['start'],'startText':item['startOffset']})
		else:
			wordDict[w] = [{'startTime':item['start'],'startText':item['startOffset']}]

file=open('database.json')
database = json.load(file)
file.close()

print("data parsed, adding to top of database")
database['streams'].insert(0,{'name':streamName,'audioOffset':offset,'links':{'vidNo':vidNo,'vidEng':vidEng,'vidFre':vidFre,'audFlo':audFlo,'audEng':audEng,'audFre':audFre},'transcript':aList['transcript'],'data':wordDict})
for word in wordList:
	database['dictionary'][word] = True

with open('database.json', 'w') as file:
	json.dump(database, file)
with open('data.jsonp', 'w') as file:
	file.write("data=")
	json.dump(database, file)