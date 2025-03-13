const ul = document.getElementById("music")

async function fetchSongs() {
    try {
        const res = await fetch("http://localhost:3000/songs");
        songs = await res.json();
        displaySongs();
    }
    
    catch (error) {
        console.log("Error fetching songs", error);
    }
}

function displaySongs() {
    ul.innerHTML = "";
    songs.forEach(song => {
        const li = document.createElement("li");

        li.textContent = song;
        // li.onclick = () => {}
        li.classList = "list-group-item"
        ul.appendChild(li);
    });
}

fetchSongs();