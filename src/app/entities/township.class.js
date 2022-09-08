"use strict";
var province_class_1 = require('./province.class');
var TownShip = (function () {
    function TownShip() {
        this.cities = [];
        this.type = "TownShip";
        this.province = new province_class_1.Province();
    }
    return TownShip;
}());
exports.TownShip = TownShip;
//# sourceMappingURL=township.class.js.map