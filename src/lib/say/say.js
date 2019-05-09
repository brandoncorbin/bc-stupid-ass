const Say = (str, timeout) => {
    return new Promise((resolve, reject) => {
        let msg = new SpeechSynthesisUtterance(str);
        window.speechSynthesis.speak(msg);
        msg.onend = () => {
            console.log("Message is done being said in say.js");
            resolve();
        };
        msg.onerror = err => {
            reject(err);
        };
    });
};
module.exports = Say;