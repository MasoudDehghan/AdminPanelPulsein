import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JobCategory1 } from '../../entities/JobCategory1.class';
import { SharedValues } from '../../services/shared-values.service';

@Component({
    moduleId: module.id,
    selector: 'adminPanel',
    templateUrl: './adminDashboard.template.html',
    styles: [`
        .uipStyle{
            background: url('/assets/images/light_wool.png') repeat;
            padding: 12px;
            border-radius:4px;
                box-shadow: 6px 6px 2px #888888;
        }
        .uipStyle:hover{
            background: url('/assets/images/light_wool_hover.png') repeat;
            cursor:pointer;
        }
  `]
})

export class AdminPanelComponent implements OnInit {
    @Input() jobCategory1: JobCategory1;
    @Input() headerLabel: string;
    @Input() imagePath: string;
    @Input() totalRegisteredCounter: number;
    @Input() totalRequestsCounter: number;
    @Output() onFilterJobCategory1 = new EventEmitter<JobCategory1>();
    totalRegisteredLabel: string = this.shared.totalRegisteredLabel;
    totalRequestedLabel: string = this.shared.totalRequestedLabel;
    constructor(public shared:SharedValues){

    }
    ngOnInit() {
    }
    filterByJC1() {
        this.onFilterJobCategory1.emit(this.jobCategory1);
    }
}