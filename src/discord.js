// Import
const fetch = require("node-fetch");
const { webhookURL } = require("./config");

// Embed Function
module.exports = async (tweet) => {
  // Destructure tweet
  const { entities, user, text } = tweet;
  const { user_mentions, urls, hashtags, media } = entities;
  const { screen_name } = user;

  // Embed Fields
  const embedFields = [];

  // Add Tweet Content To Embed
  embedFields.push({
    name: "Tweet Content",
    value: text
  });

  // User Mentions
  if (user_mentions[0]) {
    //
    let embedMentions = "";
    for (const mention of user_mentions) {
      embedMentions += `[@${mention.screen_name}](https://twitter.com/${mention.screen_name}/)\n`;
    }

    // Push To Array
    embedFields.push({
      name: "Mentioned Users",
      value: embedMentions
    });
  }

  // URLs
  if (urls[0]) {
    //
    let embedURL = "";
    for (const url of urls) {
      embedURL += `[**(t.co)**](${url.url}) - [${url.expanded_url}](${url.expanded_url})\n`;
    }

    // Push To Array
    embedFields.push({
      name: "Detected URLs",
      value: embedURL
    });
  }

  // Hashtags
  if (hashtags[0]) {
    //
    let embedHashtag = "";
    for (const hashtag of hashtags) {
      embedHashtag += `[#${hashtag.text}](https://twitter.com/hashtag/${hashtag.text}/)\n`;
    }

    // Push To Array
    embedFields.push({
      name: "Hashtags",
      value: embedHashtag
    });
  }

  // Useful Links
  embedFields.push({
    name: "Useful Links",
    value: `[**(Profile)**](https://twitter.com/${screen_name}) - [**(Liked Tweets)**](https://twitter.com/${screen_name}/likes) - [**(Following)**](https://twitter.com/${screen_name}/following)`
  });

  // Embed
  const embed = {
    //
    username: `@${screen_name} Twitter Monitor`,
    avatar_url: user.profile_image_url_https,
    embeds: [
      {
        author: {
          name: `${user.name} • (${screen_name})`,
          url: `https://twitter.com/${screen_name}/`,
          icon_url: user.profile_image_url_https
        },
        title: "New Tweet!",
        url: `https://twitter.com/${screen_name}/status/${tweet.id_str}`,
        color: 255,
        image: { url: media ? media[0].media_url : "" },
        fields: embedFields,
        footer: { text: `Made By: Sami | @casuallyonline` }
      }
    ]
  };

  // Send Embed
  try {
    await fetch(webhookURL, {
      method: "post",
      body: JSON.stringify(embed),
      headers: { "Content-Type": "application/json" }
    });
    console.log("Embed Sent!");
  } catch (error) {
    console.log("Failed to send embed! Try checking the webhook URL");
  }
};
