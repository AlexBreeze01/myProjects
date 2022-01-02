/*javascript file by Alex Breeze, written for an HTML5 video player*/

//add .M3U8 files here, in following format:
// var frenchAudio = "http://french_audio_link.m3u8";
var noCaptions = "https://parlvulivec.azureedge.net/HOC-HD-RAZOR01/WB_Chamber/VH/FL/Playlist.m3u8";
var englishCaptions = "https://parlvulivec.azureedge.net/HOC-HD-RAZOR01/WB_Chamber/VH/FL/Playlist.m3u8";
var frenchCaptions = "https://parlvulivec.azureedge.net/HOC-HD-RAZOR01/WB_Chamber/VH/FR/Playlist.m3u8";
var floorAudio = "https://parlvulivec.azureedge.net/HOC-HD-RAZOR01/WB_Chamber/VH/FL/Playlist.m3u8";
var englishAudio = "https://parlvulivec.azureedge.net/HOC-HD-RAZOR01/WB_Chamber/VH/FL/Playlist.m3u8";
var frenchAudio = "https://parlvulivec.azureedge.net/HOC-HD-RAZOR01/WB_Chamber/VH/FR/Playlist.m3u8";


//DOM elements from HTML:
var content, videoPlayer, seekSlider, playPause, skipB, skipF, volBtn, volSlider, 
curTimeText, durTimeText, fullScreenBtn, settings, settingsPopup, captions, captionsPopup, 
speed75, speedNormal, speed15, speed20, qualityAuto, qualityHigh, qualityMedium, 
qualityLow, englishAud, frenchAud, floorAud, offSub, englishSub, frenchSub, videoAudio, 
audioOnly, videoNobar, vidSpeed, alex, minQual, maxQual, mobileAudio, mobileSubs, 
captionsPopup2, subtitlesTitle2, offSub2, englishSub2, frenchSub2;

var seekSliderClicked, volumeSliderClicked, volume, timeoutHandle, speedTimeoutHandle, vidVisible, vidAud, vidSub, vidQual, vidPaused, vidRate, mobile;

