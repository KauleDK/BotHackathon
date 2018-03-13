const express = require("express");
const builder = require("botbuilder");
const cognitive = require("botbuilder-cognitiveservices");

const config = require("./config");
const app = express();
const connector = new builder.ChatConnector({
    appId: config.appId,
    appPassword: config.appPassword
})

let inMemoryStorage = new builder.MemoryBotStorage();
let luisModel = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/11262e67-8d5b-46d4-b393-eeb6616daf86?subscription-key=81ea20439cf84bc598d81a385ef8f540&verbose=true&timezoneOffset=0&q=";


const bot = new builder.UniversalBot(connector);
bot.set("storage", inMemoryStorage);

//Our recognizers
let luisRecognizer = new builder.LuisRecognizer(luisModel);
let qnaMakerRecognizer = new cognitive.QnAMakerRecognizer({
    knowledgeBaseId: "13be075b-052b-4afa-b11c-b60d90e79fb3",
    subscriptionKey: "480cb7f9d580462db85f9fb021642114"
})

var intents = new builder.IntentDialog({ recognizers: [qnaMakerRecognizer, luisRecognizer], intentThreshold: 0.8, })
    .matches("Transfer", "/Agent")
    .matches("qna", "/qna")
    .matches("None", "/none")
    .onDefault("/none");

bot.dialog("/", intents);

bot.dialog("/none", [
    function (session) {
        if (session.message.sourceEvent.type === "visitorMessage") {
            builder.Prompts.confirm(session, "I dind't find any information for you, do you want to talk to a human?");
        }
        
        if (session.message.sourceEvent.type === "systemMessage") {
            session.send("Hi, I'm your friendly ChatBot, how can i help you?");
        }

        else {
            session.endDialog();
        }
    }, function (session, result) {
        if (result.response) {
            session.replaceDialog("/Agent");
        }
        else {
            session.endDialog();
        }
    }
]);

bot.dialog("/qna", function (session, args, next) {
    var answerEntity = builder.EntityRecognizer.findEntity(args.entities, "answer");
    session.endDialog(answerEntity.entity);
});

bot.dialog("/Agent", function (session, args) {
    var msg = new builder.Message(session).sourceEvent({ directline: { type: "transfer", agent: "Jesper" } });
    session.endDialog(msg);
});

app.post("/api/messages", connector.listen());

app.listen(3978, function () {
    console.log("Server is running on port 3978");
})