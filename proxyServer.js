var express = require('express');
var cors = require('cors');
const axios = require('axios');

var app = express();
app.use(cors());
const API_KEY = "RGAPI-28818312-ddd1-49cc-abbd-1777e31c1d9e";

function getPlayerPUUID(playerName){
    return axios.get("https://na1.api.riotgames.com" +
                "/lol/summoner/v4/summoners/by-name/" + 
                playerName + "?api_key=" + API_KEY )
            .then(response => {
                return response.data.puuid
            }).catch(err => err);
}

app.get('/recentGame', async(req,res) => {
    const playerName = req.query.username;

    //get the most recent LoL match
    const API_CALL = "https://na1.api.riotgames.com/" + 
                "lol/summoner/v4/summoners/by-name/" +
                playerName + "?api_key=" + API_KEY 

    const playerInfo = await axios.get(API_CALL)
                .then(response => response.data)
                .catch(err => err)

    var mostRecentTimestamp;
   
    mostRecentTimestamp = playerInfo.revisionDate;

    res.json(mostRecentTimestamp);

});

app.get('/playerInfo', async(req,res) => {
    const p_Name = req.query.username;
    
    const API_CALL = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + 
                p_Name + "?api_key=" + API_KEY

    const playerData = await axios.get(API_CALL)
                .then(response => response.data)
                .catch(err => err)

    res.json(playerData);

});

app.listen(4000, function() {
    console.log("Server started on port 4000");
});//localhost:4000
