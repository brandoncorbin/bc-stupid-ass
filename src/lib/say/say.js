const Say = (str, timeout) => {
    return new Promise((resolve, reject) => {
        if (typeof SpeechSynthesisUtterance !== "undefined") {
            let msg = new SpeechSynthesisUtterance(str);
            window.speechSynthesis.speak(msg);
            msg.onend = () => {
                console.log("Message is done being said in say.js");
                resolve();
            };
            msg.onerror = err => {
                reject(err);
            };
        } else {
            reject({
                message: "Voice is not supported on this device",
            });
        }
    });
};
module.exports = Say;