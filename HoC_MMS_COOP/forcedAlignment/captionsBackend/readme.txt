this is an addition to the forced alignment project
made by Alexander Breeze
The idea is to download stream captions, and use them to add streams to the forced alignment database. They are downloaded with
ffmpeg -f lavfi -i movie="https\\\://parlvuliveq.azureedge.net/HOC230-DUO-5/WB_Chamber/VL/FR/Playlist.m3u8[out+subcc]" -map 0:1 -c:s webvtt -flush_packets 1 output.vtt
then parsed and added to database with vttCaptionsParser.py
replace the url with the good one, add the \\\ after https

Note this only works on old urls, not the new razor ones which give "error: empty pixel format list"
so until a better option is found, if you only have the new links:
download it as mkv with
ffmpeg -i url out.mkv
Maybe download it to null to save data or something somehow idk
Then convert to vtt with
ffmpeg -f lavfi -i "movie=out.mkv[out0+subcc]" -map s final.vtt

Note that unlike the other forced alignment programs, captions tend to put the text after when it is said, hence word.time is usually after it is said in
the stream. For this reason the vttCaptionsParser includes a -15 second time offset automatically. This is NOT the same as audioOffset. 
This change lines up audiovideo with the transcript. audioOffset must still be set correctly to line up audio with video, 