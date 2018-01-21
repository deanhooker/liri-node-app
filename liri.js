//set requirements
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const fs = require("fs");
const keys = require("./keys.js");

//set global variables
const twitterKeys = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});
const spotifyKeys = new Spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret
});

//grab user input for which function to run
let userCommand = process.argv[2];

//run function depending on user input
switch (userCommand) {

    case "my-tweets":
        myTweets();
        console.log("Hi");
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    default:
        console.log("ERROR: Valid commands are my-tweets, spotify-this-song, movie-this, do-what-it-says");
}

//Returns up to 20 of my latest tweets
function myTweets() {

    var params = { screen_name: 'deanhooker91', count: 20 };

    twitterKeys.get("statuses/user_timeline", params, function (error, tweets, response) {

        if (error) {
            console.log("Error retrieving tweets");
        }
        else {
            for (i = 0; i < tweets.length; i++) {
                console.log("Tweet: " + tweets[i].text + " Date: " + tweets[i].created_at);
            }
        }
    });
}

//Spotify
function spotifyThisSong() {
    spotifyKeys.search({ type: 'track', query: process.argv[3], limit: 2 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        else {
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview link: " + data.tracks.items[0].preview_url);
        }
    });
}