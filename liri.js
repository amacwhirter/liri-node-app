//set up variables requiring npm packages

var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var inquirer = require('inquirer');
var fs = require('fs');

var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

//Use inquirer for selection of commands

inquirer.prompt([{
        type: "list",
        message: "What command would you like to run?",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "commands"
    }

]).then(function(user) {
    console.log(JSON.stringify(user, null, 2));

    //==========================================Twitter===============================================

    if (user.commands === "my-tweets") {

      //prompt user to confirm if they reallllly want to read my awesome Tweets

        inquirer.prompt([{
                type: "confirm",
                message: "Are you sure you want to view my past posts?",
                name: "confirm",
                default: true
            }

        ]).then(function(user) {

          //If user confirms yes and there is no error, my last 20 Tweets will be listed

            if (user.confirm === true) {
                //console.log("test");

                var params = {
                    screen_name: "ashmac10",
                    count: 20
                };

                //console.log(params.screen_name);

                client.get("statuses/user_timeline", params, function(error, response) {
                    if (!error) {
                        for (var i = 0; i < response.length; i++) {
                            var time = response[i].created_at;
                            var tweets = response[i].text;
                            var user = params.screen_name;
                            console.log("============================================");
                            console.log("");
                            console.log("----------------" + time + "--------------------------");
                            console.log("");
                            console.log("@" + user + " tweeted:");
                            console.log("");
                            console.log(tweets);
                            console.log("");
                            console.log("============================================");
                        }
                        //console.log(tweets);
                    } else {
                        console.log(error);
                    }
                });

                //if user decides to not view my Tweets, console log response

            } else {
                console.log("============================================");
                console.log("");
                console.log("Probably a wise choice! Try looking up a movie or song!");
                console.log("");
                console.log("============================================");
            }
        });

        //=======================================Spotify===============================================

    } else if (user.commands === "spotify-this-song") {

        //prompt user to type in song to lookup - 'The Sign' by Ace of Base set as default

        inquirer.prompt([{
                type: "input",
                message: "What song should I look up?",
                name: "song",
                default: "The Sign Ace of Base"
            }

            //set up Spotify search for Track based on "song" input by user

        ]).then(function(response) {
            spotify.search({
                type: 'track',
                query: response.song,
                limit: 1
            }, function(err, data) {
                if (err) {
                    console.log('Error occurred: ' + err);
                    return;

                    //set up base path for finding information through Spotify API

                } else {
                    var trackName = data.tracks.items;

                    //for loop through results to pick out desired information

                    for (var i = 0; i < 1; i++) {

                        var trackData = trackName[i];

                        var artists = trackData.artists[0].name;
                        var song = trackData.name;
                        var preview = trackData.preview_url;
                        var album = trackData.album.name;

                        //console log out the information found on the track provided by user

                        console.log("============================================");
                        console.log("");
                        console.log("Artist: " + artists);
                        console.log("~~~~~~~~~~~~~~~~~~~~~")
                        console.log("Song Title: " + song);
                        console.log("~~~~~~~~~~~~~~~~~~~~~")
                        console.log("Album: " + album);
                        console.log("~~~~~~~~~~~~~~~~~~~~~")
                        console.log("Song Preview: " + preview);
                        console.log("");
                        console.log("============================================");
                    }
                }
            });
        });


        //===========================================OMDB================================================

    } else if (user.commands === "movie-this") {
        inquirer.prompt([{
                type: "input",
                message: "What movie should I look up?",
                name: "movie",
                default: "Mr. Nobody"
            }

        ]).then(function(response) {

            //run a request to the OMDB API with the movie specified by user

            request("http://www.omdbapi.com/?t=" + response.movie + "&y=&plot=short&r=json", function(error, response, body) {

                // If there is no errir, and the request is successful (i.e. if the response status code is 200)

                if (!error && response.statusCode === 200) {

                    // Parse the body of the site and recover the info needed

                    console.log("======================================")
                    console.log("");
                    console.log("Title: " + JSON.parse(body).Title);
                    console.log("~~~~~~~~~~~~~~~~~~~~~")
                    console.log("Release Date: " + JSON.parse(body).Year);
                    console.log("~~~~~~~~~~~~~~~~~~~~~")
                    console.log("IMBD rating is: " + JSON.parse(body).imdbRating);
                    console.log("~~~~~~~~~~~~~~~~~~~~~")
                    console.log("Produced in (country): " + JSON.parse(body).Country);
                    console.log("~~~~~~~~~~~~~~~~~~~~~")
                    console.log("Main language: " + JSON.parse(body).Language);
                    console.log("~~~~~~~~~~~~~~~~~~~~~")
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("~~~~~~~~~~~~~~~~~~~~~")
                    console.log("Actor's include: " + JSON.parse(body).Actors);
                    console.log("");
                    console.log("======================================")
                }
            });
        });

        //===============================================FS============================================

    } else if (user.commands === "do-what-it-says") {
        // This block of code will read from the "random.txt" file.
        // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
        // The code will store the contents of the reading inside the variable "data"
        fs.readFile("random.txt", "utf8", function(error, data) {

            // We will then print the contents of data
            console.log(data);

            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");

            // We will then re-display the content as an array for later use.
            console.log(dataArr);

        });
    }
});
