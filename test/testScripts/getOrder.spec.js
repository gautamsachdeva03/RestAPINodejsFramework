let apiRequest = require('../../utils/apiRequestHelper');
let utils = require('../common/testUtils');
let prop = require('../../utils/constants');
let validator = require('../../utils/requestValidation');
var orderId;

describe('Get Order Test:', function () {

    beforeEach(async function () {
        let numberOfStops = 3;
        let jsonData = await utils.generateOrderPayload(numberOfStops);
        var res = await apiRequest.postRequest(jsonData);
        orderId = res.body.id;
    });

    it('should fetch order status: "Assigning" ', async function () {
        var res = await apiRequest.getRequest(orderId);
        validator.getRequest(res, prop.status_assigning);
    });

    it('should fetch order status: "Ongoing" ', async function () {
        await apiRequest.putRequest(orderId, "take");

        var res = await apiRequest.getRequest(orderId);
        validator.getRequest(res, prop.status_ongoing);
    });

    it('should fetch order status: "Cancelled" ', async function () {
        await apiRequest.putRequest(orderId, "take");
        await apiRequest.putRequest(orderId, "cancel");

        var res = await apiRequest.getRequest(orderId);
        validator.getRequest(res, prop.status_canceled);
    });

    it('should fetch order status: "Completed" ', async function () {
        await apiRequest.putRequest(orderId, "take");
        await apiRequest.putRequest(orderId, "complete");

        var res = await apiRequest.getRequest(orderId);
        validator.getRequest(res, prop.status_completed);
    });

    it('should give an error when passing invalid order id', async function () {
        var res = await apiRequest.getRequest(orderId + 100);
        validator.notFound(res);
    });

});