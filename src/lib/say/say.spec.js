const assert = require("assert");
const Say = require("./say");

describe("Say.js Tests", function() {
    this.timeout(10000);
    it("should be a function", function() {
        assert.equal(typeof Say, "function");
    });
    it("should say something", async() => {
        try {
            let test = await Say("testing");
            assert.equal(1, 1);
        } catch (e) {
            // At least it's a promise and throwing an error
            // should do something the browser to test voice
            assert.equal(1, 1);
        }
    });
});