const Commander = require("./commander");

const assert = require("assert");

let addCommandTest = (triggers, testSaying) => {
    return new Promise(resolve => {
        let commander = new Commander();
        commander.addCommand({
            triggers: triggers,
            func(payload) {
                resolve(payload);
            },
        });
        commander.fire(testSaying);
    });
};

describe("Commander", function() {
    it("should exist", () => {
        let commander = new Commander();
        assert.ok(commander);
    });
});

describe("#addCommand() Simple", function() {
    it("should find a match for 'hello there' even when messed up", async() => {
        let response = await addCommandTest(
            ["hello there", "hi there"], ["Sample Input", " HeLLo TheRE "]
        );
        assert.equal(response.match[0], "hello there");
    });
});

describe("#addCommand() Wildcards", function() {
    it("should extract multiple wildcards", async() => {
        let test1 = await addCommandTest(
            ["set (.*) to (.*)"],
            "set name to brandon"
        );
        assert.equal(test1.match[0], "name");
        assert.equal(test1.match[1], "brandon");
    });
});

describe("#goto()", () => {
    let commander = new Commander();
    commander.load("root", [{
        triggers: ["hi"],
        func() {
            return true;
        },
    }, ]);
    commander.load("hotword", [{
        triggers: ["hello"],
        func() {
            commander.goto("root");
        },
    }, ]);

    commander.goto("hotword");

    let stage1 = commander.stage;
    it("should goto hotword", () => {
        assert.ok(stage1 === "hotword");
    });

    commander.goto("root");
    let stage2 = commander.stage;

    it("should goto root stage", () => {
        assert.ok(stage2 === "root");
    });

    it("should go to match in the current stage", () => {
        let response = commander.fire("hi");
        assert.equal(response, true);
    });
    it("should NOT go to match in the current stage", () => {
        let noresponse = commander.fire("hello"); // this should not exist;
        assert.equal(noresponse, false);
    });
});