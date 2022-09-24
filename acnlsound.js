console.log("SNES Soundtracks booting up");

const twitterUsername = '@actwtbot';

//making sure npm run develop works
if (process.env.NODE_ENV === "develop") {
  require("dotenv").config();
};

//rules for node-schedule
var schedule = require("node-schedule");
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 1,
rule.hour = 10;
rule.minute = 0;
rule.tz = "Etc/GMT+4";

//array to pull soundtracks from
var soundtrackArray = [
    "https://www.youtube.com/watch?v=85u34SUh05Y", // Legend of Zelda
    "https://www.youtube.com/watch?v=85u34SUh05Y", // Chrono Trigger
    "https://www.youtube.com/watch?v=UyNufyV3VCo", // Super Metroid
    "https://www.youtube.com/watch?v=Y2VJeZDejtc", // Final Fantasy VI
    "https://www.youtube.com/watch?v=wgUmFPnkoHU", // Super Mario World
    "https://www.youtube.com/watch?v=-QsysJwzod4", // Super Street Fighter II
    "https://www.youtube.com/watch?v=oRxgYC5zrV4", // Super Mario World 2: Yoshi's Island
    "https://www.youtube.com/watch?v=rJJk9Zk2h_U", // Super Mario Kart
    "https://www.youtube.com/watch?v=byIjMomjWkA", // Star Fox
    "https://www.youtube.com/watch?v=wpchBo75N68", // Super Mario RPG: Legend of the Seven Stars
  ];
var soundtrackArrayLength = soundtrackArray.length;
// ... append to bottom of file:

// Create a Twitter client object to connect to the Twitter API
var Twit = require('twit');

// Pulling keys from another file
var config = require('./config.js');
// Making a Twit object for connection to the API
var T = new Twit(config);

// Setting up a user stream
var stream = T.stream('statuses/filter', { track: twitterUsername });

// Now looking for Tweet events
// See: https://dev.Twitter.com/streaming/userstreams
stream.on('tweet', pressStart);

function pressStart(tweet) {

    var id = tweet.id_str;
    var text = tweet.text;
    var name = tweet.user.screen_name;
  
    let regex = /(please)/gi;
  
    // if there are no matches with the regex return an empty array
    let playerOne = text.match(regex) || [];
    // Checks to make sure playerOne has a match and is not an empty array
    let playerTwo = playerOne.length > 0;
  
    //this helps with errors, so you can see if the regex matched and if playerTwo is true or false
    console.log(playerOne);
    console.log(playerTwo);
  
  
    // checks text of tweet for mention of SNESSoundtracks
    if (text.includes(twitterUsername) && playerTwo === true) {
  
      // Start a reply back to the sender
      var soundtrackArrayElement = Math.floor(Math.random() * soundtrackArrayLength);
      var replyText = ("@" + name + " Here's your soundtrack: " + soundtrackArray[soundtrackArrayElement]);
  
      // Post that tweet
      T.post('statuses/update', { status: replyText, in_reply_to_status_id: id }, gameOver);
  
    } else {
      console.log("uh-uh-uh, they didn't say the magic word.");
    };
  
    function gameOver(err, reply) {
      if (err) {
        console.log(err.message);
        console.log("Game Over");
      } else {
        console.log('Tweeted: ' + reply.text);
      }
    };
  }

  function pressSelect() {
    var now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { timeZoneName: 'short' };
    const dateString = now.toLocaleDateString("en-US", dateOptions) + " at " + now.toLocaleTimeString("en-US", timeOptions);
  
    var soundtrackArrayElement = Math.floor(Math.random() * soundtrackArrayLength);
    var weeklyText = soundtrackArray[soundtrackArrayElement] + " Here's your soundtrack for " + dateString;
    T.post('statuses/update', { status: weeklyText }, gameOver2);
  
    function gameOver2(err, reply) {
      if (err) {
        console.log(err.message);
        console.log("Game Over");
      } else {
        console.log('Tweeted: ' + reply.text);
      }
    }
  }
  
  const job1 = schedule.scheduleJob(rule, pressSelect);