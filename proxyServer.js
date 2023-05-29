var express = require('express');
var cors = require('cors');
const axios = require('axios');

var app = express();
app.use(cors());
const API_KEY = "RGAPI-c7bfade3-8bbb-44d4-9d4e-037a828d8cf0";

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
    const PUUID = await getPlayerPUUID(playerName);

    //get the most recent LoL match
    const API_CALL_LOL = "https://americas.api.riotgames.com/" + 
                "lol/match/v5/matches/by-puuid/" +
                PUUID + "/ids" + "?api_key=" + API_KEY 

    const LOL_gameIDs = await axios.get(API_CALL_LOL)
                .then(response => response.data)
                .catch(err => err)

    const LOL_matchID = LOL_gameIDs[0];
    const LOL_matchData = await axios.get("https://americas.api.riotgames.com/" +
                "lol/match/v5/matches/" +
                LOL_matchID + "?api_key=" + API_KEY)
                .then(response => response.data)
                .catch(err => err)

    //get the most recent TFT match
    const API_CALL_TFT = "https://americas.api.riotgames.com/" + 
                "tft/match/v1/matches/by-puuid/" +
                PUUID + "/ids" + "?api_key=" + API_KEY 

    const TFT_gameIDs = await axios.get(API_CALL_TFT)
                .then(response => response.data)
                .catch(err => err)

    const TFT_matchID = TFT_gameIDs[0];
    const TFT_matchData = await axios.get("https://americas.api.riotgames.com/" +
                "tft/match/v1/matches/" +
                TFT_matchID + "?api_key=" + API_KEY)
                .then(response => response.data)
                .catch(err => err)  
  
    //always equal for some reason *fix*
    if(TFT_matchData.game_datetime > LOL_matchData.gameEndTimestamp){
        res.json(TFT_matchData);
    }else{
        res.json(LOL_matchData);
    }

    
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
