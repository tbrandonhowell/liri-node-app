
// TODO: write a better readme file
// TODO: generally clean up my comments and console.logs


// =================================
// DEPENDENCIES:
var axios = require("axios");
var Spotify = require('node-spotify-api');
require("dotenv").config(); // read and set any environment variables with the dotenv package
var keys = require("./keys.js"); // import the `keys.js` file and store it in a variable
var spotify = new Spotify(keys.spotify); // access your keys information like so
var fs = require("fs");
var moment = require('moment');
var wrap = require("word-wrap");
// =================================


// =================================
// CAPTURE INPUTS:
var action = process.argv[2]; // grab the action
var input = process.argv.slice(3).join(" "); // get input by slicing and joining the array to get the input
// =================================


// =================================
// concertThis() FUNCTION:
var concertThis = function(input) {
    if (input != "") {
        queryString = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp"
        axios.get(queryString).then(function(response) {
            console.log("\n\n============ " + input.toUpperCase() + ": UPCOMING SHOWS ============");
            if (response.data == "\n{warn=Not found}\n") {
                console.log('\nSorry, "' + input + '" was not found on BandsInTown.\n\n')
            } else if (!response.data[1]){
                console.log("\nSorry, it doesn't look like there are any upcoming events for " + input + ".\n\n");
            } else {
                response.data.forEach(function(event){
                    // build out the full location name dependent on what information is available:
                    var fullLocation; 
                    if (event.venue.city) {
                        fullLocation = event.venue.city;
                    }
                    if (event.venue.region) {
                        fullLocation = fullLocation + ", " + event.venue.region;
                    }
                    if (event.venue.country && event.venue.country != "United States") {
                        fullLocation = fullLocation + ", " + event.venue.country;
                    }
                    // strip the datetime down to pretty date:
                    var uglyDate = event.datetime.slice(0, -9);
                    var uglyDate = moment(uglyDate, "YYYY-MM-DD");
                    var prettyDate = moment(uglyDate).format("MM/DD");
                    // print out the event:
                    console.log("\n" + prettyDate + " ~ " + event.venue.name + " ~ " + fullLocation);
                });
                console.log("\n\n");
            }
        })
        .catch(function(err) {
            console.log(err);
        });
    } else {
        console.log('\nPlease input an artist name when running this function.\n\n');
    }
}
// =================================


// =================================
// spotifyThisSong() FUNCTION:
var spotifyThisSong = function(input) {
    if (input == '') {
        input = 'Ace of Base The Sign';
    }
    spotify.search({ type: 'track', query: input }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        if (!data.tracks.items[0]) {
            console.log('\nSorry, "' + input + '" was not found on Spotify.\n\n')
        } else {
            console.log("\n\n==============================================");
            console.log("================SPOTIFY SEARCH:===============")
            console.log("==============================================");
            console.log("\nArtist:         " + data.tracks.items[0].album.artists[0].name);
            console.log("\nSong Name:      " + data.tracks.items[0].name);
            console.log("\nPreview Link:   " + data.tracks.items[0].preview_url);
            console.log("\nAlbum:          " + data.tracks.items[0].album.name + "\n\n");
        }
    });
}
// =================================


// =================================
//  FUNCTION:
var movieThis = function(input) {
    if (input == "") {
        input = "Mr. Nobody";
    }
    queryInput = input.split(' ').join('+');
    // ^^ courtesy of https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
    var queryString = "http://www.omdbapi.com/?t=" + queryInput + "&apikey=trilogy";
    axios.get(queryString).then(
    function(response) {
        if (response.data.Response === 'False') {
            console.log('\nSorry, "' + input + '" was not found in the OMDB.\n\n')
        } else {
            console.log("\n\n||||||||||||||||||||||||||||||||||");
            console.log("||                              ||");
            console.log("||          NOW SHOWING:        ||");
            console.log("||                              ||");
            console.log("||||||||||||||||||||||||||||||||||");
            console.log("\n=== " + response.data.Title + " ===");
            console.log("\nYear Released: " + response.data.Released.slice(7));
            console.log("\nIMDB Rating: " + response.data.Ratings[0].Value);
            if (response.data.Ratings[1]) {
                console.log("\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            } else {
                console.log("\nNo Rotten Tomatoes Rating");
            }
            console.log("\nCountr(ies) Produced In: " + response.data.Country);
            console.log("\nLanguage: " + response.data.Language);
            console.log("\nPlot: ");
            console.log(wrap(response.data.Plot));
            console.log("\nActors: " + response.data.Actors + "\n\n");
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}
// =================================


// =================================
//  FUNCTION:
var doWhatItSays = function(input) {
    console.log("doWhatItSays triggered");
    fs.readFile("random.txt", "utf8", function(err, data) {
        if(err) {
            return console.log("Error: ", err);
        }
        console.log(data);
        data = data.replace(/"/g,''); // strip out any quotes
        data = data.replace(/'/g,''); // strip out any apostrophes
        data = data.split(",");
        console.log(data);
        if (data[0] == "concert-this") {
            concertThis(data[1]);
        } else if (data[0] == "spotify-this-song") {
            spotifyThisSong(data[1]);
        } else if (data[0] == "movie-this") {
            movieThis(data[1]);
        } else {
            console.log("random.txt Action Request Not Recognized");
        }
    });
}
// =================================



// * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

// * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.

// * Edit the text in random.txt to test out the feature for movie-this and concert-this.


// =================================
// :
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
// TODO: ^^ replace this with a switch statement
// =================================


