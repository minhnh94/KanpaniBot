var annalina = require('./EmployeeBot');
var config = require('./config');
var dialog = require('./Dialog');
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function randomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function randomIntRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function updateLastTimeReplied(message) {
    lastTimeReplied[message.channel.name] = getCurrentTime();
}

function getCurrentTime() {
    var now = new Date();
    return now.getTime();
}

var answerTexts = dialog.annalina.answers;
var remainingOrb = {};
var MAX_ORB = 5;
var decline = dialog.annalina.decline;

function handleQuestion(message) {
    var authorId = message.author.id;
    if (typeof remainingOrb[authorId] === "undefined") {
        remainingOrb[authorId] = MAX_ORB;
    }
    if (remainingOrb[authorId] > 0) {
        remainingOrb[authorId]--;
        var text = answerTexts[randomInt(answerTexts.length)] + "\n\n";
        text += "Remaining orbs: ";
        for(var i=0;i<remainingOrb[authorId];i++) text += ":crystal_ball:";
        message.reply(text);    
    } else {
        message.reply(decline[randomInt(decline.length)]);
    }
    
}

function handleOrbCommand(message) {
    var authorId = message.author.id;
    if (typeof remainingOrb[authorId] === "undefined") {
        remainingOrb[authorId] = MAX_ORB;
    }
    var text = "\nYour remaining orbs: ";
    for(var i=0;i<remainingOrb[authorId];i++) text += ":crystal_ball:";
    message.reply(text);
}

function getCommand(message) {
    var text = message.content.trim().toLowerCase();
    if (text == "") return text;
    return text.split(" ")[0];
}

annalina.bot.on("message", function(message) {
    if (message.channel.type === "text" && message.channel.name === annalina.nutakuChannelName 
            && message.author.id != annalina.bot.user.id) {
        annalina.hasNewMessage = true;
    }
    var command = getCommand(message);
    switch (command) {
    case "~question":
        handleQuestion(message);
        break;
    case "~orb":
        handleOrbCommand(message);
        break;
    // case "~test":
    //     var channel = message.channel;
    //     if (channel.type === "text") {
    //         channel.sendFile("./Ran_damaged.png", "png", "test content");
    //     }
    default:
        annalina.handleCommonCommand(message);
        break;
    }
});

annalina.greetings = dialog.annalina.greetings;
annalina.idleTalks = dialog.annalina.idleTalks;
annalina.commonGoodMorning = annalina.commonGoodMorning.concat(dialog.annalina.commonGoodMorning);
annalina.commonGoodNight = annalina.commonGoodNight.concat(dialog.annalina.commonGoodNight);
annalina.commonThanks = annalina.commonThanks.concat(dialog.annalina.commonThanks);

annalina.bot.on("ready", function() {
    annalina.ready();
});
annalina.bot.login(config.annalina);