function initializePlayer(){
	content=document.getElementById("content");
	videoPlayer=document.getElementById("videoPlayer");
	videoNobar = document.getElementById("videoNobar");
	playBtn = document.getElementById("playPauseButton");
	skipB = document.getElementById("skipB");
	skipF = document.getElementById("skipF");
	seekSlider = document.getElementById("seekSlider");
	curTimeText = document.getElementById("curTimeText");
	durTimeText = document.getElementById("durTimeText");
	volBtn = document.getElementById("volume");
	volSlider = document.getElementById("volSlider");
	fullScreenBtn = document.getElementById("fullScreen");
	settings = document.getElementById("settings");
	settingsPopup = document.getElementById("settingsPopup");
	captions = document.getElementById("subs");
	captionsPopup = document.getElementById("captionsPopup");
	videoAudio = document.getElementById("videoAudio");
	audioOnly = document.getElementById("audioOnly");
	speed75 = document.getElementById("speed75");
	speedNormal = document.getElementById("speedNormal");
	speed15 = document.getElementById("speed15");
	speed20 = document.getElementById("speed20");
	qualityAuto = document.getElementById("qualityAuto");
	qualityHigh = document.getElementById("qualityHigh");
	qualityMedium = document.getElementById("qualityMedium");
	qualityLow = document.getElementById("qualityLow");
	englishAud = document.getElementById("englishAud");
	frenchAud = document.getElementById("frenchAud");
	floorAud = document.getElementById("floorAud");
	offSub = document.getElementById("offSub");
	englishSub = document.getElementById("englishSub");
	frenchSub = document.getElementById("frenchSub");
	vidSpeed = document.getElementById("vidSpeed");
	mobileAudio = document.getElementById("mobileAudio");
	mobileSubs = document.getElementById("mobileSubs");
	captionsPopup2 = document.getElementById("captionsPopup2");
	subtitlesTitle2 = document.getElementById("subtitlesTitle2");
	offSub2 = document.getElementById("offSub2");
	englishSub2 = document.getElementById("englishSub2");
	frenchSub2 = document.getElementById("frenchSub2");
	
	mobile=('ontouchstart' in document.documentElement)||(!(navigator.maxTouchPoints));
	seekSliderClicked=false;
	volumeSliderClicked=false;
	vidVisible=true;
	volume=50;
	vidAud='R';
	vidSub='O';
	vidQual=mobile?'H':'A';
	vidPaused=false;
	vidRate=1;
	minQual=0;
	maxQual=Number.MAX_SAFE_INTEGER;

	videoPlayer.addEventListener("mousemove",showBars,false);
	videoPlayer.addEventListener("mouseout",hideBars,false);
	videoNobar.addEventListener("click",playPause,false);
	seekSlider.addEventListener("mousedown",stopSeekUpdate,false);
	seekSlider.addEventListener("mouseup",startSeekUpdate,false);
	seekSlider.addEventListener("change",vidSeek,false);
	playBtn.addEventListener("click",playPause,false);
	skipB.addEventListener("click",skipB10,false);
	skipF.addEventListener("click",skipF10,false);
	volBtn.addEventListener("click",muteVid,false);
	volBtn.addEventListener("mouseover",showVolSlider,false);
	volPopupHandler.addEventListener("mouseover",showVolSlider,false);
	volSlider.addEventListener("mouseover",showVolSlider,false);
	volBtn.addEventListener("mouseout",hideVolSlider,false);
	volPopupHandler.addEventListener("mouseout",hideVolSlider,false);
	volSlider.addEventListener("mouseout",hideVolSlider,false);
	volSlider.addEventListener("change",changeVolume,false);
	volSlider.addEventListener("mousedown",stopVolUpdate,false);
	volSlider.addEventListener("mouseup",startVolUpdate,false);
	fullScreenBtn.addEventListener("click",fullToggle,false);
	document.addEventListener("fullscreenchange",editFullIcon,false);
	settings.addEventListener("click",settingsPop,false);
	captions.addEventListener("click",captionsPop,false);
	videoAudio.addEventListener("click",videoAudioToggle,false);

	speed75.addEventListener("click",setSpeed75,false);
	speedNormal.addEventListener("click",setSpeedNormal,false);
	speed15.addEventListener("click",setSpeed15,false);
	speed20.addEventListener("click",setSpeed20,false);
	qualityAuto.addEventListener("click",setQualityA,false);
	qualityHigh.addEventListener("click",setQualityH,false);
	qualityMedium.addEventListener("click",setQualityM,false);
	qualityLow.addEventListener("click",setQualityL,false);
	englishAud.addEventListener("click",setAudE,false);
	frenchAud.addEventListener("click",setAudF,false);
	floorAud.addEventListener("click",setAudR,false);
	offSub.addEventListener("click",setSubO,false);
	englishSub.addEventListener("click",setSubE,false);
	frenchSub.addEventListener("click",setSubF,false);
	offSub2.addEventListener("click",setSubO,false);
	englishSub2.addEventListener("click",setSubE,false);
	frenchSub2.addEventListener("click",setSubF,false);
	

	mobileAudio.addEventListener("click",audioPop,false);
	mobileSubs.addEventListener("click",subsPop,false);

	//initialising here because js doesn't recognise it in css
	captionsPopup.style.display="none";
	settingsPopup.style.display="none";

	var link = document.createElement('link');
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = mobile ? "vidTouch.css" : "vidClick.css";
 
	document.head.appendChild(link);

	document.getElementById("videoControlsBar").addEventListener("click",playHi,false);
}
window.onload = initializePlayer;

//setting up hotkeys
document.onkeydown = function(e) {
	if(!mobile){
	switch(e.which) {
		case 32: //space
			playPause();break;
		case 75: //k
			playPause();break;
		case 70: //f
			fullToggle();break;
		case 77: //m
			muteVid();break;
		case 65: //a
			videoAudioToggle();break;
		case 37: //left
			skipB10();break;
		case 39: //right
			skipF10();break;
		case 40: //down
			volSlider.value=parseInt(volSlider.value)-parseInt(10);changeVolume();showBars();break;
		case 38: //up
			volSlider.value=parseInt(volSlider.value)+parseInt(10);changeVolume();showBars();break;
		/*case 187: //+
			vidSpeedUp();break;
		case 189: //-
			vidSpeedDown();break;*/
		case 67: //c
			hotkeyCaptions();break;
        	default: return; // exit this handler for other keys
	}
	e.preventDefault(); // prevent the default action (scroll / move caret)
	}
};

