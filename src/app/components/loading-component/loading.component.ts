import { Component, Input } from '@angular/core'
import { SharedValues } from '../../services/shared-values.service'


@Component({
    moduleId: module.id,
    selector: 'loadingCmp',
    template: `
            <div *ngIf="loading" [class]="spinnerStyleClass">
                <h3 *ngIf="iconSize==4">{{waitMsg}}</h3>
                  <h6 *ngIf="iconSize==2">{{waitMsg}}</h6>
                <i class="fa fa-spinner fa-spin fa-{{iconSize}}x"></i>
            </div>
    `
})

export class LoadingComponent {
    @Input() loading: boolean;
    @Input() spinnerStyleClass:string = "spinnerClass";
    @Input() iconSize:number=4;
    waitMsg = this.shared.waitMsg;
    constructor(public shared:SharedValues){

    }
}