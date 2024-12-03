let currentSong = new Audio();
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for(let index=0; index<as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs; 
}

const playMusic = (track, pause=false) => {
    // var audio = new Audio("/songs/"+track);
    currentSong.src = "/songs/"+track
    if(!pause){
        currentSong.play();
        play.src = "images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main(){
    //Get the list of all songs
    
    let songs = await getSongs();
    playMusic(songs[0],true)
    // console.log(songs);

    //show all the songs in the playlist
    let songul = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" src="images/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Abdul</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="images/play.svg" alt="">
                            </div>
                         </li>`;
    }
    //Play the first song
    // var audio = new Audio(songs[0]);
    // audio.play();
    
    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(duration); 
    // })
    //Attach event listener to each song
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click", element=> {
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    })
})


    //Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play();
            play.src = "images/pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "images/play.svg";
        }
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () =>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%";
    })

    //Add an evenlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=> {
        console.log(e);
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent+"%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100;
    })

    //Add an evenlistener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //Add an eventlistener for closing hamburger
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

} 




main()