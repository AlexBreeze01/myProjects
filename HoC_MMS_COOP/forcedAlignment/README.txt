forced alignment prototype project by Alexander Breeze

This project uses the lowerquality/gentle forced alignment software or alternatively the aeneas force alignment software to create a database of transcript words 
and their position in a given video (in this case an .mp3 downloaded using an .m3u8 link), allowing users to search for key words and find their position in the video
This project uses video.js to display selected videos from .m3u8 links. Said links were downloaded using VLC into .mp3 for running in gentle

There are 2 parts:
backend: the backend contains python scripts. The gentle one runs gentle, the aeneas one does not (you must run aeneas independently in cmd, as per the readme)
Said forced alignment softwares take an audio recording and corresponding transcript, and return a json file for the transcript words and the time
in the recording when said words were said.
The python scrpts then parse this data, add it to any previously stored data in database.json, and create a web-legible copy data.jsonp
The python scripts add other data given by the user, including the name of the stream (to be displayed to the user), the 6 .m3u8 links to play the stream 
on the website, the full transcript and the audio offset of the .m3u8 streams.

frontend: the frontend is a website (click on the .html file) for the user to search for terms. The site then reads data.jsonp to find instances of those terms
in the transcripts, offers results, and plays videos using the 6 .m3u8 links at the correct times.
For general searching, the list of terms is autocomplete for any words in the transcript containing the current word being typed. Click on one to autocomplete.
The website will display any stream containing any of the words being searched for. If words are enclosed in quotes it will only include instances containing
the full text (e.g. "natural gas" -> not natural, not gas, must be "natural gas")

Both parts have README.txt, containing more specific information