"use strict";
var DocumentType = (function () {
    function DocumentType() {
        this.name = "";
        //مغازه
        this.requiredForStore = false;
        //حقوقی شرکت
        this.requiredForLegal = false;
        //حقیقی
        this.requiredForReal = false;
    }
    DocumentType.prototype.DocumentType = function () {
    };
    return DocumentType;
}());
exports.DocumentType = DocumentType;
//# sourceMappingURL=DocumentType.class.js.map