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
var auth_service_1 = require('../services/auth.service');
var CanActivateViaAuthGuard = (function () {
    function CanActivateViaAuthGuard(authService, _router, _activatedRouter) {
        this.authService = authService;
        this._router = _router;
        this._activatedRouter = _activatedRouter;
    }
    CanActivateViaAuthGuard.prototype.canActivate = function () {
        var authorized = this.authService.isLoggedIn();
        if (!authorized) {
            this._router.navigate(['/login']);
        }
        return this.authService.isLoggedIn();
    };
    CanActivateViaAuthGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, router_1.Router, router_1.ActivatedRoute])
    ], CanActivateViaAuthGuard);
    return CanActivateViaAuthGuard;
}());
exports.CanActivateViaAuthGuard = CanActivateViaAuthGuard;
//# sourceMappingURL=activateViaAuthGuard.component.js.map