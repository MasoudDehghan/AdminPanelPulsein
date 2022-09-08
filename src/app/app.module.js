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
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
require('./rxjs-extensions');
var app_component_1 = require('./app.component');
var primeng_1 = require('primeng/primeng');
var primeng_2 = require('primeng/primeng');
var primeng_3 = require('primeng/primeng');
var primeng_4 = require('primeng/primeng');
var primeng_5 = require('primeng/primeng');
var primeng_6 = require('primeng/primeng');
var primeng_7 = require('primeng/primeng');
var primeng_8 = require('primeng/primeng');
var primeng_9 = require('primeng/primeng');
var primeng_10 = require('primeng/primeng');
var primeng_11 = require('primeng/primeng');
var primeng_12 = require('primeng/primeng');
var primeng_13 = require('primeng/primeng');
var primeng_14 = require('primeng/primeng');
var primeng_15 = require('primeng/primeng');
var primeng_16 = require('primeng/primeng');
var primeng_17 = require('primeng/primeng');
var primeng_18 = require('primeng/primeng');
var primeng_19 = require('primeng/primeng');
var primeng_20 = require('primeng/primeng');
var primeng_21 = require('primeng/primeng');
var core_2 = require('angular2-google-maps/core');
var app_routing_module_1 = require('./app-routing.module');
var home_component_1 = require('./components/home.component');
var header_component_1 = require('./components/header.component');
var footer_component_1 = require('./components/footer.component');
var loading_component_1 = require('./components/loading.component');
var sideBarMenu_component_1 = require('./components/sideBarMenu.component');
var adminDashboard_component_1 = require('./components/adminDashboard.component');
var search_component_1 = require('./components/search.component');
var users_component_1 = require('./components/users.component');
var login_component_1 = require('./components/login.component');
var geo_component_1 = require('./components/geo.component');
var jobCategory_component_1 = require('./components/jobCategory.component');
var docTypes_component_1 = require('./components/docTypes.component');
var workTypes_component_1 = require('./components/workTypes.component');
var subscribtionTypes_component_1 = require('./components/subscribtionTypes.component');
var workerStationMgm_component_1 = require('./components/workerStationMgm.component');
var activateViaAuthGuard_component_1 = require('./authentication/activateViaAuthGuard.component');
var auth_service_1 = require('./services/auth.service');
var users_service_1 = require('./services/users.service');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule,
                primeng_1.AutoCompleteModule,
                primeng_21.RadioButtonModule,
                primeng_2.InputTextareaModule,
                primeng_4.InputTextModule,
                primeng_4.ToolbarModule,
                primeng_5.ButtonModule,
                primeng_6.PanelModule,
                primeng_3.CalendarModule,
                primeng_15.TreeModule,
                primeng_7.PanelMenuModule,
                primeng_8.DataTableModule, primeng_8.SharedModule,
                primeng_10.DropdownModule,
                primeng_11.ListboxModule,
                primeng_9.DialogModule,
                primeng_16.DataGridModule,
                primeng_13.GrowlModule,
                primeng_18.CheckboxModule,
                primeng_17.FileUploadModule,
                primeng_14.MessagesModule,
                primeng_12.ConfirmDialogModule,
                primeng_19.TooltipModule,
                primeng_20.SliderModule,
                app_routing_module_1.AppRoutingModule,
                forms_1.FormsModule,
                core_2.AgmCoreModule.forRoot({
                    apiKey: 'AIzaSyCFCFQ8IcM_pED6bVVbxKSUbfYOcQ8_a54', libraries: ["places"]
                }),
                forms_1.ReactiveFormsModule,
                http_1.HttpModule,
                app_routing_module_1.AppRoutingModule],
            declarations: [app_component_1.AppComponent, loading_component_1.LoadingComponent, sideBarMenu_component_1.SideBarMenuComponent,
                adminDashboard_component_1.AdminPanelComponent, login_component_1.LoginComponent, home_component_1.HomeComponent, users_component_1.UsersMgmComponent,
                header_component_1.HeaderComponent, footer_component_1.FooterComponent, search_component_1.SearchComponent, geo_component_1.GeoComponent,
                jobCategory_component_1.JobCategoryComponent, docTypes_component_1.DocumentTypeMgmComponent, workTypes_component_1.WorkTypeMgmComponent,
                subscribtionTypes_component_1.SubscribtionTypeMgmComponent, workerStationMgm_component_1.WorkerStationMgmComponent],
            providers: [auth_service_1.AuthService, activateViaAuthGuard_component_1.CanActivateViaAuthGuard, users_service_1.UsersService, primeng_12.ConfirmationService],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map