document.addEventListener('keydown', logKey);//firefox doesnt see (+/-) so handled here
function logKey(e) {
	if(e.key==='=' || e.key==='+'){vidSpeedUp();event.stopPropagation();}
	if(e.key==='-' || e.key==='_'){vidSpeedDown();event.stopPropagation();}
}

function playHi(){
	if(mobile){
		if(playBtn.style.visibility=="visible"){
			//hideBars();
		}
		else{
			showBars();
		}
	}
	else{
		//playPause();
	}
}

//displays video controls, hides later
function showBars(){
	seekSlider.style.visibility = "visible";
	if(mobile){
		playBtn.style.visibility = "visible";
		skipB.style.visibility = "visible";
		skipF.style.visibility = "visible";
		settings.style.visibility = "visible";
		document.getElementById("share").style.visibility = "visible";
		document.getElementById("timeNum").style.visibility = "visible";
		fullScreenBtn.style.visibility = "visible";
		mobileAudio.style.visibility = "visible";
		mobileSubs.style.visibility = "visible";
		videoAudio.style.visibility = "visible";
		settingsPopup.style.visibility = "visible";
		captionsPopup.style.visibility = "visible";
		captionsPopup2.style.visibility = "visible";
	}
	else{document.getElementById("videoControlsBar").style.visibility = "visible";}
	document.getElementById("settingsPopup").style.visibility = "visible";
	document.getElementById("captionsPopup").style.visibility = "visible";
	videoPlayer.style.cursor = "default";
	

	window.clearTimeout(timeoutHandle);
	timeoutHandle = window.setTimeout(hideBars,3000);
}

//hides video controls, mouse
function hideBars(){
	if(!seekSliderClicked && !volumeSliderClicked){
		seekSlider.style.visibility = "hidden";
		if(mobile){
			playBtn.style.visibility = "hidden";
			skipB.style.visibility = "hidden";
			skipF.style.visibility = "hidden";
			settings.style.visibility = "hidden";
			document.getElementById("share").style.visibility = "hidden";
			document.getElementById("timeNum").style.visibility = "hidden";
			fullScreenBtn.style.visibility = "hidden";
			mobileAudio.style.visibility = "hidden";
			mobileSubs.style.visibility = "hidden";
			videoAudio.style.visibility = "hidden";
			settingsPopup.style.visibility = "hidden";
			captionsPopup.style.visibility = "hidden";
			captionsPopup2.style.visibility = "hidden";
		}
		else{document.getElementById("videoControlsBar").style.visibility = "hidden";}
		document.getElementById("settingsPopup").style.visibility = "hidden";
		document.getElementById("captionsPopup").style.visibility = "hidden";
		videoPlayer.style.cursor = "none";
	}
}

//stops the video slider from updating when being moved by user, and the bar from disappearing
function stopSeekUpdate(){
	seekSliderClicked=true;
}
function startSeekUpdate(){
	seekSliderClicked=false;
}

//stops the control bar from disappearing when holding volume slider
function stopVolUpdate(){
	volumeSliderClicked=true;
}
function startVolUpdate(){
	volumeSliderClicked=false;
}

//video slider updates video time, calls function to update timeTexts
function vidSeek(){showBars();
	vidPlayer.currentTime(vidPlayer.seekable().end(0)*(seekSlider.value/1000));
	audPlayer.currentTime(vidPlayer.currentTime());
	seekTimeUpdate();
}

//this function is called many times per second
//updates video slider, volume, timeTexts
function seekTimeUpdate(){
	if(!seekSliderClicked){
		seekSlider.value = vidPlayer.currentTime()*(1000/vidPlayer.seekable().end(0));
	}
	changeVolume();
	
	var curHours = formatDigit(Math.floor(vidPlayer.currentTime()/3600));
	var curMins = formatDigit(Math.floor((vidPlayer.currentTime()/60)%60));
	var curSecs = formatDigit(Math.floor(vidPlayer.currentTime()%60));
	var durHours = formatDigit(Math.floor(vidPlayer.seekable().end(0)/3600));
	var durMins = formatDigit(Math.floor((vidPlayer.seekable().end(0)/60)%60));
	var durSecs = formatDigit(Math.floor(vidPlayer.seekable().end(0)%60));
	
	curTimeText.innerHTML = curHours+":"+curMins+":"+curSecs;
	durTimeText.innerHTML = durHours+":"+durMins+":"+durSecs;
}

