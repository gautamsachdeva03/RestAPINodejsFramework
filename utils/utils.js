let moment = require('moment');
let rn = require('random-number');

module.exports = {

    generateRandomIntegerWithRange: function generateRandomIntegerWithRange(minRange, maxRange) {
        var gen = rn.generator({
            min: minRange , max: maxRange, integer: true
        });
        return gen();
    },

    formatDateTime: function formatDateTime(status, timeSlot) {
        var timeZone;
        switch (status) {
            case "future":
                timeZone = moment().add(2, 'years').utc().format();
                if (timeSlot === "night") {
                    timeZone = moment(timeZone).utc().set('hour', this.generateRandomIntegerWithRange(22, 24)).format();
                }
                else if ((timeSlot === "day")) {
                    timeZone = moment(timeZone).utc().set('hour', this.generateRandomIntegerWithRange(6, 21)).format();
                }
                else {
                    timeZone = moment(timeZone).utc().set('hour', this.generateRandomIntegerWithRange(6, 21)).format();
                }
                //console.log(timeZone);
                break;
            case "past":
                timeZone = moment().subtract(5, 'years').utc().format();
                break;
            default:
                timeZone = moment().utc().format();
                break;
        }
        return timeZone;
    }
    
}