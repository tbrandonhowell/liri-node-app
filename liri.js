
// dependencies:
var axios = require("axios");
var Spotify = require('node-spotify-api');


// =================================
// FROM HOMEWORK INSTRUCTIONS:

// read and set any environment variables with the dotenv package:
require("dotenv").config();

// import the `keys.js` file and store it in a variable:
var keys = require("./keys.js");

// access your keys information like so:
var spotify = new Spotify(keys.spotify);

// =================================







// inputs:
var action = process.argv[2]; // grab the action
var input = process.argv.slice(3).join(" "); // get input by slicing and joining the array to get the input
console.log("==============================================");
console.log("===== TESTING =====");
console.log("==============================================");
console.log('action = "' + action + '" and input = "' + input + '"');
console.log("==============================================");
console.log("==============================================\n\n");


var concertThis = function(input) {
    console.log("concertThis triggered");
}


var spotifyThisSong = function(input) {
    console.log("==============================================");
    console.log("===== TESTING =====");
    console.log("==============================================");
    console.log("spotifyThisSong triggered");
    console.log("original input = " + input);
    if (input == "") {
        input = "The Sign";
    }
    console.log("checked input = " + input);
    spotify.search({ type: 'track', query: input }, function(err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
    // console.log(data); 
    // console.log(data.tracks.items[0]);
    console.log("==============================================");
    console.log("==============================================\n\n");
    console.log("\nArtist: " + data.tracks.items[0].album.artists[0].name);
    console.log("\nSong Name: " + data.tracks.items[0].name);
    console.log("\nPreview Link: " + data.tracks.items[0].album.href);
    console.log("\nAlbum: " + data.tracks.items[0].album.name);
    });
}


var movieThis = function(input) {
    console.log("==============================================");
    console.log("===== TESTING =====");
    console.log("==============================================");
    console.log("movieThis triggered");
    console.log("original input = " + input);
    if (input == "") {
        input = "Mr. Nobody";
    }
    console.log("checked input = " + input);
    queryInput = input.split(' ').join('+');
    // ^^ courtesy of https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
    console.log("prepped input = " + queryInput);
    var queryString = "http://www.omdbapi.com/?t=" + queryInput + "&apikey=trilogy";
    // TODO: should the apikey be obscured somehow, or does that matter?
    console.log("queryString = " + queryString);
    console.log("==============================================");
    console.log("==============================================\n\n");
    axios.get(queryString).then(
    function(response) {
        if (response.data.Response === 'False') {
            console.log('"' + input + '" was not found in the OMDB.\n\n')
        } else {
            // console.log(response.data);
            console.log("\nTitle: " + response.data.Title);
            console.log("\nYear Released: " + response.data.Released.slice(7));
            console.log("\nIMDB Rating: " + response.data.Ratings[0].Value);
            if (response.data.Ratings[1]) {
                console.log("\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            } else {
                console.log("\nNo Rotten Tomatoes Rating");
            }
            console.log("\nCountr(ies) Produced In: " + response.data.Country);
            console.log("\nLanguage: " + response.data.Language);
            console.log("\nPlot: " + response.data.Plot);
            console.log("\nActors: " + response.data.Actors);
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}


var doWhatItSays = function(input) {
    console.log("doWhatItSays triggered");
}




if (action == "concert-this") {
    concertThis(input);
} else if (action == "spotify-this-song") {
    spotifyThisSong(input);
} else if (action == "movie-this") {
    movieThis(input);
} else if (action == "do-what-it-says") {
    doWhatItSays(input);
} else {
    console.log("Action Request Not Recognized");
}
// ^^ replace this with a switch statement




// =================================
// HOMEWORK SPECS:

// 1. `node liri.js concert-this <artist/band name here>`
// 2. `node liri.js spotify-this-song '<song name here>'`
// 3. `node liri.js movie-this '<movie name here>'`
// 4. `node liri.js do-what-it-says`

// =================================