function formatDigit(digit){
	if(digit<10){
		if(digit==0){
			digit="00";
		} else {
			digit="0"+digit;
		}
	}
	return digit;
}

//controls the play and pause buttons
function playPause(){showBars();
	settingsPopup.style.display = "none";
	captionsPopup.style.display = "none";
	captionsPopup2.style.display = "none";
	if(vidPaused){
		vidPlayer.play();
		audPlayer.play();
		playBtn.src = "Assets/pause.png";
	} else {
		vidPlayer.pause();
		audPlayer.pause();
		playBtn.src = "Assets/play.png";
	}
	vidPaused=!vidPaused;
}

//skips back 10 seconds, updates vid slider and timeTexts
function skipB10(){showBars();
	vidPlayer.currentTime(vidPlayer.currentTime()-10);
	audPlayer.currentTime(audPlayer.currentTime()-10);
	seekTimeUpdate();
}

//skips forwards 10 seconds, updates vid slider and timeTexts
function skipF10(){showBars();
	vidPlayer.currentTime(vidPlayer.currentTime()+10);
	audPlayer.currentTime(audPlayer.currentTime()+10);
	seekTimeUpdate();
}

//controls mute button, saves volume so unmuting resets volume to original position
function muteVid(){showBars();
	if(audPlayer.muted()){
		audPlayer.muted(false);
		volBtn.src = "Assets/soundNone.png";
		volSlider.value = volume;
		audPlayer.volume(volume);
	}
	else{
		audPlayer.muted(true);
		volBtn.src = "Assets/soundMute.png";
		volume = volSlider.value;
		volSlider.value = 0;
	}
}

//makes the volume slider pop out when over volume button, volPopupHandler is 
//clear background rectangle to make sure slider doesn't disappear when mouse 
//leaves volume button to go to slider
function showVolSlider(){
	volSlider.style.display = "initial";
	volPopupHandler.style.display = "initial";
	document.getElementById("timeNum").style.left = "245px";
}
function hideVolSlider(){
	volSlider.style.display = "none";
	volPopupHandler.style.display = "none";
	document.getElementById("timeNum").style.left = "140px";
}

//updates video volume and the volume icon
function changeVolume(){
	audPlayer.volume((6139797791*0)+volSlider.value/100);
	audPlayer.muted(false);
	if(volSlider.value==0){
		volBtn.src = "Assets/soundMute.png";
		audPlayer.muted(true);
	}
	else if(volSlider.value<33){
		volBtn.src = "Assets/soundLow.png";
	}
	else if(volSlider.value<66){
		volBtn.src = "Assets/soundMed.png";
	}
	else{
		volBtn.src = "Assets/soundHigh.png";
	}
}

//makes the video fullscreen/not
function fullToggle(){showBars();
	if(document.fullscreenElement){
		if (document.exitFullscreen) {
    			document.exitFullscreen();
  		} else if (document.webkitExitFullscreen) { /* Safari */
    			document.webkitExitFullscreen();
  		} else if (document.msExitFullscreen) { /* IE11 */
    			document.msExitFullscreen();
  		}
	}
	else {
		if (videoPlayer.requestFullscreen) {
			videoPlayer.requestFullscreen();
		} else if (videoPlayer.webkitRequestFullscreen) { /* Safari */
			videoPlayer.webkitRequestFullscreen();
		} else if (videoPlayer.msRequestFullscreen) { /* IE11 */
			videoPlayer.msRequestFullscreen();
		}
	}
}

//detects fullscreen change to change icon even if user uses esc or whatever to 
//enter/exit fullscreen, changes vid css to fit right
function editFullIcon(){showBars();
	if(document.fullscreenElement){
		fullScreenBtn.src = "Assets/fullscreenN.png";
	}
	else {
		fullScreenBtn.src = "Assets/fullscreenY.png";
	}
}

//handles hotkey (+/-) video speed changes
function vidSpeedUp(){
	vidRate+=0.25;
	vidPlayer.playbackRate(vidRate);
	vidSpeedChange();
}

function vidSpeedDown(){
	if(vidRate!=0){
		vidRate-=0.25
		vidPlayer.playbackRate(vidRate);
	}
	vidSpeedChange();
}

