const StupidAss = require("./lib/stupid-ass");
const WhatTimeIsIt = require("./lib/commander/common/the-time");
const WhatDayIsIt = require("./lib/commander/common/the-date");

let stupid = new StupidAss({
    ui: "#stupid-ass",
    hotword: "Computer",
});

// Load in some common commands - like "what time is it", "what day is it"
stupid.addCommand(WhatTimeIsIt(stupid));
stupid.addCommand(WhatDayIsIt(stupid));

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