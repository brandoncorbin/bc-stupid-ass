module.exports = stupid => {
    return {
        triggers: [
            "what's the day",
            `what day is it`,
            `what's today`,
            `what's the date`,
        ],
        func() {
            let getOrdinalNum = n => {
                return (
                    n +
                    (n > 0 ?
                        ["th", "st", "nd", "rd"][
                            (n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10
                        ] :
                        "")
                );
            };
            let now = new Date();
            let day = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ][now.getDay()];
            let month = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ][now.getMonth()];

            let date = now.getDate() + 1;
            let year = now.getFullYear();

            return stupid.say(
                `Today is ${day} ${month} ${getOrdinalNum(date)} ${year}`
            );
        },
    };
};