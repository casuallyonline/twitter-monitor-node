// Import
const Twit = require("twit");
const discord = require("./discord.js");

// Config
const {
  apiKey,
  apiSecret,
  accessToken,
  accessTokenSecret,
  accounts
} = require("./config");

// Twitter Authentication
const Twitter = new Twit({
  consumer_key: apiKey,
  consumer_secret: apiSecret,
  access_token: accessToken,
  access_token_secret: accessTokenSecret
});

// Array For Account ID
const accountIDs = [];

// Account Retireval
function getAccounts() {
  //
  return new Promise((resolve, reject) => {
    //
    for (const account of accounts) {
      //
      Twitter.get("/users/show", { screen_name: account }, (err, data, res) => {
        //
        if (err) {
          reject(console.log("Failed To Retrieve Accounts!"));
        }

        accountIDs.push(data.id_str);

        if (!err && accountIDs.length === accounts.length) {
          resolve(console.log("Accounts Retrieved!"));
        }
      });
    }
  });
}

// Twitter Monitor
function monitor() {
  // Twitter Stream
  const stream = Twitter.stream("statuses/filter", {
    follow: accountIDs
  });

  // Attempt a Connection To Twitter
  stream.on("connect", (request) => {
    console.log("Attempting a connection to Twitter...");
  });

  // Success Message Once Connected To Twitter
  stream.on("connected", (response) => {
    console.log("Successfully connected to Twitter!");
  });

  // Warning Message From Twitter
  stream.on("warning", (warning) => {
    console.log("Twitter is sending a warning!");
  });

  // Tweet Withheld Message From Twitter
  stream.on("status_withheld", (withheldMsg) => {
    console.log("Tweet has been withheld in your country!");
  });

  // User Withheld Message From Twitter
  stream.on("user_withheld", (withheldMsg) => {
    console.log("User has been withheld in your country!");
  });

  // Disconnect Message From Twitter
  stream.on("disconnect", (disconnectMessage) => {
    console.log("Stream has been disconnected!");
  });

  // Tweet Stream
  stream.on("tweet", (tweet) => {
    //
    if (accountIDs.includes(tweet.user.id_str)) {
      discord(tweet);
    }
  });
}

// Run
getAccounts().then(monitor);
