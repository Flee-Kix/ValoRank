const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

// Replace with your actual bot token
const DISCORD_TOKEN = "MTI4MzY3NzYyMTYzMjIzNzYwMA.GuBbEP.sKrbGjyzDtFJxMa1Ql_ADXo5HjvwNL5mH3CYRI"; 
const SHEET_URL = "https://script.google.com/macros/s/AKfycbxEmZmWv4AocFK2E2vMJtLJYkw6oLLo6jiR_n7x5sLuGMGB6s-j-Cwg5uq71K6iRa8RtA/exec";

console.log("Starting bot...");

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  console.log("Message received:", message.content);

  if (message.content.startsWith("!valoRank")) {
    console.log("Command '!valoRank' detected");
    const discordId = message.author.id;
    try {
      const response = await axios.get(`${SHEET_URL}?discordId=${discordId}`);
      const rank = response.data; // Adjust based on your Apps Script response format
      message.reply(`Tu es actuellement ${rank}`);
    } catch (error) {
      console.error("Error fetching rank:", error);
      message.reply("There was an error retrieving your rank.");
    }
  }

  if (message.content.startsWith("!addProfile")) {
    const args = message.content.split(" ");
    if (args.length !== 4) {
      return message.reply("Usage: !addProfile <username> <tag> <twitchUsername>");
    }

    const [username, tag, twitchUsername] = args.slice(1);
    const discordId = message.author.id;

    try {
      console.log('Sending data:', { discordId, username, tag, twitchUsername }); // Log the data being sent
      const response = await axios.post(SHEET_URL, null, {
        params: {
          action: 'add',
          discordId,
          username,
          tag,
          twitchUsername
        }
      });
      console.log(SHEET_URL, null, {
        params: {
          action: 'add',
          discordId,
          username,
          tag,
          twitchUsername
        }
      });
      console.log('Response from server:', response.data); // Log the response from the server
      message.reply(`${response.data}`);
    } catch (error) {
      console.error("Error adding profile:", error);
      message.reply("There was an error adding your profile.");
    }
  }
});

client.login(DISCORD_TOKEN);