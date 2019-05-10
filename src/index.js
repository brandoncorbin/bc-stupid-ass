// Get Stupid

const StupidAss = require("./lib/stupid-ass");

// Get some Common Commands
const WhatTimeIsIt = require("./lib/commands/the-time");
const WhatDayIsIt = require("./lib/commands/the-date");
const Setup = require("./lib/commands/setup");

// Create the Main Stupid Assistant
let stupid = new StupidAss({
    ui: "#stupid-ass",
    // hotword: "Vicki",
});

// Load in some common commands - like "what time is it", "what day is it"
stupid.addCommand(WhatTimeIsIt(stupid));
stupid.addCommand(WhatDayIsIt(stupid));
stupid.addCommand(Setup(stupid));

// Testing is this thing on ?
stupid.addCommand({
    triggers: ["hello", "testing", "is this thing on"],
    func() {
        return stupid.say(
            `Hello! Yes, this is working. Why don't you ask me what I can do?`
        );
    },
});

// Interactive Demo Example
stupid.addCommand({
    triggers: ["let's do a demo"],
    async func() {
        let answer = await stupid.ask("Ok, pick a number from 1 to 100");
        await stupid.say(`Good job! ${answer} is a very good number.`);
        let mathAnswer = await stupid.ask(`What's ${answer} times 100?`);
        let realAnswer = `${parseFloat(answer) * 100}`;
        if (mathAnswer === realAnswer) {
            return stupid.say("Of course you knew that! I'm so stupid.");
        } else {
            return stupid.say(
                `You should be happy that Robots are making those types of questions obsolete. The answer is actually ${realAnswer}`
            );
        }
    },
});

stupid.addCommand({
    triggers: ["ask me something"],
    func() {
        return stupid.ask("What is your favorite color?").then(answer => {
            return stupid.say(`I love the ${answer} too! We're soul makes I think.`);
        });
    },
});

stupid.addCommand({
    triggers: ["my age is (.*)"],
    func(payload) {
        let age = parseInt(payload.match[0]);
        saying = "Life is good";
        if (age < 30) {
            saying = "You're a young pup!";
        } else if (age >= 30 && age <= 59) {
            saying = "Life's catching up to you eh?";
        } else if (age > 60) {
            saying = "Hope you're ready!";
        }
        return stupid.say(saying);
    },
});

stupid.addCommand({
    triggers: ["how many days have I been alive", "how many days old am I"],
    async func() {
        let age = stupid.get("age") || (await stupid.ask("How old are you?"));
        return stupid.say(
            `At the age of ${age}, you have experienced ${parseInt(age) * 365} days`
        );
    },
});

// Getting a Variable
stupid.addCommand({
    triggers: ["get variable (.*)"],
    async func(payload) {
        let key = payload.match[0];
        let value = stupid.get(key);
        if (!value) {
            let answer = await stupid.ask(
                `Variable ${key} does not exist. Would you like to set it?`
            );
            if (answer === "yes") {
                let newVarAnswer = await stupid.ask(`Ok, what value for ${key}?`);
                stupid.set(key, value);
                return stupid.say("Done");
            } else {
                return stupid.say("Fine!");
            }
        } else {
            return stupid.say(`${key} is ${value}`);
        }
    },
});

// Setting a variable
stupid.addCommand({
    triggers: ["set variable (.*) to value (.*)"],
    func(payload) {
        stupid.set(payload.match[0], payload.match[1]);
        return stupid.say(
            `Ok, I've set "${payload.match[0]}" to "${payload.match[1]}"`
        );
    },
});

// Example of an alias of sorts
stupid.addCommand({
    triggers: [`what's my (.*)`],
    func(payload) {
        return stupid.commander.fire(`get variable ${payload.match[0]}`);
    },
});

stupid.render();
window.stupid = stupid;