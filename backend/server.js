const express = require('express');
const res = require('express/lib/response');
const fs = require('fs');
const path = require('path');
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

const MUSIC_DIR = "/run/user/1000/gvfs/smb-share:server=192.168.0.7,share=pistoriushuis,user=spongeit/music";

app.get("/stream/:filename", (req, res) => {
    const filePath = path.join(MUSIC_DIR, req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const fileStream = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "audio/mpeg",
        });

        fileStream.pipe(res);
    } else {
        res.writeHead(200, { "Content-Length": fileSize, "Content-Type": "audio/mpeg" });
        fs.createReadStream(filePath).pipe(res);
    }

})

app.get("/songs", (req, res) => {
    fs.readdir(MUSIC_DIR, (err, files) => {
        if (err) return res.status(500).send("Error reading directory");
        
        const songs = files.filter(file => file.endsWith(".mp3"));
        res.json(songs);
    });
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
