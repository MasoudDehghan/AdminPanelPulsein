import { environment } from 'environments/environment';
import {Component} from '@angular/core'
import { SharedValues } from './../../services/shared-values.service';

@Component({
    moduleId: module.id,
    selector: 'footerComponent',
    templateUrl: './footer.template.html'
})

export class FooterComponent{
    constructor(public shared:SharedValues){}
    footerText:string = this.shared.footerText;
    version = environment.version;
}