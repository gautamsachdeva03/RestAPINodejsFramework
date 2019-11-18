let apiRequest = require('../../utils/apiRequestHelper');
let utils = require('../common/testUtils');
let prop = require('../../utils/constants');
let validator = require('../../utils/requestValidation');
let jsonSchema = require('../common/jsonSchema');
var orderId;

describe('Cancel Order Test:', function () {

    beforeEach(async function () {
        let numberOfStops = 3;
        let jsonData = await utils.generateOrderPayload(numberOfStops);
        var res = await apiRequest.postRequest(jsonData);
        orderId = res.body.id;
    });

    it('should cancel order from assigning status with valid order id', async function () {
        var res = await apiRequest.putRequest(orderId, "cancel");
        validator.putRequest(res, prop.status_canceled, jsonSchema.jsonCancelOrder);
    });

    it('should cancel order from ongoing status with valid order id', async function () {
        await apiRequest.putRequest(orderId, "take");

        var res = await apiRequest.putRequest(orderId, "cancel");
        validator.putRequest(res, prop.status_canceled, jsonSchema.jsonCancelOrder);
    });

    it('should give an error when canceling the same order that is already in completed state', async function () {
        await apiRequest.putRequest(orderId, "take");
        await apiRequest.putRequest(orderId, "complete");

        var res = await apiRequest.putRequest(orderId, "cancel");
        validator.unprocessableEntity(res, prop.error_422_statusAlreadyCompleted);
    });

    it('should give an error when passing invalid order id', async function () {
        var res = await apiRequest.putRequest(orderId + 100, "cancel");
        validator.notFound(res);
    });

});