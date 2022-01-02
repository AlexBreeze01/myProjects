This project was made by Alexander Breeze
it is a followup to the gentle forced alignment project
its purpose is to be a forced alignment program, but this time compatible with french
to accomplish this it uses aeneas instead of gentle
aeneas is also much faster
the documentation is here
https://www.readbeyond.it/aeneas/

the .exe included is the easiest way to install it on windows
however, on windows it is limited to small audio files of maybe half an hour, ish, probably
for that reason, I recommend using linux or mac
I could not get it working in ubuntu virtualbox, so no guarantees
apparently aeneas takes ram proportional to the length of the video, hence the crashes. Use a thing with lots of ram, or cut up the video somehow


to setup, do the following:

go to the aeneas site and follow all those steps
if you can do python -m aeneas.diagnostics in cmd, congrats.

run resetDatabase.py to delete database, reinitialise it with correct base data


to use, do the following:

in cmd, type:
python -m aeneas.tools.execute_task streamName.mp3 streamName.txt "task_language=fr|os_task_file_format=json|is_text_type=plain" map.json
Note: replace streamName with correct files and extensions. task_language=<eng or fr, depending>. map.json is the name of the output
Note: aeneasParser.py relies on the map.json file. Every time this command is run, that file is overwritten, so only do one stream at a time

run aeneasParser.py  (double-click or do python aeneasParser.py in cmd)
Note: it will request the 6 .m3u8 urls for the given stream. This is for the website when it loads videos, if you don't have them just put filler
Note: this will parse map.json and add it to database.json, then create a new data.jsonp for the frontend


A later iteration would add it to a real database, for now though it is just database.json, same format as the gentle program
aeneas aligns once per newline
I copy pasted from the ourcommons transcript, so about 10 words per line
if your transcript has no newlines, problem
make a script to newline after every space, should fix it

Also, please not that aeneasParser.py reconstructs the transcript from the data.json file, instead of using the original

extra stuff:
To automate, probably make a .bat file or something to call aeneas and python and the database and stuff automatically
this and the gentle project do the same thing. They have separate databases, but they act the same so if they are in the same folder they should be 
able to share a database.
aeneas should be able to handle both languages (one at a time, not floor audio), so maybe replace gentle fully with this (faster, less code to fail)




For a more advanced version of this project, all this should be saved in a formal database and searched with calls containing the user search term via http arguments
Video and Audio are offset in the .m3u8 links obtained from ourcommons.ca. Worse yet, each one has a different offset. Until the core cause cannot be isolated, 
the correct offset for each stream should be added to the database, just like the 'name' value, and read in logic.js when the video is loaded.

data.jsonp stores data in the following format:    ( []=list, {}=dictionary/hashmap )  ( database.json is the same, but no data= so you can load it in python not js )
Each stream has 6 links for various languages and such. Words can occur multiple times, so in data each word is a key with a list of all its occurences
data = database = {
	'streams' : [
		{
			'name' : "...",
			'audioOffset' : x,
			'links' : {'vidNo': ...,'vidEng': ..., ...},
			'transcript' : "...",
			'data' : {
				'word' : [
					{
						'startTime' : ...,
						'startText' : ...
					},
					...
				],
				...
			}
		},
		...
	],
	'dictionary' : {
		'word' : True,
		'word2' : True,
		...
	}
}

Note that startTime is when the word is said in the video, startText is the position of the first character of the word in the transcript
Note that the dictionary is used for recommending searches to the user

Note that for sugested searches the frontend does "for each key in dict, if key.includes(search), add key to output list"
This reqires one "includes" for each element in the dictionary, which could contain as many as 2 million english+french+place/name words
To make it faster, each string could be broken up into the set of its substrings, each one hashed individually and linking to a list of words containing it
for example, for 'hello', add the following hashmap keys:
hello, hell, ello, hel, ell, llo, he, el, ll, lo, h, e, l, l, o
with each one linking to lists which now contain "hello"
This would require (n^2+n)/2 entries per word, where n is len(string), but searches for words that include "searchTerm" would be O(1), 
and the total number of words to be added is finite, whereas user searches are not.
Adding a synonym dictionary would also be cool, so ex. "coal" suggests "natural gas", "mine", etc.