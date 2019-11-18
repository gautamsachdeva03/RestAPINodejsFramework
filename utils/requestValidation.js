let chai = require("chai")
let expect = chai.expect;
chai.use(require('chai-json-schema'));
let prop = require('./constants');
let jsonSchema = require('./../test/common/jsonSchema');

module.exports = {

    postRequest: function postRequest(res, expectedFare) {
        //verify status code 
        expect(res.status).to.equal(201);
        //verify json schema            
        expect(res.body).to.be.jsonSchema(jsonSchema.jsonPlaceOrder);
        //Verifying the fare amount
        expect(expectedFare).to.equal(Number(res.body.fare.amount));
        //verify currency unit
        expect(prop.currencyUnit).to.equal(res.body.fare.currency);
    },

    getRequest: function getRequest(res, message) {
        //verification for status code
        expect(res.status).to.equal(200);
        //verification for json schema from response body
        expect(res.body).to.be.jsonSchema(jsonSchema.jsonAssignOrder);
        //verification for response message
        expect(res.body.status).to.equal(message);
    },

    putRequest: function putRequest(res, message, jsonSchema) {
        //verification for status code
        expect(res.status).to.equal(200);
        //verification for json schema from response body
        expect(res.body).to.be.jsonSchema(jsonSchema);
        //verification for response message
        expect(res.body.status).to.equal(message);
    },

    badRequest: function badRequest(res, message) {
        //verification for status code
        expect(res.status).to.equal(400);
        //verification for json schema from response body
        expect(res.body).to.be.jsonSchema(jsonSchema.jsonInvalid);
        //verification for response message
        expect(res.body.message).to.equal(message);
    },

    unprocessableEntity: function unprocessableEntity(res, message) {
        //verification for status code
        expect(res.status).to.equal(422);
        //verification for json schema from response body
        expect(res.body).to.be.jsonSchema(jsonSchema.jsonInvalid);
        //verification for response message
        expect(res.body.message).to.equal(message);
    },

    notFound: function notFound(res) {
        //verification for status code
        expect(res.status).to.equal(404);
        //verification for json schema from response body
        expect(res.body).to.be.jsonSchema(jsonSchema.jsonInvalid);
        //verification for response message
        expect(res.body.message).to.equal(prop.error_404_orderNotFound);
    },

    serviceUnavailable: function serviceUnavailable(res) {
        //verification for status code
        expect(res.status).to.equal(503);
        //verification for json schema from response body
        expect(res.body).to.be.jsonSchema(jsonSchema.jsonInvalid);
        //verification for response message
        expect(res.body.message).to.equal(prop.error_503_serviceUnavailable);
    },

}