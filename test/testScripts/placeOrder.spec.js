let apiRequest = require('../../utils/apiRequestHelper');
let testUtils = require('../common/testUtils');
let utils = require('../../utils/utils');
let prop = require('../../utils/constants');
let validator = require('../../utils/requestValidation');
let mochaEach = require('mocha-each');

describe('Place Order Test:', function () {

    mochaEach(prop.validStops).
    it('should place a new order with stops = %s', async function (stops) {
        let numberOfStops = stops;
        let jsonData = await testUtils.generateOrderPayload(numberOfStops);
        var res = await apiRequest.postRequest(jsonData);

        //calculate fare as per stops
        var expectedFare = testUtils.calculateFare(res.body.drivingDistancesInMeters);

        validator.postRequest(res, expectedFare);
    });

    it('should place a new order containing two stops with future date', async function () {
        let numberOfStops = 2;
        let timeZone = utils.formatDateTime("future", "day");
        let jsonData = await testUtils.generateOrderPayload(numberOfStops, timeZone);
        var res = await apiRequest.postRequest(jsonData);

        //calculate fare as per stops
        var expectedFare = testUtils.calculateFare(res.body.drivingDistancesInMeters, timeZone);

        validator.postRequest(res, expectedFare);
    });

    it('should place a new order containing three stops with future date and late night', async function () {
        let numberOfStops = 3;
        let timeZone = utils.formatDateTime("future", "night");
        let jsonData = await testUtils.generateOrderPayload(numberOfStops, timeZone);
        var res = await apiRequest.postRequest(jsonData);
        
        //calculate fare as per stops
        var expectedFare = testUtils.calculateFare(res.body.drivingDistancesInMeters, timeZone);

        validator.postRequest(res, expectedFare);
    });

    it('should place a new order containing four stops with future date and late night', async function () {
        let numberOfStops = 4;
        let timeZone = utils.formatDateTime("future", "night");
        let jsonData = await testUtils.generateOrderPayload(numberOfStops, timeZone);
        var res = await apiRequest.postRequest(jsonData);
        
        //calculate fare as per stops
        var expectedFare = testUtils.calculateFare(res.body.drivingDistancesInMeters, timeZone);

        validator.postRequest(res, expectedFare);
    });

    it('should not place an order and give error if payload contains only one stop', async function () {
        let numberOfStops = 1;
        let jsonData = await testUtils.generateOrderPayload(numberOfStops);
        var res = await apiRequest.postRequest(jsonData);

        validator.badRequest(res, prop.error_400_errorInStopsField);
    });

    it('should not place an order and give error for past date', async function () {
        let numberOfStops = 3;
        let jsonData = await testUtils.generateOrderPayload(numberOfStops, utils.formatDateTime("past"));
        var res = await apiRequest.postRequest(jsonData);

        validator.badRequest(res, prop.error_400_pastOrder);
    });

    it('should not place an order and give error for invalid lat/lng', async function () {
        let numberOfStops = 3;
        let jsonData = await testUtils.generateInvalidOrderPayload(numberOfStops);
        var res = await apiRequest.postRequest(jsonData);

        validator.serviceUnavailable(res);
    });

});