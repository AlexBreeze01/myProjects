/*javascript file by Alex Breeze, written for an HTML5 video player*/

var audioOffset=-10; //audio is ahead by 10 seconds in this recording, this was my best solution. If it creates an audio desync later just set it to 0

//add .M3U8 files here, in following format:
// var frenchAudio = "http://french_audio_link.m3u8";
var noCaptions =      "https://parlvuvod.azureedge.net/pvvodhoc-fl/_definst_/mp4:azrhoc/archives/PV750/2021/2021-03-09/34860_HoC%20Sitting%20No.%2069_10-02-40_VL.mp4/playlist.m3u8";
var englishCaptions = "https://parlvuvod.azureedge.net/pvvodhoc-en/_definst_/mp4:azrhoc/archives/PV750/2021/2021-03-09/34860_HoC%20Sitting%20No.%2069_10-02-40_VL.mp4/playlist.m3u8";
var frenchCaptions =  "https://parlvuvod.azureedge.net/pvvodhoc-fr/_definst_/mp4:azrhoc/archives/PV750/2021/2021-03-09/34860_HoC%20Sitting%20No.%2069_10-02-40_VL.mp4/playlist.m3u8";
var floorAudio =      "https://parlvuvod.azureedge.net/pvvodhoc/_definst_/mp4:azrhoc/archives/PV750/2021/2021-03-09/34860_HoC%20Sitting%20No.%2069_10-02-40_FL.mp4/playlist.m3u8";
var englishAudio =    "https://parlvuvod.azureedge.net/pvvodhoc/_definst_/mp4:azrhoc/archives/PV750/2021/2021-03-09/34860_HoC%20Sitting%20No.%2069_10-02-40_EN.mp4/playlist.m3u8";
var frenchAudio =     "https://parlvuvod.azureedge.net/pvvodhoc/_definst_/mp4:azrhoc/archives/PV750/2021/2021-03-09/34860_HoC%20Sitting%20No.%2069_10-02-40_FR.mp4/playlist.m3u8";

//DOM elements from HTML:
var videoPlayer, seekSlider, playPause, skipB, skipF, volBtn, volSlider, curTimeText, durTimeText, fullScreenBtn, settings, settingsPopup, captions, captionsPopup, 
speed75, speedNormal, speed15, speed20, qualityAuto, qualityHigh, qualityMedium, qualityLow, englishAud, frenchAud, floorAud, offSub, englishSub, frenchSub, videoNobar, 
vidSpeed, alex, minQual, maxQual, mobileAudio, mobileSubs, captionsPopup2, subtitlesTitle2, offSub2, englishSub2, frenchSub2, xButton, miniButton, sizeButton, goTo, 
rButton;

//state variables for backend modeling
var cssLink, lightboxX, lightboxY, stopPlayPause, isFirefox, holdTime, wasFull, vidPlayer, audPlayer, curVidSrc, curAudSrc, video, interval1, interval2, interval3;
var seekSliderClicked, volumeSliderClicked, volume, timeoutHandle, speedTimeoutHandle, vidAud, vidSub, vidQual, vidPaused, vidRate, mobile, vidMinimised, vidLightbox;
var x1, y1, xstart, ystart;

