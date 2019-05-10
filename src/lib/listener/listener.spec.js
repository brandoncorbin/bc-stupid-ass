const assert = require("assert");
const Listener = require("./listener");

let listener = new Listener();

describe("Listener.js Tests", function() {
    this.timeout(10000);
    it("should be a type of listener", function() {
        assert.equal(listener instanceof Listener, true);
    });
    it("should have a resume method", () => {
        assert.equal(typeof listener.resume, "function");
    });
    it("should have a pause method", () => {
        assert.equal(typeof listener.pause, "function");
    });
    it("should have a start method", () => {
        assert.equal(typeof listener.start, "function");
    });
    it("should have a onHeard method", () => {
        assert.equal(typeof listener.onHeard, "function");
    });
});