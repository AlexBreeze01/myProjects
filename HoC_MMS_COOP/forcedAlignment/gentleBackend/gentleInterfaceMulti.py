import os
import requests
import json
import os.path
from os import path
import unidecode

print("Welcome to the gentle interface, written in python by Alexander Breeze")
print("Enter a sequence of as many streams as you want, then \"run\" to run gentle on them sequentially and ")
print("save all the outputs in database.json and data.jsonp for the frontend")
print("If a file is in the same folder as this python script, just enter its name")
print("Caution: if you send too large a video/audio file, gentle will crash")
print("mp4 will be converted to mp3, any other audio type should work too.")
print("This is meant to take downloaded .m3u8 streams in .mp3 format")
print("If you don't have the correct 6 .m3u8 url's, just enter placeholders and fix it later\nEverything is stored in json/jsonp plaintext\n")


vidName = []
textName = []
streamName = []
vidNo = []
vidEng = []
vidFre = []
audFlo = []
audEng = []
audFre = []
offset = []

while True:
	vidName.append(input("enter location of video file (mp3 / other-audio / mp4), or \"run\": "))
	if(vidName[len(vidName)-1]=="run"):
		vidName.pop()
		break
	textName.append(input("enter location of transcript file: "))
	if not (path.exists(vidName[len(vidName)-1]) and path.exists(textName[len(vidName)-1])):
		if path.exists(textName[len(vidName)-1]):
			print("ERROR: the path to the video file is incorrect. Deleting this stream")
		else:
			print("ERROR: the path to the text file is incorrect. Deleting this stream")
		vidName.pop()
		textName.pop()
		continue

	streamName.append(input("enter the title of this recording (will be displayed to users): "))
	vidNo.append(input("enter url for video no captions (.m3u8): "))
	vidEng.append(input("enter url for video english captions (.m3u8): "))
	vidFre.append(input("enter url for video french captions (.m3u8): "))
	audFlo.append(input("enter url for floor audio (.m3u8): "))
	audEng.append(input("enter url for english audio (.m3u8): "))
	audFre.append(input("enter url for french audio (.m3u8): "))
	offset.append(input("enter the offset of the audio streams (should be something like \"-10\"): "))


for s in range (len(vidName)): #for each input stream
	print("Running gentle on stream "+streamName[s]+" ("+str(s+1)+"/"+str(len(vidName))+")")

	if(vidName[s][-1]=='4'): #detect .mp4
		from moviepy.editor import *
		video = VideoFileClip(os.path.join(vidName[s]))
		video.audio.write_audiofile(os.path.join(vidName[s][:-1]+"3"))

	params = (('async', 'false'),)
	files = {
		'audio': (vidName[s], open(vidName[s], 'rb')),
		'transcript': (textName[s], open(textName[s], 'rb')),
	}
	response = requests.post('http://localhost:8765/transcriptions', params=params, files=files)

	with open(streamName[s]+'RAW.json', 'w') as json_file:
		json.dump(response.json(), json_file)


	aList = response.json()
	wordList = []
	wordDict = {}

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

	database['streams'].insert(0,{'name':streamName[s],'audioOffset':offset[s],'links':{'vidNo':vidNo[s],'vidEng':vidEng[s],'vidFre':vidFre[s],'audFlo':audFlo[s],'audEng':audEng[s],'audFre':audFre[s]},'transcript':aList['transcript'],'data':wordDict})
	for word in wordList:
		database['dictionary'][word] = True

	with open('database.json', 'w') as file:
		json.dump(database, file)
	with open('data.jsonp', 'w') as file:
		file.write("data=")
		json.dump(database, file)
print("\aFINISHED!\nTake the data.jsonp, place it in frontend, refresh the site and voila!")