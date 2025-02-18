const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const axios = require("axios")
const { ummy } = require("./src/scraper")

global.func = require('./src/function')

const app = express()
app.set('view engine', 'ejs')

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use("/file", express.static(path.join(__dirname, 'views')))


app.get("/", async (req, res) => {
    res.render('index')
})

app.post("/api", async (req, res) => {
    try{
        let resp = await ummy(req.body.url);
        if(resp.data.success) {
            res.json({ 
                status: "oke",
                videoDetail: resp.data.result.videoDetails,
                format_video: resp.data.result.formats,
                realeted_video: resp.data.result.related_videos
            })
        } else {
            res.json({ 
                status: "error",
                message: "Id Video Not Found, Please enter the YouTube video URL correctly"
            })
            console.log(res.data.message)
        }
    } catch(e) {
         res.json({
            status: "error",
            message: "An error occurred on the server, please wait a moment, we will fix it immediately"
        })
        console.log("terjadi kesalahan: " + e.message)
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server Started on Port ' + (process.env.PORT || 3000));
});
