module.exports = stupid => {
    return {
        triggers: ["setup", "set up", `configure`],
        async func() {
            let name = await stupid.ask(`What would you like me to call you?`);
            let location = await stupid.ask(`Thanks ${name}, where do you live?`);
            await stupid.say(`I hear ${location} is lovely`);
            stupid.set("name", name);
            stupid.set("location", location);
            return stupid.say(`Ok, thanks ${name}, I've saved your settings`);
        },
    };
};