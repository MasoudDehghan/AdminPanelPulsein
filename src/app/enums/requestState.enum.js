"use strict";
(function (RequestStateEnum) {
    RequestStateEnum[RequestStateEnum["initialRegister"] = 1] = "initialRegister";
    RequestStateEnum[RequestStateEnum["waitToOffer"] = 2] = "waitToOffer";
    RequestStateEnum[RequestStateEnum["offerTimeEnded"] = 3] = "offerTimeEnded";
    RequestStateEnum[RequestStateEnum["waitToPoll"] = 4] = "waitToPoll";
    RequestStateEnum[RequestStateEnum["waitToPollOfServiceProviders"] = 5] = "waitToPollOfServiceProviders";
    RequestStateEnum[RequestStateEnum["successfull"] = 6] = "successfull";
    RequestStateEnum[RequestStateEnum["failed"] = 7] = "failed";
    RequestStateEnum[RequestStateEnum["notFinished"] = 8] = "notFinished";
})(exports.RequestStateEnum || (exports.RequestStateEnum = {}));
var RequestStateEnum = exports.RequestStateEnum;
//# sourceMappingURL=requestState.enum.js.map