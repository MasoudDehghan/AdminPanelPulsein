import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ExcelService } from 'app/services/excel.service';
import { DataTable } from 'primeng/primeng';
import { BasicData } from '../../entities/basicData.class';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { UserRoleEnum } from './../../enums/userRole.enum';
import { FestivalInfo } from './../../pEntites/FestivalInfo.class';
import { FestivalService } from './../../services/festival.service';

@Component({
  selector: 'app-festival-mgm',
  templateUrl: './festival-mgm.component.html',
  styleUrls: ['./festival-mgm.component.css', '../../../assets/css/dashboard.css'],
  providers: [FestivalService, ExcelService]
})
export class FestivalMgmComponent implements OnInit {
  editForm: FormGroup;
  hmsgs: GrowlMessage[] = [];
  loading: boolean = false;
  activeLabel: string = this.shared.festivalMGMLabel;
  errorCntrler: HandleErrorMsg;
  winners: FestivalInfo[] = [];
  showWinnersList: boolean = false;
  winnersLength: number = 0;
  showErrorMsg: boolean = false;
  displayEditDialog: boolean = false;
  basicData: BasicData;
  loadingDialog: boolean = false;
  editCapable: boolean = false;
  @ViewChild('dt') public dataTable: DataTable;
  selectedWinner:FestivalInfo;
  selectedWinnerID: number;
  constructor(private _router: Router,
    public shared: SharedValues,
    private _fb: FormBuilder,
    private excelService: ExcelService,
    public festivalService: FestivalService) {
    this.errorCntrler = new HandleErrorMsg(_router)

  }

  ngOnInit() {
    this.basicData = JSON.parse(localStorage.getItem('basicData'));

    this.editForm = this._fb.group({
      invitationScore: ['']
    });

    let loggedInRole = Number(sessionStorage.getItem("roleId"));
    this.editCapable = false;
    if (loggedInRole == UserRoleEnum.SysAdmin)
      this.editCapable = true;
    this.rtvList();
  }


  onSubmitEditform() {
    try {
      if (!this.editForm.valid) {
        this.validateAllFormFields(this.editForm);
        return;
      }
      
      this.selectedWinner.invitationScore = this.editForm.controls['invitationScore'].value;

      let winners = [...this.winners];

      this.loading = true;
      this.festivalService.edit(this.selectedWinner).subscribe(response => {
        winners[this.findWinnerIndex(this.selectedWinner)] = this.selectedWinner;
        this.winners = winners;
        this.loading = false;
        this.displayEditDialog = false;
      }, error => {
        console.log(error);
        let err: BackendMessage = error.error;
        this.parseError(error.status, err);
        this.loading = false;
      });

    }
    catch (e) {
      console.log(e);
    }
  }

  showDialogToEdit(winner: FestivalInfo) {
    this.selectedWinnerID = winner.id;
    this.selectedWinner = {...winner};
    this.editForm.controls['invitationScore'].setValue(winner.invitationScore);
    this.displayEditDialog = true;
  }

  parseError(status: any, err: any) {
    this.errorCntrler.gMessage = [];
    this.hmsgs = [];
    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err.error);
    let errorMessages = this.errorCntrler.gMessage;
    errorMessages.forEach(element => {
      this.hmsgs.push(element);
    });
  }
  rtvList() {

    this.loading = true;
    this.festivalService.report()
      .subscribe(response => {
        console.log(response);
        this.showWinnersList = true;
        this.winners = <FestivalInfo[]>response;
        this.winnersLength = this.winners.length;
        this.loading = false;

      }
        , error => {
          console.log(error);
          this.showErrorMsg = true;
          this.showWinnersList = false;
          this.hmsgs = [];
          this.errorCntrler.gMessage = [];
          let err: BackendMessage = error.error;
          let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
          let errorMessages = this.errorCntrler.gMessage;
          this.hmsgs = errorMessages;
          this.loading = false;
        }
      );
  }
 
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {

        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });

      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  exportExcel() {
    let filtered_json = [];
    if (this.dataTable.filteredValue != undefined) {
      this.dataTable.filteredValue.forEach(winner => {
        let entity = <FestivalInfo>winner;
        filtered_json.push(entity);
      });
    }
    else {
      this.winners.forEach(dsc => {
        let entity = <FestivalInfo>dsc;
        filtered_json.push(entity);
      });
    }
    this.excelService.exportAsExcelFile(filtered_json, 'filtered_winners_json');



  }

  findWinnerIndex(winner: FestivalInfo): number {
    for (let i = 0; i < this.winners.length; i++) {
      if (winner.id == this.winners[i].id)
        return i;
    }
    return -1;
  }
}
