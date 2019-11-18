let superagent = require("superagent");
let prop = require('./constants');
let baseURL = prop.baseURL;

module.exports = {

    postRequest: async function postRequest(jsonData) {
        var res = await superagent.post(baseURL).set('Content-Type', 'application/json').send(jsonData).ok(() => true);
        return res;
    },

    getRequest: async function getRequest(orderId) {
        var res = await superagent.get(baseURL + "/" + orderId).set('Content-Type', 'application/json').ok(() => true);
        return res;
    },

    putRequest: async function putRequest(orderId, endPoint) {
        var res = await superagent.put(baseURL + "/" + orderId + "/" + endPoint).set('Content-Type', 'application/json').ok(() => true);
        return res;
    }

}