function initializePlayer(){
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
	xButton = document.getElementById("xButton");
	miniButton = document.getElementById("-Button");
	sizeButton = document.getElementById("minMax");
	goTo=document.getElementById("goTo");
	rButton=document.getElementById("rButton");

	isFirefox = typeof InstallTrigger !== 'undefined';
	if(isFirefox){
		window.setInterval(function(){document.getElementById("leftColPic").src="Assets/scrollBig.png";},300); //fixes firefox not loading all of images
		document.getElementById("rightBarSeparator").paddingBottom="2000px";
	}
	mobile = isFirefox ? (!(navigator.maxTouchPoints)) : ('ontouchstart' in document.documentElement);

	seekSliderClicked=false;
	volumeSliderClicked=false;
	volume=50;
	vidAud='R';
	vidSub='O';
	vidQual=mobile?'H':'A';
	vidPaused=false;
	vidRate=1;
	minQual=0;
	maxQual=Number.MAX_SAFE_INTEGER;
	vidMinimised=false;
	vidLightbox=true;
	holdTime=false;
	wasFull = false;
	lightboxX = videoPlayer.style.left;
	lightboxY = '0px';
	lightboxW = videoPlayer.style.width;
	stopPlayPause = false;

	videoPlayer.addEventListener("mousemove",showBars,false);
	videoPlayer.addEventListener("mouseout",hideBars,false);
	if(!mobile){videoNobar.addEventListener("click",playPause,false);}
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
	xButton.addEventListener("click",deleteVideo,false);
	miniButton.addEventListener("click",minToggle,false);
	sizeButton.addEventListener("click",sizeVideo,false);
	goTo.addEventListener("click",goToLinkA,false);

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

	cssLink = document.createElement('link');
	cssLink.rel = "stylesheet";
	cssLink.type = "text/css";
	cssLink.href = mobile ? "vidTouchLight.css" : "vidClickLight.css";
	document.head.appendChild(cssLink);
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

document.addEventListener('keydown', logKey); //firefox doesnt see (+/-) so handled here
function logKey(e) {
	if(e.key==='=' || e.key==='+'){vidSpeedUp();event.stopPropagation();}
	if(e.key==='-' || e.key==='_'){vidSpeedDown();event.stopPropagation();}
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
		settingsPopup.style.visibility = "visible";
		captionsPopup.style.visibility = "visible";
		captionsPopup2.style.visibility = "visible";
		goTo.style.visibility = "visible";
	}
	else{document.getElementById("videoControlsBar").style.visibility = "visible";}
	document.getElementById("settingsPopup").style.visibility = "visible";
	document.getElementById("captionsPopup").style.visibility = "visible";
	videoPlayer.style.cursor = "default";
	xButton.style.visibility = "visible";
	miniButton.style.visibility = "visible";
	if(vidLightbox){rButton.style.visibility = "visible";}
	sizeButton.style.visibility = "visible";
	
	window.clearTimeout(timeoutHandle);
	timeoutHandle = window.setTimeout(hideBars,3000);
}

//hides video controls, mouse
function hideBars(){
	if(!seekSliderClicked && !volumeSliderClicked && !vidMinimised){
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
			settingsPopup.style.visibility = "hidden";
			captionsPopup.style.visibility = "hidden";
			captionsPopup2.style.visibility = "hidden";
			goTo.style.visibility = "hidden";
		}
		else{document.getElementById("videoControlsBar").style.visibility = "hidden";}
		document.getElementById("settingsPopup").style.visibility = "hidden";
		document.getElementById("captionsPopup").style.visibility = "hidden";
		videoPlayer.style.cursor = "none";
		xButton.style.visibility = "hidden";
		miniButton.style.visibility = "hidden";
		sizeButton.style.visibility = "hidden";
		rButton.style.visibility = "hidden";
	}
}

//stops position slider from updating and control bar from disappearing when holding position slider
function stopSeekUpdate(){
	seekSliderClicked=true;
}
function startSeekUpdate(){
	seekSliderClicked=false;
}

//stops control bar from disappearing when holding volume slider
function stopVolUpdate(){
	volumeSliderClicked=true;
}
function startVolUpdate(){
	volumeSliderClicked=false;
}

//video slider updates video time, calls function to update timeTexts
function vidSeek(){showBars();
	vidPlayer.currentTime(vidPlayer.seekable().end(0)*(seekSlider.value/1000));
	audPlayer.currentTime(vidPlayer.currentTime()+audioOffset);
	seekTimeUpdate();
}

