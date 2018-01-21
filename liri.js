//set requirements
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const fs = require("fs");
const keys = require("./keys.js");

//set API key variables
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
let userQuery = process.argv[3];

//LIRI function depending on user input
//=================================================================================================================
function LIRI(command) {
    switch (command) {

        case "my-tweets":
            myTweets();
            break;

        case "spotify-this-song":
            spotifyThisSong(userQuery);
            break;

        case "movie-this":
            movieThis(userQuery);
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;

        default:
            console.log("ERROR: Valid commands are my-tweets, spotify-this-song, movie-this, do-what-it-says");
    }
}
//Run function
LIRI(userCommand);

//=================================================================================================================

//Twitter: Returns up to 20 of my latest tweets
//=================================================================================================================
function myTweets() {

    //set retrieval parameters: username & number of tweets returned
    var params = { screen_name: 'deanhooker91', count: 20 };

    //run function to return tweets
    twitterKeys.get("statuses/user_timeline", params, function (error, tweets, response) {

        if (error) {
            console.log("Error retrieving tweets");
        }
        else {

            for (i = 0; i < tweets.length; i++) {

                //log data in log.txt
                logData(
                    tweets.length - i + ": " + tweets[i].text + "\n" +
                    "Date: " + tweets[i].created_at + "\n"
                );

                //print data in console
                console.log("");
                console.log(tweets.length - i + ": " + tweets[i].text);
                console.log("Date: " + tweets[i].created_at);
                console.log("");
            }
        }
    });
}
//=================================================================================================================

//Spotify: Returns top track from user search
//=================================================================================================================
function spotifyThisSong(song) {

    //if no query from user then default to The Sign by Ace of Base :D
    if (!userQuery) {
        song = "The Sign Ace";
    };

    //search spotify returning top 3 tracks
    spotifyKeys.search({ type: 'track', query: song, limit: 1 }, function (err, data) {

        if (err) {
            return console.log('Error occurred: ' + err);
        }

        else {

            //log data in log.txt
            logData(
                "Song: " + data.tracks.items[0].name + "\n" +
                "Artist: " + data.tracks.items[0].artists[0].name + "\n" +
                "Album: " + data.tracks.items[0].album.name + "\n" +
                "Preview link: " + data.tracks.items[0].preview_url + "\n"
            );

            //print data in console
            console.log("");
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview link: " + data.tracks.items[0].preview_url);
            console.log("");
        }
    });
}
//=================================================================================================================

//OMDB: Returns movie info from user search
//=================================================================================================================
function movieThis(movie) {

    //if no user input for search, default to Mr. Nobody
    if (!userQuery) {
        movie = "Mr. Nobody";
    }

    //request results from OMDB API
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + movie, function (error, response, body) {

            if (error) {
                console.log("Error: " + error);
            }
            else {
                //convert to useable JSON object
                parsedBody = JSON.parse(body);

                //log data in log.txt
                logData(
                    "Title: " + parsedBody.Title + "\n" +
                    parsedBody.Ratings[0].Source + ": " + parsedBody.Ratings[0].Value + "\n" +
                    parsedBody.Ratings[1].Source + ": " + parsedBody.Ratings[1].Value + "\n" +
                    "Country: " + parsedBody.Country + "\n" +
                    "Language: " + parsedBody.Language + "\n" +
                    "Plot: " + parsedBody.Plot + "\n" +
                    "Actors: " + parsedBody.Actors + "\n"
                );

                //print data in console
                console.log("");
                console.log("Title: " + parsedBody.Title);
                console.log(parsedBody.Ratings[0].Source + ": " + parsedBody.Ratings[0].Value);
                console.log(parsedBody.Ratings[1].Source + ": " + parsedBody.Ratings[1].Value);
                console.log("Country: " + parsedBody.Country);
                console.log("Language: " + parsedBody.Language);
                console.log("Plot: " + parsedBody.Plot);
                console.log("Actors: " + parsedBody.Actors);
                console.log("");
            }
        })
}
//=================================================================================================================

//Do what it says: take info from random.txt and run LIRI
//=================================================================================================================
function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        //lets user know if there's an error
        if (error) {
            console.log(error);
        }
        else {
            // //split string into an array w/ function to run at [0] and query at [1]
            var dataArr = data.split(",");

            //set userQuery and run LIRI function
            userQuery = dataArr[1];
            userCommand = dataArr[0];
            LIRI(userCommand);
        }
    })
}
//=================================================================================================================

//Log all returned data from command line in log.txt file
//=================================================================================================================
function logData(data) {
    fs.appendFileSync("log.txt", data + "\n", function (err) {
        if (err) {
            console.log(err);
        }
    });
}