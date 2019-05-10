module.exports = stupid => {
    return {
        triggers: ["what time is it", `what's the time`],
        func() {
            return stupid.say(
                `The time is ${new Date().toLocaleString("en-US", {
					hour: "numeric",
					minute: "numeric",
					hour12: true,
				})}`
            );
        },
    };
};