/**
 * Listener to interact with the Mic
 *
 * Example:
 *
 * let listener = new Listener();
 * listener.onHeard((word)=>{ console.log(`I heard ${word}`) })
 * listener.start();
 * listener.pause();
 *
 */

class Listener {
    constructor() {
        this.status = "idle";
        this.events = [];
        this.lastHeard = null;
        this.init();
        this.recognition = new(window.SpeechRecognition ||
            window.webkitSpeechRecognition ||
            window.mozSpeechRecognition ||
            window.msSpeechRecognition)();
        this.recognition.lang = "en-US";
        this.recognition.interimResults = false;
        this.recognition.continuous = true;
        this.recognition.maxAlternatives = 3;
        this.recognition.onresult = this.onResults.bind(this);

        this.recognition.onstart = event => {
            console.log("🔈 ");
            this.status = "listening";
        };
        this.recognition.onend = event => {
            console.log("🔇 ");
            this.status = "paused";
        };
    }

    onResults(event) {
        let results = event.results;
        let heard = results[0];
        this.lastHeard = heard[0].transcript;
        console.log("🔈 Heard Words:", this.lastHeard);
        this.events.forEach(func => {
            func(this.lastHeard);
        });
    }

    init() {}

    whenStatusIs(status) {
        let check;
        let count = 0;
        return new Promise((resolve, reject) => {
            check = setInterval(() => {
                if (this.status == status) {
                    clearInterval(check);
                    resolve(true);
                } else if (count > 20) {
                    clearInterval(check);
                    resolve(false);
                }
                count++;
            }, 500);
        });
    }

    pause() {
        this.recognition.stop();
        return this.whenStatusIs("paused");
    }
    resume() {
        this.recognition.start();
        return this.whenStatusIs("listening");
    }
    start() {
        this.recognition.start();
        return this.whenStatusIs("listening");
    }
    onHeard(func) {
        if (this.events.indexOf(func) === -1) {
            this.events.push(func);
        }
    }
} // end listener

module.exports = Listener;