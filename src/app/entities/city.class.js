"use strict";
var township_class_1 = require('./township.class');
var City = (function () {
    function City() {
        this.regions = [];
        this.type = "City";
        this.township = new township_class_1.TownShip();
    }
    return City;
}());
exports.City = City;
//# sourceMappingURL=city.class.js.map