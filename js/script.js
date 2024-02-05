let timeUpdate = document.querySelector(".updatedTime")
let totalDuration = document.querySelector(".totalDuration")
let ul = document.getElementById("songListUl")
let infoHead = document.getElementsByClassName("songInfo")[0].firstElementChild
let infoArtist = document.getElementsByClassName("songInfo")[0].lastElementChild
let playBtn = document.getElementById("play")
let previousBtn = document.getElementById("previous")
let nextBtn = document.getElementById("next")
let circle = document.querySelector(".circle")
let seekBar = document.querySelector(".seekBar")
let hamburger = document.querySelector(".hamburger")
let close = document.querySelector(".close")
let card = document.getElementsByClassName("card")

let currentSong = new Audio()
let leftImg = []
let li
let currentLi
currentSong.volume = 0.4


async function getSongs(folder) {

    // Get data from our own repositary
    let data = await fetch(`/songs/${folder}/`)
    let response = await data.text()

    // Getting Songs From whole document
    let div = document.createElement("div")
    div.innerHTML = response
    let a = Array.from(div.getElementsByTagName("a"))

    let songsLink = []
    let sName = []
    a.forEach(element => {
        if (element.href.endsWith(".mp3")) {
            songsLink.push(element.href)
            let name1 = element.href.split("/")[5].replaceAll("%20", " ").replaceAll("%26", "&").replaceAll("_", "&").trim()
            sName.push(name1)
        }
    });

    //Removing .mp3 from song names and store in array
    let songsName = []
    sName.forEach(element => {
        let dot = element.indexOf(".")
        let final = element.slice(0, dot)
        songsName.push(final)

    });

    // Setting a default Song
    currentSong.src = songsLink[0]

    // Creating li Element For every Song under ul
    for (let index = 0; index < songsName.length; index++) {
        let link = songsLink[index];
        let name = songsName[index]
        ul.innerHTML += `<li class="flex items-center" data-songlink = "${link}">
            <img src="svg/songListPlay.png" alt="playSong">
            <p>${name}</p></li>`
    }

    li = Array.from(ul.getElementsByTagName("li"))
    currentLi = li[0]

    // Attaching Event Listener to all Li's
    for (const iterator of li) {
        leftImg.push(iterator.firstElementChild)

        iterator.addEventListener("click", () => {
            currentLi = iterator
            for (const i of leftImg) {
                i.src = "svg/songListPlay.png"
            }
            console.log("playing:- " + iterator.innerText)

            let split = iterator.innerText.indexOf("-")
            infoHead.innerHTML = iterator.innerText.slice(0, split).trim()
            infoArtist.innerHTML = iterator.innerText.slice(split + 1).trim()
            playMusic(iterator.dataset.songlink)
            iterator.firstElementChild.src = "svg/pause.png"
            for (const iterator of li) {
                iterator.style.backgroundColor = "#3632329c"
            }
            iterator.style.backgroundColor = "#000000"
            playBtn.src = "svg/playBar-pause.png"
        })
    }

    let library = document.querySelector(".yourLibrary").lastElementChild
    library.innerText = folder.replaceAll("-", " ")
    return [songsLink, songsName];
}

let convertTime = (time) => {
    let mins = Math.floor(time / 60);
    if (mins < 10) {
        mins = '0' + String(mins);
    }

    let secs = Math.floor(time % 60);
    if (secs < 10) {
        secs = '0' + String(secs);
    }

    return mins + ':' + secs;
}

let playMusic = async (track) => {
    currentSong.src = track
    await currentSong.play();
    let time = convertTime(currentSong.duration)
    totalDuration.innerText = time
}

let showCard = async () => {
    // Get data from our own repositary
    let data = await fetch(`/songs/`)
    let response = await data.text()

    // Getting Songs From whole document
    let div = document.createElement("div")
    div.innerHTML = response
    let a = div.getElementsByTagName("a")
    let cardCont = document.querySelector(".cardContainer")
    let array = Array.from(a)

    for (let index = 0; index < array.length; index++) {
        let element = array[index];
        if (element.href.includes("/songs/") && !element.href.includes(".htaccess")) {
            let folder = element.href.split("/")[4]
            cardCont.innerHTML += `<div data-folder= "${folder}" class="card">
            <div class="play">
                <img src="svg/play1.png" alt="play">
            </div>
            <img src="/songs/${folder}/cover.jpg"
                alt="playlist-Image">
            <h3>${folder.replaceAll("-", " ")}</h3>
            <p>The perfect soundtrack to those long nights..</p>
        </div>`
        }
    }

}

let changePHead = () => {

    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    let amPm = currentHour >= 12 ? 'PM' : 'AM';
    currentHour = currentHour % 12 || 12; // Handle midnight (0) as 12
    let time = {
        "hour": currentHour,
        "ampm": amPm
    }
    let playlistHead = document.querySelector(".playlists").firstElementChild
    if (time.hour == 12 && time.ampm == 'AM') {
        playlistHead.innerText = "Sleep! its Mid-night"
    }

    else if (time.hour >= 5 && time.hour <= 9 && time.ampm == 'AM') {
        playlistHead.innerText = "Good Morning!"
    }

    else if (time.hour >= 12 && time.hour <= 3 && time.ampm == 'PM') {
        playlistHead.innerText = "Good Afternoon!"
    }

    else if (time.hour >= 6 && time.hour <= 9 && time.ampm == 'PM') {
        playlistHead.innerText = "Good Evening!"
    }

    else if (time.hour >= 11 && time.hour <= 3 && time.ampm == 'AM') {
        playlistHead.innerText = "Zzzzz"
    }

    else {
        playlistHead.innerText = "Spotify Playlists"
    }

    return true
}

