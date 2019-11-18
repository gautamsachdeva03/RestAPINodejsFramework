let path = require('path');
let csvToJson = require('convert-csv-to-json');
let utils = require('../../utils/utils');
let json = csvToJson.formatValueByType().getJsonFromCsv(path.resolve(__dirname, 'payload.csv'));
let moment = require('moment');
let prop = require('../../utils/constants');
let math = require('mathjs');

module.exports = {

    generateOrderPayload: function generateOrderPayload(totalStops, orderTime) {
        let obj = {};
        let stops = [];

        if (orderTime) {
            obj.orderAt = orderTime;
        }

        for (let i = 0; i < totalStops; i++) {
            stops.push(json[i]);
        }
        obj.stops = stops;
        return JSON.stringify(obj);
    },

    generateInvalidOrderPayload: function generateInvalidOrderPayload(totalStops) {
        let obj = {};
        let stops = [];
        for (let i = 0; i < totalStops; i++) {
            stops.push({
                "lat": utils.generateRandomIntegerWithRange(22, 240),
                "lng": utils.generateRandomIntegerWithRange(1000, 1500)
            });
        }
        obj.stops = stops;
        return JSON.stringify(obj);
    },

    calculateFare: function calculateFare(distance, timeZone) {
        let totalDistanceMeters = 0;
        let totalFare = 0;
        let extraFare = 0;
        let baseDistanceMeters = prop.baseDistanceMeters;
        let metersDividend = prop.metersDividend;
        let baseFare;
        let priceMultiplier;
        var currentHour = moment(timeZone).utc().get('hours');

        if (currentHour >= 22 || currentHour <= 5) {
            baseFare = prop.baseFareLateNight;
            priceMultiplier = prop.priceMultiplierLateNight;
        }
        else {
            baseFare = prop.baseFare;
            priceMultiplier = prop.priceMultiplier;
        }

        distance.forEach(element => {
            totalDistanceMeters = totalDistanceMeters + element;
        });

        if (totalDistanceMeters > 0) {
            if (totalDistanceMeters >= baseDistanceMeters) {
                let remainingDistance = totalDistanceMeters - baseDistanceMeters;
                extraFare = (remainingDistance / metersDividend) * priceMultiplier;
            }
        }

        totalFare = baseFare + extraFare;

        return math.round(totalFare, 2);
    }
}