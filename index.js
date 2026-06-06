require("dotenv").config();
const axios = require("axios");

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/dsb-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/dsb-pingy - Check bot latency
/dsb-help - Show available commands
/dsb-catfact - Get a cat fact
/dsb-dogpic - Get a random dog picture`
  });
});


app.command("/dsb-pingy", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!!\nLatency: ${latency}ms` });
});

app.command("/dsb-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});
app.command("/dsb-dogpic", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://dog.ceo/api/breeds/image/random");
    await respond({ text: `Dog Picture:\n${response.data.message}` });
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


(async () => {
  await app.start();
  console.log("bot is running!");
})();