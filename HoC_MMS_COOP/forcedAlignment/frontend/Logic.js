/*javascript file by Alex Breeze*/

var audioOffset; //audio is ahead by x seconds in various recordings, this was my best solution

var noCaptions, englishCaptions, frenchCaptions, floorAudio, englishAudio, frenchAudio;

//DOM elements from HTML:
var videoPlayer, seekSlider, playPause, skipB, skipF, volBtn, volSlider, curTimeText, durTimeText, fullScreenBtn, settings, settingsPopup, captions, captionsPopup, 
speed75, speedNormal, speed15, speed20, qualityAuto, qualityHigh, qualityMedium, qualityLow, englishAud, frenchAud, floorAud, offSub, englishSub, frenchSub, videoNobar, 
vidSpeed, alex, minQual, maxQual, mobileAudio, mobileSubs, captionsPopup2, subtitlesTitle2, offSub2, englishSub2, frenchSub2, xButton, rButton;

//state variables for backend modeling
var cssLink, lightboxX, lightboxY, stopPlayPause, isFirefox, holdTime, wasFull, vidPlayer, audPlayer, curVidSrc, curAudSrc, video, interval1, interval2, interval3;
var seekSliderClicked, volumeSliderClicked, volume, timeoutHandle, speedTimeoutHandle, vidAud, vidSub, vidQual, vidPaused, vidRate, mobile;
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
	rButton=document.getElementById("rButton");

	isFirefox = typeof InstallTrigger !== 'undefined';
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
	holdTime=false;
	wasFull = false;
	lightboxX = videoPlayer.style.left;
	lightboxY = '0px';
	lightboxW = videoPlayer.style.width;
	stopPlayPause = false;

	if(mobile){videoPlayer.addEventListener("mousemove",function(){window.setTimeout(showBars,10);},false);}
	else{videoPlayer.addEventListener("mousemove",showBars,false);}
	if(!mobile){videoPlayer.addEventListener("mouseout",hideBars,false);}
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
	}
	else{document.getElementById("videoControlsBar").style.visibility = "visible";}
	document.getElementById("settingsPopup").style.visibility = "visible";
	document.getElementById("captionsPopup").style.visibility = "visible";
	videoPlayer.style.cursor = "default";
	xButton.style.visibility = "visible";
	rButton.style.visibility = "visible";
	
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
			settingsPopup.style.visibility = "hidden";
			captionsPopup.style.visibility = "hidden";
			captionsPopup2.style.visibility = "hidden";
		}
		else{document.getElementById("videoControlsBar").style.visibility = "hidden";}
		document.getElementById("settingsPopup").style.visibility = "hidden";
		document.getElementById("captionsPopup").style.visibility = "hidden";
		videoPlayer.style.cursor = "none";
		xButton.style.visibility = "hidden";
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
	if(!mobile){document.getElementById("timeNum").style.left = "245px";}
}
function hideVolSlider(){
	volSlider.style.display = "none";
	volPopupHandler.style.display = "none";
	if(!mobile){document.getElementById("timeNum").style.left = "140px";}
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
	if(captionsPopup2.style.display=="none"){
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
	}
}

function setQualityH(){
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
	}
}

function setQualityM(){
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
	}
}

