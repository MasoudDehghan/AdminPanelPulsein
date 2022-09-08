"use strict";
var worker_class_1 = require('./worker.class');
var WorkType_class_1 = require('./WorkType.class');
var jobResource_class_1 = require('./jobResource.class');
var SubscriptionType_class_1 = require('./SubscriptionType.class');
var registerState_class_1 = require('./registerState.class');
var city_class_1 = require('./city.class');
var region_class_1 = require('./region.class');
var area_class_1 = require('./area.class');
var JobCategory1_class_1 = require('./JobCategory1.class');
var workStationScore_class_1 = require('./workStationScore.class');
var WorkStation = (function () {
    function WorkStation() {
        this.workType = new WorkType_class_1.WorkType();
        this.city = new city_class_1.City();
        this.region = new region_class_1.Region();
        this.area = new area_class_1.Area();
        this.subscriptionType = new SubscriptionType_class_1.SubscriptionType();
        this.jobCategory1 = new JobCategory1_class_1.JobCategory1();
        this.registerState = new registerState_class_1.RegisterState();
        this.workStationScore = new workStationScore_class_1.WorkStationScore();
        this.jobResource = new jobResource_class_1.JobResource();
        this.workStationPhones = [];
        this.factors = [];
        this.workStationCatalogs = [];
        this.workStationDocuments = [];
        this.workers = [];
        //This var defined for operator form
        this.worker = new worker_class_1.Worker();
    }
    return WorkStation;
}());
exports.WorkStation = WorkStation;
//# sourceMappingURL=workStation.class.js.map