function vidSpeedChange(){
	audPlayer.playbackRate(vidRate);
	resetSpeed();
	vidSpeed.style.visibility = "initial";
	if(vidRate % 1===0){vidSpeed.innerHTML = vidRate+'.00 x';}
	else if(vidRate % 1===0.5){vidSpeed.innerHTML = vidRate+"0 x";}
	else{vidSpeed.innerHTML = vidRate+' x';}

	if(vidRate==0.75){setSpeed75();}
	else if(vidRate==1){setSpeedNormal();}
	else if(vidRate==1.5){setSpeed15();}
	else if(vidRate==2){setSpeed20();}

	window.clearTimeout(speedTimeoutHandle);
	speedTimeoutHandle = window.setTimeout(function(){vidSpeed.style.visibility = "hidden";},1000);
}

//makes the settings blurb appear, hides captions blurb if necessary so no overlap
function settingsPop(){showBars();
	if(settingsPopup.style.display=="none"){
		settingsPopup.style.display = "initial";
		captionsPopup.style.display = "none";
	}
	else{
		settingsPopup.style.display = "none";
	}
}

//makes the captions blurb appear, hides settingss blurb if necessary so no overlap
function captionsPop(){showBars();
	if(captionsPopup.style.display=="none"){
		captionsPopup.style.display = "initial";
		settingsPopup.style.display = "none";
	}
	else{
		captionsPopup.style.display = "none";
	}
}

function audioPop(){
	if(captionsPopup.style.display=="none"){
		captionsPopup.style.display = "initial";
		captionsPopup2.style.display = "none";
	}
	else{
		captionsPopup.style.display = "none";
	}
}

function subsPop(){
	if(captionsPopup2.style.display=="none" && vidVisible){
		captionsPopup2.style.display = "initial";
		captionsPopup.style.display = "none";
	}
	else{
		captionsPopup2.style.display = "none";
	}
}


//toggles the video while leaving the audio, by hiding video, showing "AUDIO ONLY",
//changing background color from black to grey,
//makes quality and captions unselectable
function videoAudioToggle(){showBars();
	if(vidVisible){
		vidVisible=false;
		document.getElementById('mainStream').style.visibility="hidden";
		audioOnly.style.visibility="visible";
		document.getElementById("video").style.backgroundColor="#2a2a2a";
		videoAudio.src="Assets/audioOnly.png";
		
		document.getElementById("subtitlesTitle").style.color = "grey";
		offSub.style.color = "grey";
		offSub.style.cursor = "default";
		englishSub.style.color = "grey";
		englishSub.style.cursor = "default";
		frenchSub.style.color = "grey";
		frenchSub.style.cursor = "default";
		document.getElementById("qualityTitle").style.color = "grey";
		qualityAuto.style.color = "grey";
		qualityAuto.style.cursor = "default";
		qualityHigh.style.color = "grey";
		qualityHigh.style.cursor = "default";
		qualityMedium.style.color = "grey";
		qualityMedium.style.cursor = "default";
		qualityLow.style.color = "grey";
		qualityLow.style.cursor = "default";
		
		mobileSubs.src="Assets/CCNO.png";
		subtitlesTitle2.style.color="grey";
		offSub2.style.color = "grey";
		englishSub2.style.color = "grey";
		frenchSub2.style.color = "grey";
	}
	else{
		vidVisible=true;
		document.getElementById('mainStream').style.visibility="visible";
		audioOnly.style.visibility="hidden";
		document.getElementById("video").style.backgroundColor="black";
		videoAudio.src="Assets/videoOnly.png";
		
		document.getElementById("subtitlesTitle").style.color = "white";
		if(vidSub=='O'){setSubO();}
		else if(vidSub=='E'){setSubE();}
		else{setSubF();}
		document.getElementById("qualityTitle").style.color = "white";
		if(vidQual=='A'){setQualityA();}
		else if(vidQual=='H'){setQualityH();}
		else if(vidQual=='M'){setQualityM();}
		else{setQualityL();}

		mobileSubs.src="Assets/CCYES.png";
		subtitlesTitle2.style.color="white";
	}
}

