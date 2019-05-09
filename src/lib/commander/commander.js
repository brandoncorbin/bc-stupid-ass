class Command {
    constructor(base) {
        base = base || {};
        this.triggers = base.triggers || [];
        this.func = base.func || function() {};
    }
}

class Commander {
    constructor(options) {
        options = options || {};
        this.stage = "root";
        this.commands = { root: [] }; // start with just a root command stage
        this.Command = Command;
    }

    load(name, commands) {
        if (commands.length) {
            this.commands[name] = commands || [];
        }
    }

    /**
     * Add a Command to the active stage
     * @param {Command} command
     */
    addCommand(command) {
        if (command instanceof Command) {
            this.commands[this.stage].push(command);
        } else {
            this.commands[this.stage].push(new Command(command));
        }
        return this;
    }

    addCommands(commands) {
        this.commands[this.stage] = [...commands, ...this.commands[this.stage]];
    }

    /**
     * Goto a Stage by name
     * @param {String} stage
     */
    goto(stage) {
        if (this.commands[stage]) {
            this.stage = stage;
        } else {
            this.stage = "root";
        }
        return this;
    }

    /**
     * Fire a command by the string
     * @param {String | Array} commandText
     */
    fire(providedCommand) {
        let found = null;
        let payload = {
            input: providedCommand,
            command: null,
            match: null,
        };
        let providedCommands = [];

        // Was a string or Array of Strings passed?
        if (typeof providedCommand === "string") {
            providedCommands = [providedCommand];
        } else {
            providedCommands = providedCommand;
        }
        console.log("Firing", this.commands[this.stage]);
        // Loop over the commands for the active stage.
        this.commands[this.stage].forEach(command => {
            // Loop over each provided command
            // Some recognition services return an array of options
            // So we will just always make it an array - even if
            // it's just a single one.
            providedCommands.forEach(commandText => {
                commandText = commandText.trim().toLowerCase();
                // Loop over triggers for this command
                command.triggers.forEach(triggerText => {
                    // Setup regex to look for command
                    let regex = new RegExp(triggerText, "i");
                    let match = commandText.match(regex);

                    // Did we find a match?
                    if (match && !found) {
                        found = command;
                        payload.command = commandText;
                        // Turn matches (only the strings) into an array;
                        payload.match = match
                            .filter(match => typeof match === "string")
                            .map(match => match.trim());

                        // What was heard
                        payload.heard = payload.match[0];

                        // Remove first if it's greater than 1
                        if (payload.match.length > 1) {
                            payload.match.shift();
                        }
                        // Pass the command back
                    }
                });
            }); // end looping over providedCommands
        });

        // Did we find a command man?
        if (found) {
            return found.func(payload);
        } else {
            // No, let's pass back the payload.
            return false;
        }
    }
}

module.exports = Commander;