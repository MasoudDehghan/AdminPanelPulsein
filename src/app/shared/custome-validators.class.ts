
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject, ReplaySubject, from, of, range,forkJoin } from 'rxjs';
import { UsersService } from '../services/users.service'
import { WorkerStationMgmService } from '../services/workerStationMgm.service'
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/switchMap";
interface IValidation {
    [key: string]: boolean;
}

export class CustomValidators {

    static percentFormat(control: FormControl) {

        const q = new Promise<IValidation>((resolve, reject) => {
            if (control.value >= 0 && control.value <= 100) {
                resolve(null);
            }
            else {
                resolve({ 'percentFormat': true });
            }


        });
        return q;
        //return null;

    }

    static emailFormat(control: FormControl): IValidation {
        let pattern: RegExp = /\S+@\S+\.\S+/;
        return pattern.test(control.value) ? null : { "emailFormat": true };
    }

    static duplicated(control: FormControl) {

        const q = new Promise<IValidation>((resolve, reject) => {
            setTimeout(() => {
                if (control.value === 'test') {
                    resolve({ 'duplicated': true });
                } else {
                    resolve(null);
                }
            }, 1000);



        });
        return q;
        //return null;
    }

    static duplicatedx(uservice: UsersService) {

        return (control: FormControl) => {

            const q = new Promise<IValidation>((resolve, reject) => {
                if (control.value.length < 4) {
                    resolve(null);

                }
                else {
                    setTimeout(() => {
                        uservice.findSystemUser(control.value)
                            .subscribe(response => {
                                resolve({ 'duplicated': true });
                                console.log(response);
                            }, error => {
                                resolve(null);
                            })
                    }, 2000);
                }


            });
            return q;
        }
        
        //return null;

    }

    static uniqueNameChecker(usersService: UsersService) {
       let changed$ = new Subject<any>();
        return (control: FormControl) => new Promise((resolve) => {
            changed$.next();
            return control
                .valueChanges
                .debounceTime(500)
                .distinctUntilChanged()
                .takeUntil(changed$)
                .filter(value => value.length > 4)
                .switchMap(value => usersService.findSystemUser(value))
                .subscribe({
                    next: (data: any) => {
                        console.log(data);
                        if (data.userName === control.value) {
                            resolve({ 'duplicated': true });
                        } else {

                            resolve(null);
                        }



                    },
                    error: (err) => {
                        console.error(err);
                        resolve(null);
                    }
                });
        });
        //return null;
    }

    static uniqueUserNameChecker(usersService: UsersService, newUser: boolean) {
        let changed$ = new Subject<any>();
        return (control: FormControl) => new Promise((resolve) => {
            changed$.next();
            return control
                .valueChanges
                .debounceTime(500)
                .distinctUntilChanged()
                .takeUntil(changed$)
                .filter(value => value.length > 4)
                .switchMap(value => usersService.findSystemUser(value))
                .subscribe({
                    next: (data: any) => {
                        if(!newUser)
                            resolve(null);
                        else if (data.userName === control.value) {
                            resolve({ 'duplicated': true });
                        }                         
                        else {
                            resolve(null);
                        }
                    },
                    error: (err) => {
                        resolve(null);
                    }
                });
        });
        //return null;
    }

    static uniqueWorkStationTitleChecker(ws: WorkerStationMgmService) {
       let changed$ = new Subject<any>();
        return (control: FormControl) => new Promise((resolve) => {
            changed$.next();
            if(control.value.length <= 4)
                resolve(null);
            return control
                .valueChanges
                .debounceTime(1000)
                .distinctUntilChanged()
                .takeUntil(changed$)
                .filter(value => value.length > 4)
                .switchMap(value => ws.lookupByTitle(value))
                .subscribe({
                    next: (data: any) => {
                        //console.log(data);
                        // if (data.userName === control.value) {
                        //     resolve({ 'duplicated': true });
                        // } else {
                        if (data.length > 0)
                            resolve({ 'duplicated': true });
                        resolve(null);

                        //}
                    },
                    error: (err) => {
                        //console.error(err);
                        console.log("2:"+err);
                        resolve(null);
                    }
                });
        });
       //  return null;
    }

    static checkNewPassTheSame(group: FormGroup) {

        var control1 = group.get('newPassword');
        var control2 = group.get('confirmPassword');
        if (control1.value == '' || control2.value == '')
            return null;
        if (control1.value != control2.value) {
            return { theSampePasswordError: true };
        }
        return null;

    }


}