//this function is called many times per second
//updates video slider, volume, timeTexts
function seekTimeUpdate(){
	if(vidPlayer.readyState()==4){
		if(!seekSliderClicked){
			seekSlider.value = vidPlayer.currentTime()*(1000/vidPlayer.seekable().end(0));
		}
		var curHours = formatDigit(Math.floor(vidPlayer.currentTime()/3600));
		var curMins = formatDigit(Math.floor((vidPlayer.currentTime()/60)%60));
		var curSecs = formatDigit(Math.floor(vidPlayer.currentTime()%60));
		var durHours = formatDigit(Math.floor(vidPlayer.seekable().end(0)/3600));
		var durMins = formatDigit(Math.floor((vidPlayer.seekable().end(0)/60)%60));
		var durSecs = formatDigit(Math.floor(vidPlayer.seekable().end(0)%60));
		curTimeText.innerHTML = curHours+":"+curMins+":"+curSecs;
		durTimeText.innerHTML = durHours+":"+durMins+":"+durSecs;
	}
	if(audPlayer.readyState()==4){changeVolume();}
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
	if(!stopPlayPause){
		settingsPopup.style.display = "none";
		captionsPopup.style.display = "none";
		captionsPopup2.style.display = "none";
		if(vidPaused){
			vidPlayer.play();
			audPlayer.play();
			playBtn.src = "Assets/pause.png";
			playBtn.title = "pause";
		} else {
			vidPlayer.pause();
			audPlayer.pause();
			playBtn.src = "Assets/play.png";
			playBtn.title = "play";
		}
		vidPaused=!vidPaused;
	}
}

//skips back 10 seconds, updates vid slider and timeTexts
function skipB10(){showBars();
	vidPlayer.currentTime(vidPlayer.currentTime()-10);
	audPlayer.currentTime(audPlayer.currentTime()-10+audioOffset);
	seekTimeUpdate();
}

