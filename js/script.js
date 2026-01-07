const wrapper=document.querySelector(".wrapper"),
musicImg=wrapper.querySelector(".img-area img"),
musicName=wrapper.querySelector(".song-details .title"),
musicArtist=wrapper.querySelector(".song-details .artist"),
mainAudio=wrapper.querySelector("#main-audio"),
PlayPauseBtn=wrapper.querySelector(".play-pause"),
PrevBtn=wrapper.querySelector("#prev"),
NextBtn=wrapper.querySelector("#next"),
progressbar=wrapper.querySelector(".progress-bar"),
progressArea=wrapper.querySelector(".progress-area"),
musicList=wrapper.querySelector(".music-list"),
showMoreBtn=wrapper.querySelector("#more-music"),
hideMusicBtn=musicList.querySelector("#close");

const DEFAULT_VOlUME=0.5;

function setDefaultVolume(){
    audio.volume=DEFAULT_VOlUME;
    volumeSlider.value=DEFAULT_VOlUME;
}

let musicIndex=Math.floor((Math.random()*allMusic.length)+1);

window.addEventListener("load",()=>{
    loadMusic(musicIndex); //Calling loadMusic function once the window is loaded
    playingNow();
    setDefaultVolume();
});

// Load music Function
function loadMusic(indexNumb){
    musicName.innerHTML=allMusic[indexNumb-1].title;
    musicArtist.innerHTML=allMusic[indexNumb-1].artist;
    musicImg.src=`images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src=`songs/${allMusic[indexNumb - 1].src}.mp3`;
    updateHeart();
}

// Play Music Function
function playMusic(){
    wrapper.classList.add("paused")
    PlayPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
    setDefaultVolume();
}

// Pause Music Function
function pauseMusic(){
    wrapper.classList.remove("paused")
    PlayPauseBtn.querySelector("i").innerText="play_arrow";
    mainAudio.pause();
}


// Function to play and pause the songs
PlayPauseBtn.addEventListener("click",()=>{
    const isMusicPaused=wrapper.classList.contains("paused");

    // if isMusicPaused is true then call pauseMusic() else playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();

});

// Next Music Function
function nextMusic(){
    // Incrementing index by 1
    musicIndex++;

    // if musicIndex becomes greater than array length then musicIndex will be 1(first song)
    musicIndex > allMusic.length ? musicIndex=1 : musicIndex=musicIndex; 
    loadMusic(musicIndex);
    playMusic();
    playingNow();

}

// Prev Music Function
function prevMusic(){
    // Incrementing index by 1
    musicIndex--;
     // if musicIndex becomes less than 1 then musicIndex will be array length
    musicIndex < 1 ? musicIndex=allMusic.length : musicIndex=musicIndex; 
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// When next btn is clicked
NextBtn.addEventListener("click",()=>{
    nextMusic(); // Calling next music function
});

// When prev btn is clicked
PrevBtn.addEventListener("click",()=>{
    prevMusic(); // Calling prev music function
});

// Update progress bar width according to music current time
mainAudio.addEventListener("timeupdate",(e)=>{
    const currentTime=e.target.currentTime; // Current time is fetched of song
    const duration=e.target.duration; // Current duration is fetched of song
    let progessWidth= (currentTime/duration)*100;
    progressbar.style.width=`${progessWidth}%`;

    let musicCurrentTime=wrapper.querySelector(".current"),
    musicDuration=wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata",()=>{

        // Updating song total duration
        let audioDuration=mainAudio.duration;
        let totalMin=Math.floor(audioDuration/60);
        let totalSec=Math.floor(audioDuration%60);
        if (totalSec<10){
            totalSec=`0${totalSec}`;
        }
        musicDuration.innerText=`${totalMin}:${totalSec}`;
    });
    // Updating playing song current time
        let currentMin=Math.floor(currentTime/60);
        let CurrentSec=Math.floor(currentTime%60);
        if (CurrentSec<10){
            CurrentSec=`0${CurrentSec}`;
        }
        musicCurrentTime.innerText=`${currentMin}:${CurrentSec}`;
});

// Updating playing song current time according to the progress bar width
progressArea.addEventListener("click",(e)=>{
    let progessWidthval=progressArea.clientWidth; // Getting width of progress bar
    let clickedOffSetX=e.offsetX; //getting offset x value
    let songDuration=mainAudio.duration; // getting total song duration

    mainAudio.currentTime=(clickedOffSetX / progessWidthval) * songDuration;
    playMusic();
});

// Logic for repeat,shuffle song according to icon
const repeatBtn=wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click",()=>{
    let getText=repeatBtn.innerText; // getting innerText of icon
    
    switch(getText){
        case "repeat":
            repeatBtn.innerText="repeat_one";
            repeatBtn.setAttribute("title","Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText="shuffle";
            repeatBtn.setAttribute("title","Playback Shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText="repeat";
            repeatBtn.setAttribute("title","Playlist looped");
            break;
    }
});

// After song is ended
mainAudio.addEventListener("ended",()=>{
    let getText=repeatBtn.innerText; // getting innerText of icon
    
    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime=0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex=Math.floor((Math.random()*allMusic.length)+1);
            do{
                let randIndex=Math.floor((Math.random()*allMusic.length)+1);
            }while(musicIndex == randIndex); //running continusoly
            musicIndex=randIndex; //Assing randindex to musicindex to play random song
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
});

// When Queue music icon is clicked
showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

// When close icon is clicked
hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click();
});

const ulTag=wrapper.querySelector("ul");
// Creating li according to array length
for (let i = 0; i < allMusic.length; i++) {
    // Passing song details
    let liTag=`<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].title}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend",liTag);
    
    let liAudioDuration=ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag=ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration=liAudioTag.duration;
        let totalMin=Math.floor(audioDuration/60);
        let totalSec=Math.floor(audioDuration%60);
        if (totalSec<10){
            totalSec=`0${totalSec}`;
        }
        liAudioDuration.innerText=`${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);
    });
}

// Playing particular songs on clicking from music list
const allLiTags=ulTag.querySelectorAll("li");

function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {

        let audioTag=allLiTags[j].querySelector(".audio-duration");

        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration=audioTag.getAttribute("t-duration");
            audioTag.innerText=adDuration;
        }

        // if li-index is equal to musicIndex then that music will start playing
        if(allLiTags[j].getAttribute("li-index")==musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText="Playing";
        }

        allLiTags[j].setAttribute("onclick","clicked(this)"); // adding onclick attribute in all li tags
    }
}


// let's play song on li click
function clicked(element){
    let getLiIndex=element.getAttribute("li-index");
    musicIndex=getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// Volume Control
const audio = document.querySelector("#main-audio");
const volumeSlider = document.querySelector(".volume-slider");
volumeSlider.addEventListener("input",()=>{
    audio.volume=volumeSlider.value;
});

const favToggle=document.getElementById("fav");
const favorites=[];

favToggle.addEventListener("click",()=>{
    favorites[musicIndex]=!favorites[musicIndex];
    console.log( favorites[musicIndex]);
    updateHeart();
});

function updateHeart(){
    if(favorites[musicIndex]){
        favToggle.textContent="favorite";
        favToggle.style.color="red";
    }
    else{
        favToggle.textContent="favorite_border";
        favToggle.style.color="#ffffff";
    }
}

