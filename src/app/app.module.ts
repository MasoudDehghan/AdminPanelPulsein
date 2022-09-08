import { ValueAddredReportComponent } from './components/valueAdded-report/valueAddred-report.component';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HighchartsChartModule } from 'highcharts-angular';
import { DpDatePickerModule } from 'ng2-jalali-date-picker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AccordionModule, ButtonModule, CardModule, CheckboxModule, ChipsModule, ConfirmationService, ConfirmDialogModule, DataGridModule, DataTableModule, DialogModule, DropdownModule, FieldsetModule, FileUploadModule, GrowlModule, InputSwitchModule, InputTextareaModule, InputTextModule, KeyFilterModule, ListboxModule, MenuModule, MultiSelectModule, PanelMenuModule, PanelModule, RadioButtonModule, RatingModule, SelectButtonModule, SharedModule, SlideMenuModule, SliderModule, SpinnerModule, TabViewModule, ToolbarModule, TooltipModule, TreeModule, TreeTableModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanActivateViaAuthGuard } from './authentication/activateViaAuthGuard.component';
import { WFinancialFilterComponent } from './components//wfinancial-filter/wfinancial-filter.component';
import { WFinancialMgmComponent } from './components//wfinancial-mgm/wfinancial-mgm.component';
import { AddWorkerComponent } from './components/addWorker.component';
import { AdminPanelComponent } from './components/adminPanel-component/adminDashboard.component';
import { AFinancialMgmComponent } from './components/afinancial-mgm/afinancial-mgm.component';
import { AppVersionMgmComponent } from './components/app-version-mgm/app-version-mgm.component';
import { CartableDashboardComponent } from './components/cartable-dashboard/cartable-dashboard.component';
import { CartableExpiredRequstComponent } from './components/cartable-reqex-mgm/cartable-reqx.component';
import { CartableWorkerComponent } from './components/cartable-wr-mgm/cartable-wr.component';
import { CartableWorkerWait4DocComponent } from './components/cartable-wr-w4doc/cartable-wr-w4doc.component';
import { CartableWorkerWait4FinalComponent } from './components/cartable-wr-w4final/cartable-wr-w4final.component';
import { CartableWorkerWait4InitComponent } from './components/cartable-wr-w4init/cartable-wr-w4init.component';
import { CartableWorkerWait4PreFinalComponent } from './components/cartable-wr-w4prefinal/cartable-wr-w4prefinal.component';
import { CartableWorkStationComponent } from './components/cartable-ws-mgm/cartable-ws.component';
import { CartableWorkStationWait4DocComponent } from './components/cartable-ws-w4doc/cartable-ws-w4doc.component';
import { CartableWorkStationWait4FinalComponent } from './components/cartable-ws-w4final/cartable-ws-w4final.component';
import { CartableWorkStationWait4InitComponent } from './components/cartable-ws-w4init/cartable-ws-w4init.component';
import { CFinancialFilterComponent } from './components/cfinancial-filter/cfinancial-filter.component';
import { CFinancialMgmComponent } from './components/cfinancial-mgm/cfinancial-mgm.component';
import { ClientUsersMgmComponent } from './components/client-users-mgm/client-users.component';
import { DiscountCodeMgmComponent } from './components/discount-code-mgm/discount-code-mgm.component';
import { DiscountFilterComponent } from './components/discount-filter/discount-filter.component';
import { DiscountViewComponent } from './components/discount-view/discount-view.component';
import { DocumentTypeMgmComponent } from './components/docType-mgm/docTypes.component';
import { EditWorkerComponent } from './components/editWorker.component';
import { FestivalMgmComponent } from './components/festival-mgm/festival-mgm.component';
import { FooterComponent } from './components/footer/footer.component';
import { GeoComponent } from './components/geo-mgm//geo.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home-component/home.component';
import { JobCategoryComponent } from './components/jobCategory-component/jobCategory.component';
import { JobGeoReportComponent } from './components/jobGeoReport-component/jobGeoReport.component';
import { LoadingComponent } from './components/loading-component/loading.component';
import { LoginComponent } from './components/login.component';
import { NotificationReportComponent } from './components/notification-report/notification-report.component';
import { PrintLayoutComponent } from './components/print-layout/print-layout.component';
import { RequestDashboardComponent } from './components/request-dashboard/request-dashboard.component';
import { RequestFilterComponent } from './components/request-filter/request-filter.component';
import { RequestFinishedDashboardComponent } from './components/request-finished-dashboard/request-finished-dashboard.component';
import { RequestFinishedComponent } from './components/request-finished/request-finished.component';
import { RequestMgmComponent } from './components/request-mgm/request-mgm.component';
import { RequestOfferFinishedComponent } from './components/request-offer-finished/request-offer-finished.component';
import { RequestOnProgressComponent } from './components/request-on-progress/request-on-progress.component';
import { RequestViewComponent } from './components/request-view/request-view.component';
import { RequestWait4PaymentComponent } from './components/request-wait-payment/request-wait-payment.component';
import { RequestWait4PollComponent } from './components/request-wait-poll/request-wait-poll.component';
import { RequestWaitToOfferComponent } from './components/request-wait-to-offer/request-wait-to-offer.component';
import { SearchComponent } from './components/search-component/search.component';
import { SendNotificationComponent } from './components/send-notification/send-notification.component';
import { SendSMSComponent } from './components/send-sms/send-sms.component';
import { SettingMgmComponent } from './components/setting-mgm/setting.component';
import { SideBarMenuComponent } from './components/sideBarMenu-component/sideBarMenu.component';
import { SubscribtionTypeMgmComponent } from './components/subscribtionTypes-mgm/subscribtionTypes.component';
import { TransactionFilterComponent } from './components/transaction-filter/transaction-filter.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionMgmComponent } from './components/transaction-mgm/transaction-mgm.component';
import { TransactionRegisterComponent } from './components/transaction-register/transaction-register.component';
import { TransactionViewComponent } from './components/transaction-view/transaction-view.component';
import { TransactionListPrintViewComponent } from './components/transactionListPView-component/transactionLIstPView.component';
import { UnregisteredWorkerMgmComponent } from './components/unregistered-worker-mgm/unregisteredWorkerMgm.component';
import { UsersMgmComponent } from './components/users-mgm/users.component';
import { UsersWorkerMgmComponent } from './components/users-worker-mgm/users-wr.component';
import { WorkerPaymentPrintViewComponent } from './components/worker-payment-print-view/worker-payment-print-view.component';
import { WorkerMgmComponent } from './components/workerMgm-component/workerMgm.component';
import { WorkerStationMgmComponent } from './components/workerStation-mgm/workerStationMgm.component';
import { WorkerView } from './components/workerView-component/workerView.component';
import { WorkStationDashboardComponent } from './components/workStation-dashboard/workStationDashboard.component';
import { WorkStationView } from './components/workStationView-component/workStationView.component';
import { WorkTypeMgmComponent } from './components/workTypes-mgm/workTypes.component';
import { WrPaymentReportComponent } from './components/wr-payment-report/wr-payment-report.component';
import { EditWorkerContactComponent } from './components/wrContactInfo-component/editWrContactInfo.component';
import { EditWorkerDocumentComponent } from './components/wrDocument-component/editWrDocument.component';
import { WorkerFilter } from './components/wrFilter.component';
import { EditWorkerJobCatComponent } from './components/wrJobCat-component/editWrJobCat.component';
import { EditWorkerPersonalInfoComponent } from './components/wrPersonal-Info-component/editWrPersonalInfo.component';
import { EditWorkerPhoneComponent } from './components/wrPhoneEdit-component/editWrPhoneEdit.component';
import { EditWorkerRegisterStateComponent } from './components/wrRegisterState-component/editWrRegisterState.component';
import { EditWorkerServiceAreaComponent } from './components/wrServiceArea-component/editWrServiceArea.component';
import { EditWorkerWorkingHourComponent } from './components/wrWorkingHour-component/editWrWorkingHour.component';
import { WorkStationBizInfoEdit } from './components/wsBizInfoEdit.component';
import { WorkStationContactInfoEdit } from './components/wsContactInfoEdit.component';
import { WorkStationDocumentInfoEdit } from './components/wsDocumentInfoEdit.component';
import { WorkStationFilter } from './components/wsFilter.component';
import { WorkStationJobInfoEdit } from './components/wsJobInfoEdit.component';
import { WorkStationLocationInfoEdit } from './components/wsLocationInfoEdit.component';
import { WorkStationPersonalInfoEdit } from './components/wsPersonalInfoEdit.component';
import { WorkStationPhoneInfoEdit } from './components/wsPhoneInfoEdit.component';
import { WorkStationRegisterStateEdit } from './components/wsRegisterStateEdit.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import './rxjs-extensions';
import { AuthService } from './services/auth.service';
import { SharedFunctions } from './services/shared-functions.service';
import { SharedValues } from './services/shared-values.service';
import { RequestAllComponent } from './components/request-all/request-all.component';
import { ValueAddedViewComponent } from './components/valueAdded-view/valueAdded-view.component';
import { ValueAddedPrintViewComponent } from './components/valueAddedPView-component/valueAddedPView.component';
import { ValueAddedExtendedViewComponent } from './components/valueAddedExtended-view/valueAddedExtended-view.component';










