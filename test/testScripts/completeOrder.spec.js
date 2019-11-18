let apiRequest = require('../../utils/apiRequestHelper');
let utils = require('../common/testUtils');
let prop = require('../../utils/constants');
let validator = require('../../utils/requestValidation');
let jsonSchema = require('../common/jsonSchema');
var orderId;

describe('Complete Order Test:', function () {

    beforeEach(async function () {
        let numberOfStops = 3;
        let jsonData = await utils.generateOrderPayload(numberOfStops);
        var res = await apiRequest.postRequest(jsonData);
        orderId = res.body.id;
    });

    it('should complete the order from ongoing status with vaild order id', async function () {
        await apiRequest.putRequest(orderId, "take");
        var res = await apiRequest.putRequest(orderId, "complete");
        validator.putRequest(res, prop.status_completed, jsonSchema.jsonCompleteOrder);
    });

    it('should give an error when status is not on going, current status: Assigning', async function () {
        var res = await apiRequest.putRequest(orderId, "complete");
        validator.unprocessableEntity(res, prop.error_422_statusNotOnGoing);
    });

    it('should give an error when status is not on going, current status: Cancelled', async function () {
        await apiRequest.putRequest(orderId, "cancel");
        var res = await apiRequest.putRequest(orderId, "complete");
        validator.unprocessableEntity(res, prop.error_422_statusNotOnGoing);
    });

    it('should give an error when status is not on going, current status: Completed', async function () {
        await apiRequest.putRequest(orderId, "take");
        await apiRequest.putRequest(orderId, "complete");
        var res = await apiRequest.putRequest(orderId, "complete");
        validator.unprocessableEntity(res, prop.error_422_statusNotOnGoing);
    });

    it('should give an error when passing invalid order id', async function () {
        var res = await apiRequest.putRequest(orderId + 100, "complete");
        validator.notFound(res);
    });

});