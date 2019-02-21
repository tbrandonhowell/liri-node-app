
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
// =================================


// =================================
// CAPTURE INPUTS:
var action = process.argv[2]; // grab the action
var input = process.argv.slice(3).join(" "); // get input by slicing and joining the array to get the input
// =================================


// TODO: use a package or build my own function to create columns for the concertThis() output
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
// TODO: need to figure out how to make the matching better
// see https://developer.spotify.com/documentation/web-api/reference/search/search/
var spotifyThisSong = function(input) {
    console.log("spotifyThisSong triggered");
    if (input == '') {
        input = '\"The%20Sign\"';
    }
    console.log("checked input = " + input);
    spotify.search({ type: 'track', query: input }, function(err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
    // console.log(data); 
    // console.log(data.tracks.items[0]);
    // TODO: do I know what happens if the song doesn't exist?
    // TODO: do we care if multiple songs come back with that same title?
    console.log("==============================================");
    console.log("==============================================\n\n");
    console.log("\nArtist: " + data.tracks.items[0].album.artists[0].name);
    console.log("\nSong Name: " + data.tracks.items[0].name);
    console.log("\nPreview Link: " + data.tracks.items[0].preview_url);
    console.log("\nAlbum: " + data.tracks.items[0].album.name);
    });
}
            // TODO: clean up the output of this in general
// =================================


// =================================
//  FUNCTION:
var movieThis = function(input) {
    console.log("movieThis triggered");
    if (input == "") {
        input = "Mr. Nobody";
    }
    console.log("checked input = " + input);
    queryInput = input.split(' ').join('+');
    // ^^ courtesy of https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
    console.log("prepped input = " + queryInput);
    var queryString = "http://www.omdbapi.com/?t=" + queryInput + "&apikey=trilogy";
    // TODO: should the api key be obscured somehow, or does that matter?
    console.log("queryString = " + queryString);
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
                // TODO: clean up the output of this in general
    // TODO: similar question here - do we do something if there is more than one result?
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


