import {Component,OnInit} from '@angular/core'
import { SharedValues } from '../../services/shared-values.service'

@Component({
    moduleId: module.id,
    selector: 'searchBox',
    templateUrl: './search.template.html'
})

export class SearchComponent implements OnInit{
    searchLabel = this.shared.searchLabel;
    constructor(public shared:SharedValues){

    }
    ngOnInit() {
    }
}