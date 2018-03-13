const express = require("express");
const builder = require("botbuilder");
const cognitive = require("botbuilder-cognitiveservices");
const config = require("./config")

const app = express();
const connector = new builder.ChatConnector({
    appId: "",
    appPassword: ""
})

const bot = new builder.UniversalBot(connector);

let qnaMakerRecognizer = new cognitive.QnAMakerRecognizer({
    knowledgeBaseId: "33a2c14c-a251-4341-a8b0-23fc34275f51",
    subscriptionKey: "480cb7f9d580462db85f9fb021642114"
})

let intents = new builder.IntentDialog({ recognizers: [qnaMakerRecognizer] })
    .matches("qna", "/qna")
    .onDefault("/none");


bot.dialog("/", intents);

bot.dialog("/qna", function (session, args, next) {
    var answerEntity = builder.EntityRecognizer.findEntity(args.entities, "answer");
    session.send(answerEntity.entity);
});

bot.dialog("/none", function (session) {
    session.send("I could not find any information for you!");
});

app.post("/api/messages", connector.listen());
app.listen(3978);