//I couldn't figure out how to send arguments to functions called by addEventListener()
//so each option in the settings and captions blurbs calls its own function which 
//calls the overall function to grey/clickable all options, then whites/unclickables 
//the selected one and calls the relevant video function to actually do stuff
//the only alternative I could find was to call a general function with hardcoded
//argument from the HTML itself, which is worse
function resetSpeed(){showBars();
	speed75.style.color = "grey";
	speed75.style.cursor = "pointer";
	speedNormal.style.color = "grey";
	speedNormal.style.cursor = "pointer";
	speed15.style.color = "grey";
	speed15.style.cursor = "pointer";
	speed20.style.color = "grey";
	speed20.style.cursor = "pointer";
}

function setSpeed75(){
	resetSpeed();
	vidPlayer.playbackRate(0.75);
	audPlayer.playbackRate(vidRate);
	vidRate=0.75;
	speed75.style.color = "white";
	speed75.style.cursor = "default";
}

function setSpeedNormal(){
	resetSpeed();
	vidPlayer.playbackRate(1);
	audPlayer.playbackRate(vidRate);
	vidRate=1;
	speedNormal.style.color = "white";
	speedNormal.style.cursor = "default";
}

function setSpeed15(){
	resetSpeed();
	vidPlayer.playbackRate(1.5);
	audPlayer.playbackRate(vidRate);
	vidRate=1.5;
	speed15.style.color = "white";
	speed15.style.cursor = "default";
}

function setSpeed20(){
	resetSpeed();
	vidPlayer.playbackRate(2);
	audPlayer.playbackRate(vidRate);
	vidRate=2;
	speed20.style.color = "white";
	speed20.style.cursor = "default";
}

function resetQuality(){showBars();
	qualityAuto.style.color = "grey";
	qualityAuto.style.cursor = "pointer";
	qualityHigh.style.color = "grey";
	qualityHigh.style.cursor = "pointer";
	qualityMedium.style.color = "grey";
	qualityMedium.style.cursor = "pointer";
	qualityLow.style.color = "grey";
	qualityLow.style.cursor = "pointer";
}

function setQualityA(){
	if(vidVisible){
		resetQuality();
		qualityAuto.style.color = "white";
		qualityAuto.style.cursor = "default";
		vidQual='A';
		
		minQual=0;
		maxQual=Number.MAX_SAFE_INTEGER;
		var qualityLevels = vidPlayer.qualityLevels();
		for (var i = 0; i < qualityLevels.length; i++) {
			var level = qualityLevels[i];
			level.enabled=true;
			console.log('QL: '+parseInt(level.bitrate/1000)+'kbps  '+level.enabled);
		}
	}
}

function setQualityH(){
	if(vidVisible){
		resetQuality();
		qualityHigh.style.color = "white";
		qualityHigh.style.cursor = "default";
		vidQual='H';
		
		minQual=5000000;
		maxQual=Number.MAX_SAFE_INTEGER;
		var qualityLevels = vidPlayer.qualityLevels();
		for (var i = 0; i < qualityLevels.length; i++) {
			var level = qualityLevels[i];
			//7267791;
			level.enabled=(level.bitrate>minQual && level.bitrate<maxQual);
			console.log('QL: '+parseInt(level.bitrate/1000)+'kbps  '+level.enabled);
		}
	}
}

function setQualityM(){
	if(vidVisible){
		resetQuality();
		qualityMedium.style.color = "white";
		qualityMedium.style.cursor = "default";
		vidQual='M';
		
		minQual=2000000;
		maxQual=5000000;
		var qualityLevels = vidPlayer.qualityLevels();
		for (var i = 0; i < qualityLevels.length; i++) {
			var level = qualityLevels[i];
			level.enabled=(level.bitrate>minQual && level.bitrate<maxQual);
			console.log('QL: '+parseInt(level.bitrate/1000)+'kbps  '+level.enabled);
		}
	}
}

function setQualityL(){
	if(vidVisible){
		resetQuality();
		qualityLow.style.color = "white";
		qualityLow.style.cursor = "default";
		vidQual='L';
		
		minQual=0;
		maxQual=2000000;
		var qualityLevels = vidPlayer.qualityLevels();
		for (var i = 0; i < qualityLevels.length; i++) {
			var level = qualityLevels[i];
			level.enabled=(level.bitrate>minQual && level.bitrate<maxQual);
			console.log('QL: '+parseInt(level.bitrate/1000)+'kbps  '+level.enabled);
		}
	}
}