@NgModule({
  imports: [BrowserModule,
    BrowserAnimationsModule,
    AccordionModule,
    RadioButtonModule,
    InputTextareaModule,
    InputTextModule,
    ToolbarModule,
    ButtonModule,
    MenuModule,
    PanelModule,
    SpinnerModule,
    TableModule,
    TreeModule,
    TreeTableModule,
    PanelMenuModule,
    DataTableModule, SharedModule,
    DropdownModule,
    ListboxModule,
    DialogModule,
    DataGridModule,
    OverlayPanelModule,
    GrowlModule,
    SelectButtonModule,
    CheckboxModule,
    InputSwitchModule,
    ChipsModule,
    FileUploadModule,
    MessageModule,
    TriStateCheckboxModule,
    MessagesModule,
    ConfirmDialogModule,
    TooltipModule,
    RatingModule,
    SliderModule,
    FieldsetModule,
    TabViewModule,
    SlideMenuModule,
    AutoCompleteModule,
    KeyFilterModule,
    CardModule,
    MultiSelectModule,
    AppRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCFCFQ8IcM_pED6bVVbxKSUbfYOcQ8_a54', libraries: ["places"]
    }),
    ReactiveFormsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    DpDatePickerModule,
    HighchartsChartModule,
    AppRoutingModule],
  declarations: [AppComponent, HomeLayoutComponent, LoginLayoutComponent, LoadingComponent, SideBarMenuComponent,
    AdminPanelComponent, LoginComponent, HomeComponent, UsersMgmComponent, ClientUsersMgmComponent,
    HeaderComponent, FooterComponent, SearchComponent, GeoComponent,
    AFinancialMgmComponent, JobCategoryComponent, DocumentTypeMgmComponent,
    WorkTypeMgmComponent, JobGeoReportComponent,
    WorkStationBizInfoEdit, WorkStationLocationInfoEdit, WorkStationPersonalInfoEdit, WorkerMgmComponent,
    WorkStationContactInfoEdit, WorkStationPhoneInfoEdit,
    WorkStationJobInfoEdit, WorkStationFilter, WorkerFilter, WorkStationDocumentInfoEdit,
    SubscribtionTypeMgmComponent, WorkerStationMgmComponent, WorkStationDashboardComponent,
    WorkStationView,
    EditWorkerRegisterStateComponent,
    EditWorkerContactComponent,
    WorkStationRegisterStateEdit,
    EditWorkerDocumentComponent,
    EditWorkerWorkingHourComponent,
    EditWorkerPhoneComponent,
    RequestAllComponent,
    EditWorkerServiceAreaComponent,
    CartableDashboardComponent,
    CartableWorkStationComponent,
    CartableWorkerComponent,
    CartableExpiredRequstComponent,
    WorkerView,
    AddWorkerComponent,
    EditWorkerComponent,
    EditWorkerJobCatComponent,
    EditWorkerPersonalInfoComponent,
    RequestMgmComponent,
    RequestFilterComponent,
    RequestViewComponent,
    RequestDashboardComponent,
    TransactionMgmComponent,
    TransactionFilterComponent,
    TransactionViewComponent,
    WFinancialMgmComponent,
    TransactionListComponent,
    TransactionRegisterComponent,
    WFinancialFilterComponent,
    CFinancialMgmComponent,
    CFinancialFilterComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    SendSMSComponent,
    SendNotificationComponent,
    AppVersionMgmComponent,
    RequestWaitToOfferComponent,
    //RequestWaitToDoComponent,
    RequestOnProgressComponent,
    RequestWait4PaymentComponent,
    RequestWait4PollComponent,
    RequestOfferFinishedComponent,
    RequestFinishedComponent,
    UnregisteredWorkerMgmComponent,
    RequestFinishedDashboardComponent,
    SettingMgmComponent,
    UsersWorkerMgmComponent,
    WrPaymentReportComponent,
    DiscountCodeMgmComponent,
    DiscountViewComponent,
    DiscountFilterComponent,
    PrintLayoutComponent,
    TransactionListPrintViewComponent,
    WorkerPaymentPrintViewComponent,
    NotificationReportComponent,
    CartableWorkStationWait4InitComponent,
    CartableWorkStationWait4DocComponent,
    CartableWorkStationWait4FinalComponent,
    CartableWorkerWait4InitComponent,
    CartableWorkerWait4DocComponent,
    CartableWorkerWait4FinalComponent,
    CartableWorkerWait4PreFinalComponent,
    ValueAddedViewComponent,
    ValueAddedExtendedViewComponent,
    ValueAddedPrintViewComponent,
    FestivalMgmComponent,
    ValueAddredReportComponent],
  providers: [AuthService, CanActivateViaAuthGuard,
    ConfirmationService, SharedValues, SharedFunctions],
  bootstrap: [AppComponent]
})


export class AppModule { }
