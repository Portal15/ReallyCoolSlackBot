require("dotenv").config();
const axios = require("axios");

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/rcsb-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/rcsb-pingy - Check bot latency
/rcsb-help - Show available commands
/rcsb-catfact - Get a cat fact
/rcsb-dogpic - Get a random dog picture
/rcsb-catpic - Get a random cat picture`
  });
});


app.command("/rcsb-pingy", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pongy! :)\nLatency: ${latency}ms` });
});

app.command("/rcsb-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `A Really Cool Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});
app.command("/rcsb-dogpic", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://dog.ceo/api/breeds/image/random");
    await respond({ text: `A Really Cool Dog Picture:\n${response.data.message}` });
    await respond({text: `Image: ${response.data.message}`, blocks: [
      {
        type: "image",
        image_url: response.data.message,
        alt_text: "Image of a dog"
      }
    ]
  });
  } catch (err) {
    await respond({ text: "Failed to fetch a dog picture." });
  }
});

app.command("/rcsb-catpic", async ({ ack, respond }) => {
  await ack();
  
  try { 
    const response = await axios.get("https://shibe.online/api/cats?count=1");
    await respond({ text: `A Really Cool Cat Picture:\n${response.data[0]}` });
    await respond({text: `Image: ${response.data[0]}`, blocks: [
      {
        type: "image",
        image_url: response.data[0],
        alt_text: "Image of a cat"
      }
    ]
  });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat picture." });
  }
});


(async () => {
  await app.start();
  console.log("bot is running!!");
})();
