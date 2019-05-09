import "babel-polyfill";
import say from "./say/say";
import Commander from "./commander/commander";
import Listener from "./listener/listener";
import Storage from "./storage/storage";

let log = (arg1, arg2, arg3) => {
    console.log("😈", arg1, arg2 || "", arg3 || "");
};

class StupidAss {
    constructor(options) {
        // Get any options provided to stupid
        this.options = options || {};
        // Default to a set ID for now - todo: make it dynamic
        this.options.ui = "stupid-assistant";
        // Start with a dead status
        this.status = "dead";
        // Use Hotword? // todo: get this working
        this.hotword = options.hotword || false;
        // House any event listeners
        this.events = {};
        // Load up the Mic Listener
        this.listener = new Listener();
        // Load up Commander
        this.commander = new Commander();
        // Add Default Commands
        this.commander.addCommands(this.defaultCommands());
        // Holder for ask function waiting
        this.isAwaitingAnswer = false;
        this.awaitingAnswer = null;
        // Setup a generalized storage unit - localstorage
        this.storage = new Storage("stupid-store-v1");
    }

    /**
     * Start Stupid
     */
    start() {
        // Set Listener to start
        this.listener.start();
        // Set the status
        this.setStatus("listening");
        // Fire off that we're ready
        this.fire("ready", this);
        // Set event Listener when we get some words
        this.listener.onHeard(async word => {
            // show to the user
            this.render(word);
            // Are we waiting for an answer to a previous question?
            if (this.isAwaitingAnswer) {
                // Yes, set the answer - it will get picked up
                this.awaitingAnswer = word;
            } else {
                // No, let's process it with commander.
                let answer = null;
                // If the user has a hotword - lets check for it in this command
                if (this.hotword) {
                    // Does it have the hotword?
                    if (word.search(this.hotword.toLowerCase()) > -1) {
                        // Yes, fire off the commander
                        answer = this.commander.fire(word);
                    } else {
                        // No missing hotword
                        console.log("Missing hotword");
                    }
                } else {
                    // No need for a hotword
                    answer = this.commander.fire(word);
                }

                // Did we find an answer?
                if (!answer) {
                    // No answer found - pause and resume to clear the pipes
                    await this.pause();
                    await this.resume();
                    // Show no command found.
                    if (answer === false) {
                        this.render(`No command for ${word}`);
                    }
                    // Clear no command found message.
                    setTimeout(() => {
                        this.render();
                    }, 2400);
                }
            }
        });
    }

    say(str) {
        return this.pause().then(() => {
            this.render(str);
            return say(str)
                .then(() => {
                    console.log("Done saying ", str);
                    return this.resume();
                })
                .catch(e => {
                    console.log("Error", e);
                    return this.resume();
                });
        });
    }

    async ask(str) {
        let checker;
        this.isAwaitingAnswer = true;
        this.awaitingAnswer = null;
        await this.say(str);
        return new Promise(resolve => {
            let count = 0;
            checker = setInterval(() => {
                if (this.awaitingAnswer) {
                    this.isAwaitingAnswer = false;
                    clearInterval(checker);
                    resolve(this.awaitingAnswer);
                }
                count++;
                if (count > 20) {
                    this.isAwaitingAnswer = false;
                    console.log("Timed out");
                    clearInterval(checker);
                    resolve("No answer");
                }
            }, 500);
        });
    }

    on(type, func) {
        this.events[type] = this.events[type] || [];
        if (this.events[type].indexOf(func) === -1) {
            this.events[type].push(func);
        }
    }

    set(key, value) {
        return this.storage.set(key, value);
    }

    get(key) {
        return this.storage.get(key);
    }

    fire(type, payload) {
        this.events[type] = this.events[type] || [];
        console.log("This.events", this.events[type]);
        this.events[type].forEach(func => {
            func(payload);
        });
    }

    setStatus(status) {
        log("setting status to", status);
        this.status = status;
        if (status != "paused") {
            this.render();
        }
    }

    pause() {
        log("Trying to pause");
        this.setStatus("paused");
        return this.listener.pause();
    }

    resume() {
        log("Trying to resume");
        this.setStatus("listening");
        return this.listener.resume();
    }

    addCommand(command) {
        this.commander.commands[this.commander.stage].push(command);
    }

    addCommands(commands) {
        this.commander.commands[this.commander.stage] = [
            ...commands,
            ...this.commander.commands[this.commander.stage],
        ];
    }

    defaultCommands() {
        let self = this;
        return [{
                triggers: ["List commands", "what can you do", "list your commands"],
                func() {
                    let commands = self.commander.commands[self.commander.stage].map(
                        command => {
                            return command.triggers[0].replace(/\(\.\*\)/g, "X");
                        }
                    );
                    return self.say(commands.join("... "));
                },
            },
            {
                triggers: ["who created you", "who's your maker", "who made you"],
                func() {
                    return self.say(
                        "Brandon Corbin. You can learn more about him at twitter.com/brandoncorbin or iCorbin.com"
                    );
                },
            },
        ];
    }

    render(msg) {
        if (this.options.ui) {
            let str = `<div class="status-${this.status}">${msg ||
				this.status}</div>`;

            let dom = document.getElementById(this.options.ui);
            if (this.status === "dead") {
                // Dom Doesnt exist
                dom = document.createElement("div");
                dom.id = "stupid-assistant";
                let activeButton = document.createElement("button");
                activeButton.className = "sa-btn";
                activeButton.innerHTML = "Click to Start";
                activeButton.onclick = () => {
                    this.start();
                    activeButton.remove();
                    setTimeout(() => {
                        dom.onclick = () => {
                            this.resume();
                        };
                    }, 120);
                };
                dom.appendChild(activeButton);
                document.body.appendChild(dom);
            } else {
                dom.innerHTML = str;
            }
            dom.classList.add("stupid-ass-ui");
        }
    }
}

module.exports = StupidAss;