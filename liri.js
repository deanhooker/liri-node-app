const twitter = require("twitter");
const spotify = require("node-spotify-api");
const request = require("request");

// Make a JavaScript file named liri.js.
// At the top of the liri.js file, write the code you need to grab the data from keys.js. Then store the keys in a variable.
// Make it so liri.js can take in one of the following commands:

// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says

let userCommand = process.argv[2];

switch (userCommand) {

    case "my-tweets":
        myTweets();
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
}