function setQualityL(){
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
	if(vidSub!='O'){
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
	if(vidSub!='E'){
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
	if(vidSub!='F'){
		resetCaptions();
		frenchSub.style.color = "white";
		frenchSub2.style.color = "white";
		frenchSub.style.cursor = "default";
		vidSub='F';
		curVidSrc=frenchCaptions;
		changeVidSrc(curVidSrc);
	}
}

//==================================================================================================================================================================

//changes video source without touching audio, temporarily disables audio sync to let it play freely
var freezeSync=false;
function changeVidSrc(vidSrc){
	if(!holdTime){timeA=vidPlayer.currentTime();holdTime=true;} //prevents losing currentTime during consecutive source changes
	vidPlayer.dispose();
	createVidPlayer(vidSrc);
	function initVidPlayerB(){//recursive function to run when video is finished loading
		if(vidPlayer.readyState()==4){
			if(audPlayer.readyState()==4){
				vidPlayer.currentTime(audPlayer.currentTime()-audioOffset);
			} else {
				vidPlayer.currentTime(timeA);
			}
			holdTime=false;
			vidPlayer.playbackRate(vidRate);
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

//changes audio source without affecting video player
function changeAudSrc(audSrc){
	if(!holdTime){timeA=vidPlayer.currentTime();holdTime=true;}
	audPlayer.dispose();
	createAudPlayer(audSrc);
	function initAudPlayerB(){//recursive function to run when audio is finished loading
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

//closes video player, stops recurring functions
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
		stopDrag();
		fullScreenBtn.title="exit fullscreen";
		rButton.style.display="none";
	}
	else {
		fullScreenBtn.src = "Assets/fullscreenY.png";
		startDrag();
		fullScreenBtn.title="fullscreen";
		rButton.style.display="initial";
	}
}

//creates video player
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

//creates audio player
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

//called when clicking on link in site, resets audio/video to proper place
function startAll(evt){
	hold = evt.currentTarget.myParam.split(",");
	time = parseInt(hold[0]);
	stream = parseInt(hold[1]);

	//gets stream links from data
	noCaptions = data['streams'][stream]['links']['vidNo'];
	englishCaptions = data['streams'][stream]['links']['vidEng'];
	frenchCaptions = data['streams'][stream]['links']['vidFre'];
	floorAudio = data['streams'][stream]['links']['audFlo'];
	englishAudio = data['streams'][stream]['links']['audEng'];
	frenchAudio = data['streams'][stream]['links']['audFre'];

	videoPlayer.style.display="initial";

	//disposes of old player
	try{
		vidPlayer.dispose();
		audPlayer.dispose();
		console.log("disposed");
		console.log(vidPlayer);
		clearInterval(interval1);
		clearInterval(interval2);
		clearInterval(interval3);
	}
	catch(err){}

	audioOffset=parseInt(data['streams'][stream]['audioOffset']);
	
	//sets sources to new urls
	if(typeof curAudSrc=='undefined' || vidAud=="R"){curAudSrc=floorAudio;}
	else if (vidAud=="E"){curAudSrc=englishAudio;}
	else {curAudSrc=frenchAudio;}
	createAudPlayer(curAudSrc);
	if(typeof curVidSrc=='undefined' || vidSub=="O"){curVidSrc=noCaptions;}
	else if (vidSub=="E"){curVidSrc=englishCaptions;}
	else {curVidSrc=frenchCaptions;}
	createVidPlayer(curVidSrc);

	//recursive function, runs good stuff when video loaded
	function initAll(){
		if(vidPlayer.readyState()==4 && audPlayer.readyState()==4){
			audPlayer.play();
			if(!vidPaused && !audPlayer.paused()){vidPlayer.play();}else{audPlayer.pause();playBtn.src = "Assets/play.png";playBtn.title = "play";vidPaused=true;}
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

//==============================================================================================================================================================

//for dragging lightbox, also initialises resizing
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

//for dragging lightbox
function dragStart(){
	if(event.y-videoPlayer.offsetTop>vidPlayer.currentHeight()-50 || (event.y-videoPlayer.offsetTop<30 && event.x-videoPlayer.offsetLeft<30)){return;}
	stopPlayPause=true;
	xstart=videoPlayer.offsetLeft;
	ystart=videoPlayer.offsetTop;
	x1 = event.x;
	y1 = event.y;
	window.addEventListener("mousemove",dragMove,false);
	window.addEventListener("mouseup",dragEnd,false);
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
	window.removeEventListener("mousemove",dragMove);
	window.removeEventListener("mouseup",dragEnd);
	if((lightboxX!=xstart+'px' || lightboxY!=ystart+'px')&& lightboxY!="0px" && lightboxX!=((100%-1140)/2)+16+'px'){window.setTimeout(function(){stopPlayPause=false},10);}else{stopPlayPause=false;}
}

function dragMobileStart(event){
	if(event.touches[0].clientY-videoPlayer.offsetTop>vidPlayer.currentHeight()-20 || (event.touches[0].clientY-videoPlayer.offsetTop<30 && event.touches[0].clientX-videoPlayer.offsetLeft<30)){return;}
	xstart=videoPlayer.offsetLeft;
	ystart=videoPlayer.offsetTop;
	x1 = event.touches[0].clientX;
	y1 = event.touches[0].clientY;
	window.addEventListener("touchmove",dragMobileMove,{ passive: false });
	window.addEventListener("touchend",dragMobileEnd,false);
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
	window.removeEventListener("touchmove",dragMobileMove,false);
	window.removeEventListener("touchend",dragMobileEnd,false);
}

//for resizing lightbox
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
	videoPlayer.style.left = xstart + (wstart-Math.max(475,wstart-dX)) + 'px';
	videoPlayer.style.top = ystart - videoPlayer.offsetHeight + hstart + 'px';
	lightboxX = xstart + (wstart-Math.max(475,wstart-dX)) + 'px';
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
	window.addEventListener("touchmove",resizeMobileMove,{ passive: false });
	window.addEventListener("touchend",resizeMobileEnd,false);
}
function resizeMobileMove(){
	event.preventDefault();
	var dX = event.touches[0].clientX - x1;
	var dY = event.touches[0].clientY - y1;
	videoPlayer.style.width = wstart - dX + 'px';
	if(wstart-dX<250){videoPlayer.style.width = "250px";}
	lightboxW = videoPlayer.style.width;
	videoPlayer.style.left = xstart + (wstart-Math.max(250,wstart-dX)) + 'px';
	videoPlayer.style.top = ystart - videoPlayer.offsetHeight + hstart + 'px';
	lightboxX = xstart + (wstart-Math.max(250,wstart-dX)) + 'px';
	lightboxY = ystart - videoPlayer.offsetHeight + hstart + 'px';
}
function resizeMobileEnd(){
	window.removeEventListener("touchmove",resizeMobileMove,false);
	window.removeEventListener("touchend",resizeMobileEnd,false);
}

//=================================================================================================

var options = document.getElementById("searchOptions");
var results = document.getElementById("results");
var dictionary = Object.keys(data['dictionary']);

//generates list of search options from user input, dictionary
function searchWords(e){
	while(options.firstChild){
		options.removeChild(options.firstChild)
	}
	while(results.firstChild){
		results.removeChild(results.firstChild);
	}
	search=document.getElementById("userInput").value.toLowerCase().replace(/[\[\]?.,\/#!$%\^&\*;:{}="'\\|_~()]/g, "").split(" ");
	lastWord=search[search.length-1];

	if(lastWord=="" || lastWord==" "){document.getElementById("suggestedSearches").style.visibility="hidden";return;}
	document.getElementById("suggestedSearches").style.visibility = "visible";
	
	count=0;
	for (var x=0;x<dictionary.length;x++){
		if (dictionary[x].includes(lastWord)){
			var text = document.createElement("LI");
			text.innerHTML = dictionary[x]+"\n";
			text.classList.add("resultText");
			text.addEventListener('click', addWord, false);
			options.appendChild(text);
			count++;
		}
		if(count>250){break;}
	}
	if (options.childElementCount==0){document.getElementById("suggestedSearches").style.visibility = "hidden";}
}

function addWord(){
	while(options.firstChild){
		options.removeChild(options.firstChild);
	}
	document.getElementById("suggestedSearches").style.visibility = "hidden";
	var text=this.innerHTML.replace( /[\r\n]+/gm, "" );
	var text2=document.getElementById("userInput");

	var lastSpace = text2.value.lastIndexOf(' ');

	if(lastSpace===-1){
		if(text2.value.slice(0,1)=="'" || text2.value.slice(0,1)=='"'){
			text2.value='"'+text;
		} else {
			text2.value=text+" ";
		}
	} else {
		if(text2.value.slice(lastSpace+1,lastSpace+2)=="'" || text2.value.slice(lastSpace+1,lastSpace+2)=='"'){
			text2.value=text2.value.substring(0,lastSpace)+' "'+text;
		} else {
			text2.value=text2.value.substring(0,lastSpace)+" "+text+" ";
		}
	}

	text2.focus();
	text2.setActive;
}

//searches for occurences of word in input box, when the user hits enter
function searchWordEnter(e){
	while(options.firstChild){
		options.removeChild(options.firstChild);
	}
	document.getElementById("suggestedSearches").style.visibility = "hidden";
	if (e.keyCode === 13) {
		search=document.getElementById("userInput").value.toLowerCase().replace( /[\r\n]+/gm, "" );
		searchWordSpecific(search);
	}
}

function searchWordClick(event){
	while(options.firstChild){
		options.removeChild(options.firstChild);
	}
	document.getElementById("suggestedSearches").style.visibility = "hidden";
	search=document.getElementById("userInput").value.toLowerCase().replace( /[\r\n]+/gm, "" );
	searchWordSpecific(search);
	document.getElementById("userInput").value=search;
}

var userSearch=[]; //global thing to hold user search

//searches for occurences of word, from either of above input styles.
function searchWordSpecific(search){
	while(results.firstChild){
		results.removeChild(results.firstChild);
	}

	search=search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	
	userSearch=[]
	var temp = search.match(/"(?:\\"|\\\\|[^"])*"|\S+/g);
	for (var x=0;x<temp.length;x++){
		if(temp[x].substring(0,1)=='"'){
			var t=temp[x].split(' ')[0];
			if (t[t.length-1]=='"'){t=t.substring(0,t.length-1);}
			userSearch.push({'short':t.substring(1),'quote':true,'long':temp[x].substring(1,temp[x].length-1)});
		} else {
			userSearch.push({'short':temp[x],'quote':false,'long':temp[x]});
		}
	}
	
	for(var stream=0;stream<data['streams'].length;stream++){
		for(var term=0;term<userSearch.length;term++){
			if(userSearch[term]['short'] in data['streams'][stream]['data']){
				if(userSearch[term]['quote']){
					for(instance=0;instance<data['streams'][stream]['data'][userSearch[term]['short']].length;instance++){
						var pos=data['streams'][stream]['data'][userSearch[term]['short']][instance]['startText'];
						if(data['streams'][stream]['transcript'].substring(pos,pos+userSearch[term]['long'].length).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")==userSearch[term]['long']){
							addStreamResult(stream);
							term=999;
							break;
						}
					}
				} else {
					addStreamResult(stream);
					term=999;
					break;
				}
			}
		}
	}
}

//adds stream to list of results (green button)
function addStreamResult(stream){
	var div = document.createElement("DIV");
	var button = document.createElement("BUTTON");
	button.innerHTML = data['streams'][stream]['name'];
	button.classList.add("streamOption");
	button.value = stream;
	button.onclick = showWordResults;
	div.appendChild(button);
	results.appendChild(div);
}

//adds list of occurences of given word in given stream
function showWordResults(button){
	stream=this.value;
	if (this.parentNode.childElementCount>1){
		while(this.parentNode.childElementCount>1){
			this.parentNode.removeChild(this.parentNode.lastChild);
		}
	} else {
		var namesMissed=0; //if first reports fail to find names, disables feature to stop lag
		for(var term=0;term<userSearch.length;term++){
			if(userSearch[term]['short'] in data['streams'][stream]['data']){
				for (var instance=0;instance<data['streams'][stream]['data'][userSearch[term]['short']].length;instance++){
					var pos=data['streams'][stream]['data'][userSearch[term]['short']][instance]['startText'];
					if(!userSearch[term]['quote'] || data['streams'][stream]['transcript'].substring(pos,pos+userSearch[term]['long'].length).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")==userSearch[term]['long']){
						var box = document.createElement("DIV");
						box.classList.add("resultBox");
						var text = document.createElement("text");
						var s = data['streams'][stream]['data'][userSearch[term]['short']][instance]['startText'];
						text.addEventListener('click', startAll, false);
						var st = parseInt(data['streams'][stream]['data'][userSearch[term]['short']][instance]['startTime']).toString();

						text.myParam = st+","+stream;
							
						var start=s;
						var end=s;
						if(namesMissed<10){
							for(var p=s;p>9;p--){
								if(data['streams'][stream]['transcript'].substring(p-8,p)=="[Expand]" || data['streams'][stream]['transcript'].substring(p-8,p)=="[Ouvert]" || data['streams'][stream]['transcript'].substring(p-8,p)=="[Ouvrir]"){
									start=p;
									break;
								}
							}
							if(start!=s){
								for(var p=start;p<data['streams'][stream]['transcript'].length;p++){
									if(data['streams'][stream]['transcript'].substring(p-1,p)==":"){
										end=p;	
										namesMissed=-999;
										break;
									}
								}
							}
						}

						if(end!=s && start!=s){
							text.innerHTML="<b>"+data['streams'][stream]['transcript'].substring(start,end)+"</b><br>..."+data['streams'][stream]['transcript'].substring(s-165,s)+"<b>"+data['streams'][stream]['transcript'].substring(s,s+userSearch[term]['long'].length)+"</b>"+data['streams'][stream]['transcript'].substring(s+userSearch[term]['long'].length,s+userSearch[term]['long'].length+140)+"...";
						} else {
							namesMissed+=1;
							text.innerHTML="..."+data['streams'][stream]['transcript'].substring(s-165,s)+"<b>"+data['streams'][stream]['transcript'].substring(s,s+userSearch[term]['long'].length)+"</b>"+data['streams'][stream]['transcript'].substring(s+userSearch[term]['long'].length,s+userSearch[term]['long'].length+140)+"...";
						}
	
						box.appendChild(text);
						this.parentNode.appendChild(box);
					}
				}
			}
		}
	}
}