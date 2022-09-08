"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var activateViaAuthGuard_component_1 = require('./authentication/activateViaAuthGuard.component');
var login_component_1 = require('./components/login.component');
var home_component_1 = require('./components/home.component');
var users_component_1 = require('./components/users.component');
var geo_component_1 = require('./components/geo.component');
var jobCategory_component_1 = require('./components/jobCategory.component');
var docTypes_component_1 = require('./components/docTypes.component');
var workTypes_component_1 = require('./components/workTypes.component');
var subscribtionTypes_component_1 = require('./components/subscribtionTypes.component');
var workerStationMgm_component_1 = require('./components/workerStationMgm.component');
var routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: login_component_1.LoginComponent
    },
    {
        path: 'home',
        component: home_component_1.HomeComponent,
        canActivate: [activateViaAuthGuard_component_1.CanActivateViaAuthGuard]
    },
    {
        path: 'usersMgm',
        component: users_component_1.UsersMgmComponent,
        canActivate: [activateViaAuthGuard_component_1.CanActivateViaAuthGuard]
    },
    {
        path: 'geoComponent',
        component: geo_component_1.GeoComponent,
        canActivate: [activateViaAuthGuard_component_1.CanActivateViaAuthGuard]
    },
    {
        path: 'jobCategory',
        component: jobCategory_component_1.JobCategoryComponent,
        canActivate: [activateViaAuthGuard_component_1.CanActivateViaAuthGuard]
    },
    {
        path: 'docTypeMgm',
        component: docTypes_component_1.DocumentTypeMgmComponent,
        canActivate: [activateViaAuthGuard_component_1.CanActivateViaAuthGuard]
    },
    {
        path: 'workTypeMgm',
        component: workTypes_component_1.WorkTypeMgmComponent,
        canActivate: [activateViaAuthGuard_component_1.CanActivateViaAuthGuard]
    },
    {
        path: 'subTypeMgm',
        component: subscribtionTypes_component_1.SubscribtionTypeMgmComponent,
        canActivate: [activateViaAuthGuard_component_1.CanActivateViaAuthGuard]
    },
    {
        path: 'workerStationMgmComponent',
        component: workerStationMgm_component_1.WorkerStationMgmComponent,
        canActivate: [activateViaAuthGuard_component_1.CanActivateViaAuthGuard]
    }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        }), 
        __metadata('design:paramtypes', [])
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
exports.routedComponents = [login_component_1.LoginComponent, home_component_1.HomeComponent, users_component_1.UsersMgmComponent, geo_component_1.GeoComponent,
    docTypes_component_1.DocumentTypeMgmComponent, workTypes_component_1.WorkTypeMgmComponent, subscribtionTypes_component_1.SubscribtionTypeMgmComponent,
    jobCategory_component_1.JobCategoryComponent, workerStationMgm_component_1.WorkerStationMgmComponent];
//# sourceMappingURL=app-routing.module.js.map