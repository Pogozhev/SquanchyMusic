var express = require("express")
const r  = require("async-request")
const request  = require("request")
var port = process.env.port || 3000
var app = express()

app.get("/get_info", (req, res) => {
    if(req.query.link.indexOf("apple.com") > 0){
        getAppleMusic(req.query.link, (data) => {
            res.json(data)
        })
    }else{
        res.json({type: "bad_link"})
    }
})

let getAppleMusic = (link, func) => {
    var id = link.split("playlist")[1].split("/")[2].split("?")[0]
    console.log(id)
    var headers = {
        'Sec-Fetch-Mode': 'cors',
        'Referer': link,
        'Origin': 'https://music.apple.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
        'authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IldlYlBsYXlLaWQifQ.eyJpc3MiOiJBTVBXZWJQbGF5IiwiaWF0IjoxNTcwNTY0ODgxLCJleHAiOjE1ODYxMTY4ODF9.HZxouoWyDEil-S1UOVR_5T_3vmIwi2WD86wDUkarWVjpglykhMdRGmpJSxGWHRg_6gSawEO4Si5Xkcol8GRNnQ'
    };

    var options = {
        url: 'https://amp-api.music.apple.com/v1/catalog/RU/playlists?ids='+id,
        headers: headers
    };

    let callback = (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body).data[0].relationships.tracks.data.map((item) => 
                {
                    return {
                        "track_name": item.attributes.name,
                        "artist": item.attributes.artistName,
                        "genres": item.attributes.genreNames 
                    };
                }
            )
            func(data)
        }
    }
    request(options, callback);
}

app.listen(port, async () => {
    console.log("Server listening on port", port)
    // getAppleMusic("https://music.apple.com/ru/playlist/%D0%B4%D1%80%D0%B0%D0%BC-%D0%BD-%D0%B1%D1%8D%D0%B9%D1%81/pl.7a75d4e444fb4b3583ec9d48a2b0eef6", (data) => {
    //     console.log(data)
    // })
})