function resetAudio(){showBars();
	englishAud.style.color = "grey";
	englishAud.style.cursor = "pointer";
	frenchAud.style.color = "grey";
	frenchAud.style.cursor = "pointer";
	floorAud.style.color = "grey";
	floorAud.style.cursor = "pointer";
}

function setAudE(){
	resetAudio();
	englishAud.style.color = "white";
	englishAud.style.cursor = "default";
	if(mobile){mobileAudio.src="Assets/AUDEN.png"}
	vidAud='E';
	curAudSrc=englishAudio;
	changeSources(curVidSrc,curAudSrc);
}

function setAudF(){
	resetAudio();
	frenchAud.style.color = "white";
	frenchAud.style.cursor = "default";
	if(mobile){mobileAudio.src="Assets/AUDFR.png"}
	vidAud='F';
	curAudSrc=frenchAudio;
	changeSources(curVidSrc,curAudSrc);
}

function setAudR(){
	resetAudio();
	floorAud.style.color = "white";
	floorAud.style.cursor = "default";
	if(mobile){mobileAudio.src="Assets/AUDFL.png"}
	vidAud='R';
	curAudSrc=floorAudio;
	changeSources(curVidSrc,curAudSrc);
}

function resetCaptions(){showBars();
	offSub.style.color = "grey";
	offSub.style.cursor = "pointer";
	englishSub.style.color = "grey";
	englishSub.style.cursor = "pointer";
	frenchSub.style.color = "grey";
	frenchSub.style.cursor = "pointer";

	offSub2.style.color = "grey";
	englishSub2.style.color = "grey";
	frenchSub2.style.color = "grey";
}

function setSubO(){
	if(vidVisible){
		resetCaptions();
		offSub.style.color = "white";
		offSub2.style.color = "white";
		offSub.style.cursor = "default";
		vidSub='O';
		curVidSrc=noCaptions;
		changeSources(curVidSrc,curAudSrc);
	}
}

function setSubE(){
	if(vidVisible){
		resetCaptions();
		englishSub.style.color = "white";
		englishSub2.style.color = "white";
		englishSub.style.cursor = "default";
		vidSub='E';
		curVidSrc=englishCaptions;
		changeSources(curVidSrc,curAudSrc);
	}
}

function setSubF(){
	if(vidVisible){
		resetCaptions();
		frenchSub.style.color = "white";
		frenchSub2.style.color = "white";
		frenchSub.style.cursor = "default";
		vidSub='F';
		curVidSrc=frenchCaptions;
		changeSources(curVidSrc,curAudSrc);
	}
}

//If the user hits the 'c' key, toggles captions:
//If on, turn off. If off, turn on to same language as audio. 
//If audio is floor, open captions popup menu.
function hotkeyCaptions(){
	if(vidSub!='O'){
		setSubO();
	}
	else if(vidAud=='E'){
		setSubE();
	}
	else if(vidAud=='F'){
		setSubF();
	}
	else{
		captionsPopup.style.display = "initial";
		settingsPopup.style.display = "none";
	}
}

function changeSources(vidSrc,audSrc){
	timeA=vidPlayer.currentTime();
	vidPlayer.dispose();
	audPlayer.dispose();
	createVidPlayer(vidSrc);
	createAudPlayer(audSrc);


	vidPlayer.ready(function(){
		audPlayer.ready(function(){
			window.setTimeout(function(){
				audPlayer.currentTime(timeA);
				vidPlayer.currentTime(timeA);
				audPlayer.playbackRate(vidRate);
				vidPlayer.playbackRate(vidRate);
				if(!vidVisible){document.getElementById('mainStream').style.visibility="hidden";}
				if(vidPaused){
					vidPlayer.pause();
					audPlayer.pause();
				}
				else{
					audPlayer.play();
					vidPlayer.play();
				}
			},500);
		});
	});
	changeVolume();
	//calls before ready in above .ready{} things, so putting here, 1 second delay, works
	window.setTimeout(function(){if(vidQual=='A'){setQualityA();}else if(vidQual=='H'){setQualityH();}else if(vidQual=='M'){setQualityM();}else{setQualityL();}},1000);
}

//==============================================================

