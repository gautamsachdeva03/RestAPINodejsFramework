let apiRequest = require('../../utils/apiRequestHelper');
let utils = require('../common/testUtils');
let prop = require('../../utils/constants');
let validator = require('../../utils/requestValidation');
let jsonSchema = require('../common/jsonSchema');
var orderId;

describe('Take Order Test:', function () {

    beforeEach(async function () {
        let numberOfStops = 3;
        let jsonData = await utils.generateOrderPayload(numberOfStops);
        var res = await apiRequest.postRequest(jsonData);
        orderId = res.body.id;
    });

    it('should take order with valid id', async function () {
        var res = await apiRequest.putRequest(orderId, "take");
        validator.putRequest(res, prop.status_ongoing, jsonSchema.jsonTakeOrder);
    });

    it('should not take order that is already in ongoing status', async function () {
        await apiRequest.putRequest(orderId, "take");
        var res = await apiRequest.putRequest(orderId, "take");
        validator.unprocessableEntity(res, prop.error_422_statusNotOnAssigning);
    });

    it('should not take order that is already in completed status', async function () {
        await apiRequest.putRequest(orderId, "take");
        await apiRequest.putRequest(orderId, "complete");

        var res = await apiRequest.putRequest(orderId, "take");
        validator.unprocessableEntity(res, prop.error_422_statusNotOnAssigning);
    });

    it('should not take order that is already in cancelled status', async function () {
        await apiRequest.putRequest(orderId, "take");
        await apiRequest.putRequest(orderId, "cancel");

        var res = await apiRequest.putRequest(orderId, "take");
        validator.unprocessableEntity(res, prop.error_422_statusNotOnAssigning);
    });

    it('should give an error when passing invalid order id', async function () {
        var res = await apiRequest.putRequest(orderId + 100, "take");
        validator.notFound(res);
    });

});