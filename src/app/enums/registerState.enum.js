"use strict";
(function (RegisterStateEnum) {
    RegisterStateEnum[RegisterStateEnum["NotRegistered"] = 1] = "NotRegistered";
    RegisterStateEnum[RegisterStateEnum["WaitToAuthenticate"] = 2] = "WaitToAuthenticate";
    RegisterStateEnum[RegisterStateEnum["Authenticated"] = 3] = "Authenticated";
})(exports.RegisterStateEnum || (exports.RegisterStateEnum = {}));
var RegisterStateEnum = exports.RegisterStateEnum;
//# sourceMappingURL=registerState.enum.js.map