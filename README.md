# Stupid Assistant

Stupid Assistant is a "siri/alexa" proof of concept I built over a 10 day period - this is the front-end version.

![](https://shareking.s3.amazonaws.com/ToD3yKPT4QBv.jpg)

## Notes before use:

- It's not even in alpha...
- ZERO Dependencies (except dev stuff)
- **IT ONLY WORKS in CHROME**.
- Voice recognition is done by Google - so...
- **it's NOT PRIVATE**
- If Recording randomly spots - click the screen. It's a bug

## Installing Stupid

```
git clone git@github.com:brandoncorbin/bc-stupid-ass.git
cd bc-stupid-ass
npm install
```

## Running Stupid

```
npm run dev
```

## Testing Stupid

```
npm test
```

## Adding your own Commands

**src/index.js** - this is where you can find all of the commands running for this demo.

## Command Examples

A command contains a trigger (or multiple triggers), and a function to call when one of those commands is met. The function must return a promise.

Here's a basic example that will be triggered when it hears `what is my name`

```
stupid.addCommand({
    triggers: ['what is my name'],
    func() {
        return stupid.say('It's whatever you want it to be')
    }
})
```

### Asking Questions

```
stupid.addCommand({
    triggers: ['what is my name'],
    func() {
        return stupid.ask('WHat is your favorite color').then((answer)=>{
            return stupid.say(`Oh! I too love the ${answer}`)
        })
    }
})
```

### Getting Variables from Triggers

```
stupid.addCommand({
    triggers: ['my age is (.*)'],
    func(payload) {
        let age = parseInt(payload.match[0]);
        if(age < 30) {
            return stupid.say("You're a young pup!");
        } else if(age> 30 && age< 60) {
            return stupid.say("Life's catching up to you eh?");
        } else if(age > 60) {
            return stupid.say("Hope you're ready!");
        }
    }
})
```
