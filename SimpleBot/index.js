const express = require("express");
const builder = require("botbuilder");
const app = express();

const connector = new builder.ChatConnector({
    appId: "",
    appPassword: ""
})

const bot = new builder.UniversalBot(connector);

bot.dialog("/", function (session) {
    session.send(`You said: ${session.message.text}`);
})

app.post("/api/messages", connector.listen());
app.listen(3978);