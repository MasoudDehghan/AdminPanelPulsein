"use strict";
var Subject_1 = require("rxjs/Subject");
var CustomValidators = (function () {
    function CustomValidators() {
    }
    CustomValidators.percentFormat = function (control) {
        var q = new Promise(function (resolve, reject) {
            if (control.value >= 0 && control.value <= 100) {
                resolve(null);
            }
            else {
                resolve({ 'percentFormat': true });
            }
        });
        return q;
    };
    CustomValidators.emailFormat = function (control) {
        var pattern = /\S+@\S+\.\S+/;
        return pattern.test(control.value) ? null : { "emailFormat": true };
    };
    CustomValidators.duplicated = function (control) {
        var q = new Promise(function (resolve, reject) {
            setTimeout(function () {
                if (control.value === 'test') {
                    resolve({ 'duplicated': true });
                }
                else {
                    resolve(null);
                }
            }, 1000);
        });
        return q;
    };
    CustomValidators.duplicatedx = function (uservice) {
        return function (control) {
            var q = new Promise(function (resolve, reject) {
                if (control.value.length < 4) {
                    resolve(null);
                }
                else {
                    setTimeout(function () {
                        uservice.findSystemUser(control.value)
                            .subscribe(function (response) {
                            resolve({ 'duplicated': true });
                            console.log(response);
                        }, function (error) {
                            resolve(null);
                        });
                    }, 2000);
                }
            });
            return q;
        };
    };
    CustomValidators.uniqueNameChecker = function (usersService) {
        var changed$ = new Subject_1.Subject();
        return function (control) { return new Promise(function (resolve) {
            changed$.next();
            return control
                .valueChanges
                .debounceTime(500)
                .distinctUntilChanged()
                .takeUntil(changed$)
                .filter(function (value) { return value.length > 4; })
                .switchMap(function (value) { return usersService.findSystemUser(value); })
                .subscribe({
                next: function (data) {
                    console.log(data);
                    if (data.userName === control.value) {
                        resolve({ 'duplicated': true });
                    }
                    else {
                        resolve(null);
                    }
                },
                error: function (err) {
                    console.error(err);
                    resolve(null);
                }
            });
        }); };
    };
    CustomValidators.checkNewPassTheSame = function (group) {
        var control1 = group.get('newPassword');
        var control2 = group.get('confirmPassword');
        if (control1.value == '' || control2.value == '')
            return null;
        if (control1.value != control2.value) {
            return { theSampePasswordError: true };
        }
        return null;
    };
    return CustomValidators;
}());
exports.CustomValidators = CustomValidators;
//# sourceMappingURL=custome-validators.class.js.map