var vidPlayer, audPlayer, curVidSrc, curAudSrc, video;
function createVidPlayer(url) {
	video = document.createElement('video');
	video.id = 'mainStream';
	video.className = 'video-js vjs-default-skin';
	video.setAttribute('muted',true);
	video.setAttribute('autoplay',true);
	video.setAttribute('poster','Assets/HoC.jfif');
	video.onerror = function() {console.log("Error with media: " + obj.error.code);}
	document.querySelector('#video').appendChild(video);

	var options = { 
		qualityLevels: {},
		fluid: true	//CRITICAL, FIXES VIDEO SIZE STUFF
	};
	var type = 'application/x-mpegURL';

	try {
		vidPlayer = videojs(video.id, options);

		vidPlayer.src({
			src: url,
			type: type
		});
	
	} catch(err) {
		console.log("caught an error trying to create and add src to player:", err);
	}
}

function createAudPlayer(url) {
	var audio = document.createElement('AUDIO');																						//Made by Alexander Breeze
	audio.id = 'audioPlayer';
	audio.className = 'video-js vjs-default-skin';
	audio.setAttribute('autoplay',true);
	document.querySelector('#video').appendChild(audio);

	var type = 'application/x-mpegURL';

	try {
		audPlayer = videojs(audio.id, {});

		audPlayer.src({
			src: url,
			type: type
		});
	} catch(err) {
		console.log("caught an error trying to create and add src to player:", err);
	}
}
createVidPlayer(noCaptions);
createAudPlayer(floorAudio);
audPlayer.ready(function(){
	vidPlayer.ready(function(){
		window.setTimeout(function(){
			if(audPlayer.paused()){
				vidPlayer.pause();
				playBtn.src = "Assets/play.png";
				vidPaused=!vidPaused;
			}
		},500);
	});
});
curAudSrc=noCaptions;
curVidSrc=floorAudio;
window.setInterval(seekTimeUpdate, 25);

window.setInterval(sizePlayer,500);

function sizePlayer(){
	if(mobile && window.innerWidth<1000){
		if(videoPlayer.offsetHeight+185>window.innerHeight){
			var sideMargin=((window.innerWidth-((window.innerHeight-185)*(videoPlayer.offsetWidth/videoPlayer.offsetHeight)))/2);
			content.style.left=(sideMargin)+"px";
			content.style.right=(sideMargin)+"px";
		} else if (content.style.left!=12 && videoPlayer.offsetHeight+185<window.innerHeight){
			var sideMargin=((window.innerWidth-((window.innerHeight-185)*(videoPlayer.offsetWidth/videoPlayer.offsetHeight)))/2);
			if(sideMargin>=12){
				content.style.left=(sideMargin)+"px";
				content.style.right=(sideMargin)+"px";
			} else {
				content.style.left="12px";
				content.style.right="12px";
			}
		}
	}
	else{
		if(videoPlayer.offsetHeight+85+60>window.innerHeight){
			var sideMargin=((window.innerWidth-((window.innerHeight-85-60)*(videoPlayer.offsetWidth/videoPlayer.offsetHeight))-298)/2)-9;
			content.style.left=(298+sideMargin)+"px";
			content.style.right=(sideMargin)+"px";
		} else if (content.style.left!=310 && videoPlayer.offsetHeight+85+60<window.innerHeight){
			var sideMargin=((window.innerWidth-((window.innerHeight-85-60)*(videoPlayer.offsetWidth/videoPlayer.offsetHeight))-298)/2)-9;
			if(sideMargin>=12){
				content.style.left=(298+sideMargin)+"px";
				content.style.right=(sideMargin)+"px";
			} else {
				content.style.left="310px";
				content.style.right="12px";
			}
		}
	}
}


//keeps the audio synced to the video by changing playbackRate or just hopping breezily
function syncTime(){
	var a=audPlayer.currentTime();
	var v=vidPlayer.currentTime();
	if(Math.abs(a-v)>2){audPlayer.currentTime(v);}
	else if((a-v)>0.1){audPlayer.playbackRate(vidPlayer.playbackRate()-0.1);}
	else if((a-v)<-0.1){audPlayer.playbackRate(vidPlayer.playbackRate()+0.1);}
	else{audPlayer.playbackRate(vidPlayer.playbackRate());}
}
window.setInterval(syncTime, 1000);
