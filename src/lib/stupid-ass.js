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

        this.listener.onChange(change => {
            this.setStatus(change);
        });

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

    /**
     * Say a String or something
     * Pauses listening while saying
     * @param {String} str
     */
    say(str) {
        // Pause
        return this.pause().then(() => {
            // Push to user
            this.render(str);
            // Do the saying
            return say(str)
                .then(() => this.resume())
                .catch(e => {
                    return this.resume();
                });
        });
    }

    /**
     * Ask the user a question
     * wait for answer or time out after 5 seconds
     * @param {String} str
     */
    async ask(str) {
        // Store an interval checker var
        let checker;
        // Set is waiting for answer
        this.isAwaitingAnswer = true;
        this.awaitingAnswer = null;
        // Say the question
        await this.say(str);
        // Return a promise
        return new Promise(resolve => {
            // Set a counter for keeping track of how long it runs
            let count = 0;
            // Set interval
            checker = setInterval(() => {
                // If there's a waiting answer - end this
                if (this.awaitingAnswer) {
                    this.isAwaitingAnswer = false;
                    clearInterval(checker);
                    resolve(this.awaitingAnswer);
                }
                // Incrase Count
                count++;
                // If it's been running for too long - end this.
                if (count > 20) {
                    this.isAwaitingAnswer = false;
                    clearInterval(checker);
                    resolve(false);
                }
            }, 500);
        });
    }

    /**
     * General Event Listener
     * stupid.on('ready', ()=>{ // do something });
     * @param {String} type
     * @param {Function} func
     */
    on(type, func) {
            this.events[type] = this.events[type] || [];
            if (this.events[type].indexOf(func) === -1) {
                this.events[type].push(func);
            }
        }
        /**
         * Fire off a general Event
         * stupid.fire('ready', {});
         * @param {String} type
         * @param {Any} payload
         */
    fire(type, payload) {
        this.events[type] = this.events[type] || [];
        console.log("This.events", this.events[type]);
        this.events[type].forEach(func => {
            func(payload);
        });
    }

    /**
     * Store a key value pair
     * @param {String} key
     * @param {String} value
     */
    set(key, value) {
        return this.storage.set(key, value);
    }

    /**
     * Get a value from key
     * @param {String} key
     */
    get(key) {
        return this.storage.get(key);
    }

    /**
     * Set the Status of Stupid
     * @param {String} status
     */
    setStatus(status) {
        // log("setting status to", status);
        this.status = status;
        if (status != "paused") {
            this.render();
        }
    }

    /**
     * Pause Stupid
     */
    pause() {
        // log("Trying to pause");
        this.setStatus("paused");
        return this.listener.pause();
    }

    /**
     * Resume Stupid
     */
    resume() {
        // log("Trying to resume");
        this.setStatus("listening");
        return this.listener.resume();
    }

    /**
     * Add a Command
     */
    addCommand(command) {
        this.commander.commands[this.commander.stage].push(command);
    }

    /**
     * Add Multiple Commands (array)
     * @param {Array} commands
     */
    addCommands(commands) {
        this.commander.commands[this.commander.stage] = [
            ...commands,
            ...this.commander.commands[this.commander.stage],
        ];
    }

    /**
     * Render the Stupid Page Element
     * Passing an optional msg to display it.
     * stupid.render("Hi there");
     * @param {String} msg
     */
    render(msg) {
        // If an ID is set for the UI
        if (this.options.ui) {
            // Get a base html element going
            let str = `<div class="status-${this.status}">${msg ||
				this.status}</div>`;

            // Get the Dom Element
            let dom = document.getElementById(this.options.ui);
            // Is there a dom?
            if (!dom) {
                // Dom Doesnt exist
                dom = document.createElement("div");
                dom.id = "stupid-assistant";
                // Add a button to kick off activation
                // Google requires a User input to start speech synth
                let activeButton = document.createElement("button");
                activeButton.className = "sa-btn";
                activeButton.innerHTML = "Click to Start";
                // On start button click
                activeButton.onclick = () => {
                    this.start();
                    // Remove button
                    activeButton.remove();
                    // Add buffer = then make whole thing clickable to resume listening
                    // TODO: find out why it some times stops listening.
                    setTimeout(() => {
                        dom.onclick = () => {
                            this.resume();
                        };
                    }, 120);
                };
                // Stick active button in Dom element
                dom.appendChild(activeButton);
                // Stick dom element in body.
                document.body.appendChild(dom);
            } else {
                // Dom Exists.. Just change HTML
                dom.innerHTML = str;
            }
            // Add class Name
            dom.classList.add("stupid-ass-ui");
        }
    }

    /**
     * Get Default Commands
     */
    defaultCommands() {
        let self = this;
        return [{
                triggers: ["List commands", "what can you do", "list your commands"],
                func() {
                    // Get all commands as a list - pull first trigger
                    let commands = self.commander.commands[self.commander.stage].map(c =>
                        c.triggers[0].replace(/\(\.\*\)/g, "X")
                    );
                    // Say commands
                    return self.say(commands.join("... "));
                },
            },
            {
                triggers: ["who created you", "who's your maker", "who made you"],
                func() {
                    return self
                        .ask(
                            "Brandon Corbin. You can learn more about him at twitter.com/brandoncorbin or iCorbin.com. Would you like to visit his site?"
                        )
                        .then(answer => {
                            if (answer === "yes") {
                                window.open(`https://icorbin.com`, "_blank");
                            }
                            return true;
                        });
                },
            },
        ];
    }
}

module.exports = StupidAss;