async function displaySongs() {

    // Changing the playlist heading acc. to Current Time
    changePHead()

    // Create Card According to New Folder Dynamically
    await showCard()

    // Setting a default Playlist
    await getSongs("TTH")

    // Attach Event Listener to play, previous, next Btn
    previousBtn.addEventListener("click", () => {
        let a
        li.forEach((element, index) => {
            if (currentSong.src == element.dataset.songlink) {
                a = index
            }
        });

        let previousLi;
        if (a == 0) {
            previousLi = li[0]
            currentLi = previousLi
            console.log("No Previous Song")
            playMusic(li[0].dataset.songlink)
            playBtn.src = "svg/playBar-pause.png"
        }
        else {
            previousLi = li[a - 1]
            currentLi = previousLi
            console.log("Playing Previous Song")
            playMusic(previousLi.dataset.songlink)
            playBtn.src = "svg/playBar-pause.png"
        }

        let split = previousLi.innerText.indexOf("-")
        infoHead.innerHTML = previousLi.innerText.slice(0, split).trim()
        infoArtist.innerHTML = previousLi.innerText.slice(split + 1).trim()

        for (const iterator of li) {
            iterator.style.backgroundColor = "#3632329c"
            iterator.firstElementChild.src = "svg/songListPlay.png"

        }
        previousLi.style.backgroundColor = "#000000"
        previousLi.firstElementChild.src = "svg/pause.png"

    })

    nextBtn.addEventListener("click", () => {
        let a
        li.forEach((element, index) => {
            if (currentSong.src == element.dataset.songlink) {
                a = index
            }
        });
        let nextLi;
        if (a == li.length - 1) {
            nextLi = li[a]
            currentLi = nextLi
            console.log("No Next Song")
            playMusic(li[a].dataset.songlink)
            playBtn.src = "svg/playBar-pause.png"
        }
        else {
            nextLi = li[a + 1]
            currentLi = nextLi
            console.log("Playing Next Song")
            playMusic(nextLi.dataset.songlink)
            playBtn.src = "svg/playBar-pause.png"
        }

        let split = nextLi.innerText.indexOf("-")
        infoHead.innerHTML = nextLi.innerText.slice(0, split).trim()
        infoArtist.innerHTML = nextLi.innerText.slice(split + 1).trim()

        for (const iterator of li) {
            iterator.style.backgroundColor = "#3632329c"
            iterator.firstElementChild.src = "svg/songListPlay.png"

        }
        nextLi.style.backgroundColor = "#000000"
        nextLi.firstElementChild.src = "svg/pause.png"

    })

    playBtn.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playBtn.src = "svg/playBar-pause.png"
            currentLi.firstElementChild.src = "svg/pause.png"
            currentLi.style.backgroundColor = "rgb(0, 0, 0)"

            let split = currentLi.innerText.indexOf("-")
            infoHead.innerHTML = currentLi.innerText.slice(0, split).trim()
            infoArtist.innerHTML = currentLi.innerText.slice(split + 1).trim()
        }
        else {
            currentSong.pause()
            playBtn.src = "svg/playBar-play.png"
            currentLi.firstElementChild.src = "svg/songListPlay.png"
            currentLi.style.backgroundColor = "#3632329c"
        }
    })

    // Showing Duration and Updated Current Time of Song
    currentSong.addEventListener("timeupdate", () => {
        let updated = Math.floor(currentSong.currentTime)
        let time = convertTime(updated)
        timeUpdate.innerText = time
        circle.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // Attach an Event Listener to Seek Bar
    seekBar.addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        circle.style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Attach an Event Listener to hamburger to show left
    hamburger.addEventListener("click", () => {
        let left = document.querySelector(".left")
        left.style.left = "0"

    })

    // Attach an Event Listener to close Btn to hide left
    close.addEventListener("click", () => {
        let left = document.querySelector(".left")
        left.style.left = "-120%"
    })

    let volume = document.getElementById("volume")
    let showVolume = volume.nextElementSibling
    let volumeImg = volume.previousElementSibling

    // Attach an Event Listener to volume 
    volume.addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        showVolume.innerText = e.target.value
        volumeImg.src = "svg/volume.png"
        if (e.target.value == 0) {
            volumeImg.src = "svg/mute.png"
        }
    })

    // Adding Functionality for Mute to Volume Image
    volumeImg.addEventListener("click", () => {
        if (currentSong.volume > 0) {
            currentSong.volume = 0
            volumeImg.src = "svg/mute.png"
            showVolume.innerText = 0
            volume.value = 0
        }
        else {
            currentSong.volume = 0.4
            volumeImg.src = "svg/volume.png"
            showVolume.innerText = 40
            volume.value = 40
        }
    })

    // Load the playlist whenever the card is clicked
    for (const iterator of card) {
        iterator.addEventListener("click", async () => {
            ul.innerHTML = ""
            playBtn.src = "svg/playBar-play.png"
            let playlist = iterator.dataset.folder
            await getSongs(`${playlist}`)
            playMusic(currentSong.src)
            playBtn.src = "svg/playBar-pause.png"

            let split = currentLi.innerText.indexOf("-")
            infoHead.innerHTML = currentLi.innerText.slice(0, split).trim()
            infoArtist.innerHTML = currentLi.innerText.slice(split + 1).trim()

            currentLi.style.backgroundColor = "#000000"
            currentLi.firstElementChild.src = "svg/pause.png"

        })
    }

    return true
}

displaySongs()

