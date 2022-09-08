"use strict";
var Msg_class_1 = require('../entities/Msg.class');
var glob = require('../shared/global');
var innerMsg_class_1 = require('../entities/innerMsg.class');
var innerMsgCode_enum_1 = require('../enums/innerMsgCode.enum');
var HandleErrorMsg = (function () {
    function HandleErrorMsg(_router) {
        this._router = _router;
        this.gMessage = [];
        this.errorLabel = glob.errorLabel;
    }
    HandleErrorMsg.prototype.handleError = function (error) {
        var _this = this;
        var errorMsg = new Msg_class_1.Message();
        console.log(error);
        if (error.status == 500) {
            var err = error.error;
            //SessionExpired
            if (err.code == 1) {
                alert(glob.sessionExpiredMsg);
                this._router.navigate(['/login']);
            }
            else if (err.code == 2) {
                this._router.navigate(['/login']);
            }
            else if (err.code == 4) {
                err.msg.forEach(function (element) {
                    console.log(element.code);
                    if (element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_EmptyUserName) {
                        element.msg = glob.userNameValidMsg;
                    }
                    else if (element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_InvalidUserName) {
                        element.msg = glob.userNameInvalidMsg;
                    }
                    else if (element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_RepeatedUserName) {
                        element.msg = glob.userNameDuplicatedMsg;
                    }
                    else if (element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_EmptyPassword) {
                        element.msg = glob.passValidMsg;
                    }
                    else if (element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_InvalidPassword) {
                        element.msg = glob.passwordInvalidMsg;
                    }
                    else if (element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_EmptyUserRole) {
                        element.msg = glob.roleValidMsg;
                    }
                    else if (element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_InvalidUserRole) {
                        element.msg = glob.roleInvalidMsg;
                    }
                    else if (element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_EntityNotFound) {
                        element.msg = glob.userNameNotExistedMsg;
                    }
                    else if (element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_EmptyEntityName) {
                        element.msg = glob.EmptyEntityNameMsg;
                    }
                    else if (element.code == 0 ||
                        element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_InvalidEntityName ||
                        element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_EmptyParent ||
                        element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_InvalidParent ||
                        element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_ParentNotFound) {
                        element.msg = glob.InvalidEntityNameMsg;
                    }
                    else if (element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_RepeatedEntityName) {
                        element.msg = glob.RepeatedEntityNameMsg;
                    }
                    else if (element.code == innerMsgCode_enum_1.InnerMsgCodeEnum.InnerCode_EntityHaveChild) {
                        element.msg = glob.EntityHaveChildMsg;
                    }
                    errorMsg.msg.push(element);
                    _this.gMessage.push({ severity: 'error', summary: _this.errorLabel, detail: element.msg });
                });
            }
        }
        else if (error.status == 400) {
            var message = new innerMsg_class_1.InnerMessage();
            message.msg = glob.badRequestMsg;
            errorMsg.msg.push(message);
            this.gMessage.push({ severity: 'error', summary: this.errorLabel, detail: message.msg });
        }
        else {
            var message = new innerMsg_class_1.InnerMessage();
            message.msg = glob.unableToConnectBackEnd;
            errorMsg.msg.push(message);
            this.gMessage.push({ severity: 'error', summary: this.errorLabel, detail: message.msg });
        }
        return errorMsg;
    };
    return HandleErrorMsg;
}());
exports.HandleErrorMsg = HandleErrorMsg;
//# sourceMappingURL=handleError.class.js.map