//skips forwards 10 seconds, updates vid slider and timeTexts
function skipF10(){showBars();
	vidPlayer.currentTime(vidPlayer.currentTime()+10);
	audPlayer.currentTime(audPlayer.currentTime()+10+audioOffset);
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

//makes the volume slider pop out when over volume button, volPopupHandler is clear background 
//rectangle to make sure slider doesn't disappear when mouse leaves volume button to go to slider
function showVolSlider(){
	volSlider.style.display = "initial";
	volPopupHandler.style.display = "initial";
	if(((vidLightbox && !vidMinimised) || document.fullscreenElement) && !mobile){document.getElementById("timeNum").style.left = "245px";}
}
function hideVolSlider(){
	volSlider.style.display = "none";
	volPopupHandler.style.display = "none";
	if(((vidLightbox && !vidMinimised) || document.fullscreenElement) && !mobile){document.getElementById("timeNum").style.left = "140px";}
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

//handles hotkey (+/-) video speed changes
function vidSpeedUp(){
	if(vidRate!=16){
		vidRate+=0.25;
		vidPlayer.playbackRate(vidRate);
	}
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

	if(vidRate==0.75){setSpeed75();}	//updates settings menu
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
	if(captionsPopup2.style.display=="none" && !vidMinimised){
		captionsPopup2.style.display = "initial";
		captionsPopup.style.display = "none";
	}
	else{
		captionsPopup2.style.display = "none";
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
	audPlayer.playbackRate(0.75);
	vidRate=0.75;
	speed75.style.color = "white";
	speed75.style.cursor = "default";
}

function setSpeedNormal(){
	resetSpeed();
	vidPlayer.playbackRate(1);
	audPlayer.playbackRate(1);
	vidRate=1;
	speedNormal.style.color = "white";
	speedNormal.style.cursor = "default";
}

function setSpeed15(){
	resetSpeed();
	vidPlayer.playbackRate(1.5);
	audPlayer.playbackRate(1.5);
	vidRate=1.5;
	speed15.style.color = "white";
	speed15.style.cursor = "default";
}

function setSpeed20(){
	resetSpeed();
	vidPlayer.playbackRate(2);
	audPlayer.playbackRate(2);
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
	if(!vidMinimised){
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
	if(!vidMinimised){
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
	if(!vidMinimised){
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
	if(!vidMinimised){
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
	if(vidAud!='E'){
		resetAudio();
		englishAud.style.color = "white";
		englishAud.style.cursor = "default";
		if(mobile){mobileAudio.src="Assets/AUDEN.png"}
		vidAud='E';
		curAudSrc=englishAudio;
		changeAudSrc(curAudSrc);
	}
}

function setAudF(){
	if(vidAud!='F'){
		resetAudio();
		frenchAud.style.color = "white";
		frenchAud.style.cursor = "default";
		if(mobile){mobileAudio.src="Assets/AUDFR.png"}
		vidAud='F';
		curAudSrc=frenchAudio;
		changeAudSrc(curAudSrc);
	}
}

function setAudR(){
	if(vidAud!='R'){
		resetAudio();
		floorAud.style.color = "white";
		floorAud.style.cursor = "default";
		if(mobile){mobileAudio.src="Assets/AUDFL.png"}
		vidAud='R';
		curAudSrc=floorAudio;
		changeAudSrc(curAudSrc);
	}
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
	if(!vidMinimised && vidSub!='O'){
		resetCaptions();
		offSub.style.color = "white";
		offSub2.style.color = "white";
		offSub.style.cursor = "default";
		vidSub='O';
		curVidSrc=noCaptions;
		changeVidSrc(curVidSrc);
	}
}

function setSubE(){
	if(!vidMinimised && vidSub!='E'){
		resetCaptions();
		englishSub.style.color = "white";
		englishSub2.style.color = "white";
		englishSub.style.cursor = "default";
		vidSub='E';
		curVidSrc=englishCaptions;
		changeVidSrc(curVidSrc);
	}
}

function setSubF(){
	if(!vidMinimised && vidSub!='F'){
		resetCaptions();
		frenchSub.style.color = "white";
		frenchSub2.style.color = "white";
		frenchSub.style.cursor = "default";
		vidSub='F';
		curVidSrc=frenchCaptions;
		changeVidSrc(curVidSrc);
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

//===========================================================================================================================================================
var freezeSync=false;
function changeVidSrc(vidSrc){
	if(!holdTime){timeA=vidPlayer.currentTime();holdTime=true;}
	vidPlayer.dispose();
	createVidPlayer(vidSrc);
	function initVidPlayerB(){
		if(vidPlayer.readyState()==4){
			if(audPlayer.readyState()==4){
				vidPlayer.currentTime(audPlayer.currentTime()-audioOffset);
			} else {
				vidPlayer.currentTime(timeA);
			}
			holdTime=false;
			vidPlayer.playbackRate(vidRate);
			if(vidMinimised){document.getElementById('mainStream').style.visibility="hidden";}
			if(vidPaused){
				vidPlayer.pause();
			}
			else{
				vidPlayer.play();
			}
			if(vidQual=='A'){setQualityA();}else if(vidQual=='H'){setQualityH();}else if(vidQual=='M'){setQualityM();}else{setQualityL();}
			freezeSync=false;
		} else {
			window.setTimeout(initVidPlayerB,100);
		}
	}
	freezeSync=true;
	window.setTimeout(initVidPlayerB,100);
}

function changeAudSrc(audSrc){
	if(!holdTime){timeA=vidPlayer.currentTime();holdTime=true;}
	audPlayer.dispose();
	createAudPlayer(audSrc);
	function initAudPlayerB(){
		if(audPlayer.readyState()==4){
			if(vidPlayer.readyState()==4){
				audPlayer.currentTime(vidPlayer.currentTime()+audioOffset);
			} else {
				audPlayer.currentTime(timeA+audioOffset);
			}
			holdTime=false;
			audPlayer.playbackRate(vidRate);
			if(vidPaused){
				audPlayer.pause();
			}
			else{
				audPlayer.play();
			}
			changeVolume();
		} else {
			window.setTimeout(initAudPlayerB,100);
		}
	}
	freezeSync=true;
	window.setTimeout(initAudPlayerB,100);
}

function goToLinkA(){
	window.open("https://parlvu.parl.gc.ca/Harmony/en/PowerBrowser/PowerBrowserV2/20210309/-1/34860?gefdesc=&startposition=20210309100401","_blank")
}

function deleteVideo(){
	vidPlayer.dispose();
	audPlayer.dispose();
	clearInterval(interval1);
	clearInterval(interval2);
	clearInterval(interval3);
	if(document.fullscreenElement){
		if (document.exitFullscreen) {
    			document.exitFullscreen();
  		} else if (document.webkitExitFullscreen) { /* Safari */
    			document.webkitExitFullscreen();
  		} else if (document.msExitFullscreen) { /* IE11 */
    			document.msExitFullscreen();
  		}
		wasFull = true;
	} else {wasFull = false;}
	hideBars();
	videoPlayer.style.display="none";
}

function minToggle(){
	if(vidMinimised){
		document.getElementById("video").style.visibility = "visible";
		if(vidLightbox){cssLink.href=mobile ? "vidTouchLight.css" : "vidClickLight.css";if(!mobile){document.getElementById("timeNum").style.left = "140px";}startDrag();videoPlayer.style.left=lightboxX;videoPlayer.style.top=lightboxY;videoPlayer.style.width=lightboxW;}
		document.getElementById("videoControlsBar").style.backgroundColor = "transparent";
		videoNobar.style.height="auto";
		if(mobile){
			miniButton.style.right="30px";
			miniButton.style.bottom="auto";
			miniButton.style.top="0";
			miniButton.width="20px";
		} else {
			xButton.style.right="10px";
			xButton.style.bottom="auto";
			xButton.style.top="10px";
			xButton.height="20px";
			miniButton.style.right="40px";
			miniButton.style.bottom="auto";
			miniButton.style.top="10px";
			miniButton.width="20px";
		}
		miniButton.src="Assets/-.png";
		miniButton.title="minimize";
		vidMinimised=false;
		
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
	} else {
		videoPlayer.style.left="auto";
		videoPlayer.style.top="auto";
		videoPlayer.style.width="100%";
		stopDrag();
		document.getElementById("video").style.visibility = "hidden";
		if(document.fullscreenElement){fullToggle();}
		cssLink.href=mobile ? "vidTouchMini.css" : "vidClickMini.css";
		if(!mobile){document.getElementById("timeNum").style.left = "125px";}
		document.getElementById("videoControlsBar").style.backgroundColor = "grey";
		document.getElementById("videoControlsBar").style.visibility = "visible";
		videoNobar.style.height="0px";
		if(mobile){
			miniButton.style.right="100px";
			miniButton.style.bottom="30px";
			miniButton.style.top="auto";
			miniButton.width="18px";
		} else {
			xButton.style.right="92px";
			xButton.style.bottom="33px";
			xButton.style.top="auto";
			xButton.height="17px";
			miniButton.style.right="92px";
			miniButton.style.bottom="13px";
			miniButton.style.top="auto";
			miniButton.width="18px";
		}
		miniButton.src=vidLightbox ? "Assets/maxPlayer.png" : "Assets/minPlayer.png";
		miniButton.title=vidLightbox ? "lightbox" : "miniplayer";

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
		vidMinimised=true;
	}
}

function sizeVideo(){
	if(document.fullscreenElement){fullToggle();}
	if(vidMinimised){minToggle();}
	if(vidLightbox){
		videoPlayer.style.left="auto";
		videoPlayer.style.top="auto";
		videoPlayer.style.width="100%";
		stopDrag();
		sizeButton.src="Assets/maxPlayer.png";
		sizeButton.title="lightbox";
		cssLink.href=mobile ? "vidTouchMini.css" : "vidClickMini.css";
		vidLightbox=false;
		if(!mobile){document.getElementById("timeNum").style.left = "125px";}
	} else {
		videoPlayer.style.left=lightboxX;
		videoPlayer.style.top=lightboxY;
		videoPlayer.style.width=lightboxW;
		startDrag();
		sizeButton.src="Assets/minPlayer.png";
		sizeButton.title="miniplayer";
		cssLink.href=mobile ? "vidTouchLight.css" : "vidClickLight.css";
		vidLightbox=true;
		if(!mobile){document.getElementById("timeNum").style.left = "140px";}
	}
}

//makes the video fullscreen/not
function fullToggle(){showBars();
	if(vidMinimised){minToggle();}
	cssLink.href=mobile ? "vidTouchLight.css" : "vidClickLight.css";
	if(document.fullscreenElement){
		if (document.exitFullscreen) {
    			document.exitFullscreen();
  		} else if (document.webkitExitFullscreen) { /* Safari */
    			document.webkitExitFullscreen();
  		} else if (document.msExitFullscreen) { /* IE11 */
    			document.msExitFullscreen();
  		}
		if(!vidLightbox){cssLink.href=mobile ? "vidTouchMini.css" : "vidClickMini.css";}
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
		stopDrag();
		fullScreenBtn.title="exit fullscreen";
	}
	else {
		fullScreenBtn.src = "Assets/fullscreenY.png";
		if(!vidLightbox){cssLink.href=mobile ? "vidTouchMini.css" : "vidClickMini.css";}else{startDrag();}
		fullScreenBtn.title="fullscreen";
	}
}

function createVidPlayer(url) {
	video = document.createElement('video');
	video.id = 'mainStream';
	video.className = 'video-js vjs-default-skin';
	video.setAttribute('muted',true);
	//video.setAttribute('autoplay',true);
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
	//audio.setAttribute('autoplay',true);
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

function startAll(time){
	videoPlayer.style.display="initial";
	try{
		vidPlayer.dispose();
		audPlayer.dispose();
		clearInterval(interval1);
		clearInterval(interval2);
		clearInterval(interval3);
	}
	catch(err){}
	
	if(typeof curAudSrc=='undefined'){curAudSrc=floorAudio;}
	createAudPlayer(curAudSrc);
	if(typeof curVidSrc=='undefined'){curVidSrc=noCaptions;}
	createVidPlayer(curVidSrc);

	function initAll(){
		if(vidPlayer.readyState()==4 && audPlayer.readyState()==4){
			audPlayer.play();
			if(!audPlayer.paused()){vidPlayer.play();}else{playBtn.src = "Assets/play.png";playBtn.title = "play";vidPaused=true;}
			changeVolume();
			vidPlayer.playbackRate(vidRate);
			audPlayer.playbackRate(vidRate);
			if(vidQual=='A'){setQualityA();}else if(vidQual=='H'){setQualityH();}else if(vidQual=='M'){setQualityM();}else{setQualityL();}
			var qualityLevels = vidPlayer.qualityLevels();
			for (var i = 0; i < qualityLevels.length; i++) {
				var level = qualityLevels[i];
				level.enabled=(level.bitrate>minQual && level.bitrate<maxQual);
			}
			freezeSync=false;
		} else {
			window.setTimeout(initAll,100);
		}
	}
	freezeSync=true;
	window.setTimeout(initAll,100);

	vidPlayer.ready(function(){vidPlayer.currentTime(time);});
	audPlayer.ready(function(){audPlayer.currentTime(time+audioOffset);});

	playBtn.src = "Assets/pause.png";
	playBtn.title = "pause";
	vidPaused=false;
	if(wasFull){fullToggle();}

	seekSliderClicked=false;
	volumeSliderClicked=false;

	interval1=window.setInterval(seekTimeUpdate, 25);
	interval2=window.setInterval(syncTime, 1000);
	interval3=window.setInterval(halfSec, 500);
}

//keeps the audio synced to the video by changing playbackRate or just hopping breezily
function syncTime(){
	if(!freezeSync){
		var a=audPlayer.currentTime()+audioOffset;
		var v=vidPlayer.currentTime();
		if(Math.abs(a-v)>2){audPlayer.currentTime(v+audioOffset);}
		else if((a-v)>0.1){audPlayer.playbackRate(vidPlayer.playbackRate()-0.1);}
		else if((a-v)<-0.1){audPlayer.playbackRate(vidPlayer.playbackRate()+0.1);}
		else{audPlayer.playbackRate(vidPlayer.playbackRate());}
	}
}

//runs 2x/seconds, resets lightbox if out of frame (move it far, then resize viewport, ex. change orientation/window size)
function halfSec(){
	if(vidLightbox){
		if(parseInt(videoPlayer.style.left.replace("px",""))>window.innerWidth-30){
			lightboxX = (window.outerWidth>1140) ? ((100%-1140)/2)+16+'px' : "16px";
			videoPlayer.style.left = lightboxX;
			videoPlayer.removeEventListener("touchmove",dragMobileMove,false);
			videoPlayer.removeEventListener("touchend",dragMobileEnd,false);
			videoPlayer.removeEventListener("mousemove",dragMove);
			videoPlayer.removeEventListener("mouseup",dragEnd);
			if((lightboxX!=xstart+'px' || lightboxY!=ystart+'px')&& lightboxY!="0px" && lightboxX!=((100%-1140)/2)+16+'px'){window.setTimeout(function(){stopPlayPause=false},10);}else{stopPlayPause=false;}

		}
		if(parseInt(videoPlayer.style.top.replace("px",""))>window.innerHeight-30){
			lightboxY = "0px";
			videoPlayer.style.top = "0px";
			videoPlayer.removeEventListener("touchmove",dragMobileMove,false);
			videoPlayer.removeEventListener("touchend",dragMobileEnd,false);
			videoPlayer.removeEventListener("mousemove",dragMove);
			videoPlayer.removeEventListener("mouseup",dragEnd);
			if((lightboxX!=xstart+'px' || lightboxY!=ystart+'px')&& lightboxY!="0px" && lightboxX!=((100%-1140)/2)+16+'px'){window.setTimeout(function(){stopPlayPause=false},10);}else{stopPlayPause=false;}

		}
	}
}

//==============================================================================================================================================================

function startDrag(){
	if(mobile){
		videoPlayer.addEventListener("touchstart",dragMobileStart,false);
		videoPlayer.addEventListener("touchstart",resizeMobileStart,false);
	} else {
		videoPlayer.addEventListener("mousedown",dragStart,false);
		videoPlayer.addEventListener("mousedown",resizeStart,false);
		rButton.ondragstart = function() { return false; };
	}
}
function stopDrag(){
	if(mobile){
		videoPlayer.removeEventListener("touchstart",dragMobileStart,false);
		videoPlayer.removeEventListener("touchstart",resizeMobileStart,false);
	} else {
		videoPlayer.removeEventListener("mousedown",dragStart);
		videoPlayer.removeEventListener("mousedown",resizeStart);
	}
}
window.setTimeout(startDrag,10);

function dragStart(){
	if(event.y-videoPlayer.offsetTop>vidPlayer.currentHeight()-50 || (event.y-videoPlayer.offsetTop<30 && event.x-videoPlayer.offsetLeft<30)){return;}
	stopPlayPause=true;
	xstart=videoPlayer.offsetLeft;
	ystart=videoPlayer.offsetTop;
	x1 = event.x;
	y1 = event.y;
	videoPlayer.addEventListener("mousemove",dragMove,false);
	videoPlayer.addEventListener("mouseup",dragEnd,false);
}
function dragMove(){
	var dX = event.x - x1;
	var dY = event.y - y1;
	videoPlayer.style.left = xstart + dX + 'px';
	videoPlayer.style.top = ystart + dY + 'px';
	lightboxX = xstart + dX + 'px';
	lightboxY = ystart + dY + 'px';
}
function dragEnd(){
	videoPlayer.removeEventListener("mousemove",dragMove);
	videoPlayer.removeEventListener("mouseup",dragEnd);
	if((lightboxX!=xstart+'px' || lightboxY!=ystart+'px')&& lightboxY!="0px" && lightboxX!=((100%-1140)/2)+16+'px'){window.setTimeout(function(){stopPlayPause=false},10);}else{stopPlayPause=false;}
}

function dragMobileStart(event){
	if(event.touches[0].clientY-videoPlayer.offsetTop>vidPlayer.currentHeight()-20 || (event.touches[0].clientY-videoPlayer.offsetTop<30 && event.touches[0].clientX-videoPlayer.offsetLeft<30)){return;}
	xstart=videoPlayer.offsetLeft;
	ystart=videoPlayer.offsetTop;
	x1 = event.touches[0].clientX;
	y1 = event.touches[0].clientY;
	videoPlayer.addEventListener("touchmove",dragMobileMove,false);
	videoPlayer.addEventListener("touchend",dragMobileEnd,false);
}
function dragMobileMove(){
	event.preventDefault();
	var dX = event.touches[0].clientX - x1;
	var dY = event.touches[0].clientY - y1;
	videoPlayer.style.left = xstart + dX + 'px';
	videoPlayer.style.top = ystart + dY + 'px';
	lightboxX = xstart + dX + 'px';
	lightboxY = ystart + dY + 'px';
}
function dragMobileEnd(){
	videoPlayer.removeEventListener("touchmove",dragMobileMove,false);
	videoPlayer.removeEventListener("touchend",dragMobileEnd,false);
}

//------------------------------------------------------------------------------------------------------------------------------

var wstart,hstart,lightboxW;
function resizeStart(){
	if(event.y-videoPlayer.offsetTop<10 || event.x-videoPlayer.offsetLeft<10 || event.y-videoPlayer.offsetTop>30 || event.x-videoPlayer.offsetLeft>30){return;}
	xstart=videoPlayer.offsetLeft;
	ystart=videoPlayer.offsetTop;
	wstart=videoPlayer.offsetWidth;
	hstart=videoPlayer.offsetHeight;
	x1 = event.x;
	y1 = event.y;
	window.addEventListener("mousemove",resizeMove,false);
	window.addEventListener("mouseup",resizeEnd,false);
}
function resizeMove(){
	var dX = event.x - x1;
	var dY = event.y - y1;
	videoPlayer.style.width = wstart - dX + 'px';
	if(wstart-dX<475){videoPlayer.style.width = "475px";}
	lightboxW = videoPlayer.style.width;
	videoPlayer.style.left = xstart + dX + 'px';
	videoPlayer.style.top = ystart - videoPlayer.offsetHeight + hstart + 'px';
	lightboxX = xstart + dX + 'px';
	lightboxY = ystart - videoPlayer.offsetHeight + hstart + 'px';
}
function resizeEnd(){
	window.removeEventListener("mousemove",resizeMove);
	window.removeEventListener("mouseup",resizeEnd);
}

function resizeMobileStart(event){
	if(event.touches[0].clientY-videoPlayer.offsetTop<10 || event.touches[0].clientX-videoPlayer.offsetLeft<10 || event.touches[0].clientY-videoPlayer.offsetTop>30 || event.touches[0].clientX-videoPlayer.offsetLeft>30){return;}
	xstart=videoPlayer.offsetLeft;
	ystart=videoPlayer.offsetTop;
	x1 = event.touches[0].clientX;
	y1 = event.touches[0].clientY;
	wstart=videoPlayer.offsetWidth;
	hstart=videoPlayer.offsetHeight;
	window.addEventListener("touchmove",resizeMobileMove,false);
	window.addEventListener("touchend",resizeMobileEnd,false);
}
function resizeMobileMove(){
	event.preventDefault();
	var dX = event.touches[0].clientX - x1;
	var dY = event.touches[0].clientY - y1;
	videoPlayer.style.width = wstart - dX + 'px';
	if(wstart-dX<250){videoPlayer.style.width = "250px";}
	lightboxW = videoPlayer.style.width;
	videoPlayer.style.left = xstart + dX + 'px';
	videoPlayer.style.top = ystart - videoPlayer.offsetHeight + hstart + 'px';
	lightboxX = xstart + dX + 'px';
	lightboxY = ystart - videoPlayer.offsetHeight + hstart + 'px';
}
function resizeMobileEnd(){
	window.removeEventListener("touchmove",resizeMobileMove,false);
	window.removeEventListener("touchend",resizeMobileEnd,false);
}

