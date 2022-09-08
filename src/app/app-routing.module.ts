import { ValueAddredReportComponent } from './components/valueAdded-report/valueAddred-report.component';
import { CartableWorkerWait4FinalComponent } from './components/cartable-wr-w4final/cartable-wr-w4final.component';
import { WorkerPaymentPrintViewComponent } from './components/worker-payment-print-view/worker-payment-print-view.component';
import { RequestWaitToOfferComponent } from './components/request-wait-to-offer/request-wait-to-offer.component';
import { CartableDashboardComponent } from './components/cartable-dashboard/cartable-dashboard.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CanActivateViaAuthGuard } from './authentication/activateViaAuthGuard.component'
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { LoginComponent } from './components/login.component';
import { HomeComponent } from './components/home-component/home.component'
import { UsersMgmComponent } from './components/users-mgm/users.component'
import { GeoComponent } from './components/geo-mgm/geo.component'
import { JobCategoryComponent } from './components/jobCategory-component/jobCategory.component'
import { DocumentTypeMgmComponent } from './components/docType-mgm/docTypes.component'
import { WorkTypeMgmComponent } from './components/workTypes-mgm/workTypes.component'
import { SubscribtionTypeMgmComponent } from './components/subscribtionTypes-mgm/subscribtionTypes.component'
import { WorkerStationMgmComponent } from './components/workerStation-mgm/workerStationMgm.component'
import { WorkStationDashboardComponent } from './components/workStation-dashboard/workStationDashboard.component'
import { WorkerMgmComponent } from './components/workerMgm-component/workerMgm.component'
import { JobGeoReportComponent } from './components/jobGeoReport-component/jobGeoReport.component'
import {CartableWorkStationComponent} from './components/cartable-ws-mgm/cartable-ws.component'
import {CartableWorkerComponent} from './components/cartable-wr-mgm/cartable-wr.component'
import {CartableExpiredRequstComponent} from './components/cartable-reqex-mgm/cartable-reqx.component'

import { WFinancialMgmComponent } from './components/wfinancial-mgm/wfinancial-mgm.component';
import { TransactionMgmComponent } from './components/transaction-mgm/transaction-mgm.component';
import { RequestMgmComponent } from './components/request-mgm/request-mgm.component';
import { CFinancialMgmComponent } from './components/cfinancial-mgm/cfinancial-mgm.component';
import { SendSMSComponent } from './components/send-sms/send-sms.component';
import { AppVersionMgmComponent } from './components/app-version-mgm/app-version-mgm.component';
import { RequestDashboardComponent } from './components/request-dashboard/request-dashboard.component';
// import { RequestWaitToDoComponent } from './components/request-wait-to-do/request-wait-to-do.component';
import { RequestOnProgressComponent } from './components/request-on-progress/request-on-progress.component';
import { RequestFinishedComponent } from './components/request-finished/request-finished.component';
import { RequestWait4PaymentComponent } from './components/request-wait-payment/request-wait-payment.component';
import { RequestWait4PollComponent } from './components/request-wait-poll/request-wait-poll.component';
import { RequestOfferFinishedComponent } from './components/request-offer-finished/request-offer-finished.component';
import { UnregisteredWorkerMgmComponent } from './components/unregistered-worker-mgm/unregisteredWorkerMgm.component';
import { SettingMgmComponent } from './components/setting-mgm/setting.component';
import { RequestFinishedDashboardComponent } from './components/request-finished-dashboard/request-finished-dashboard.component';
import { ClientUsersMgmComponent } from './components/client-users-mgm/client-users.component';
import { WrPaymentReportComponent } from './components/wr-payment-report/wr-payment-report.component';
import { UsersWorkerMgmComponent } from './components/users-worker-mgm/users-wr.component';
import { DiscountCodeMgmComponent } from './components/discount-code-mgm/discount-code-mgm.component';
import { PrintLayoutComponent } from './components/print-layout/print-layout.component';
import { TransactionListPrintViewComponent } from './components/transactionListPView-component/transactionLIstPView.component';
import { NotificationReportComponent } from './components/notification-report/notification-report.component';
import { CartableWorkStationWait4InitComponent } from './components/cartable-ws-w4init/cartable-ws-w4init.component';
import { CartableWorkStationWait4DocComponent } from './components/cartable-ws-w4doc/cartable-ws-w4doc.component';
import { CartableWorkStationWait4FinalComponent } from './components/cartable-ws-w4final/cartable-ws-w4final.component';
import { CartableWorkerWait4InitComponent } from './components/cartable-wr-w4init/cartable-wr-w4init.component';
import { CartableWorkerWait4DocComponent } from './components/cartable-wr-w4doc/cartable-wr-w4doc.component';
import { CartableWorkerWait4PreFinalComponent } from './components/cartable-wr-w4prefinal/cartable-wr-w4prefinal.component';
import { FestivalMgmComponent } from './components/festival-mgm/festival-mgm.component';
import { AFinancialMgmComponent } from './components/afinancial-mgm/afinancial-mgm.component';
import { RequestAllComponent } from './components/request-all/request-all.component';
import { ValueAddedPrintViewComponent } from './components/valueAddedPView-component/valueAddedPView.component';
const routes: Routes = [
  { path: 'print',
  outlet: 'print',
  component: PrintLayoutComponent,
  children: [
    { path: 'transactionListPrintView', component: TransactionListPrintViewComponent },
    { path: 'workerPaymentPrintView', component: WorkerPaymentPrintViewComponent },
    { path: 'valueAddedPrintView', component: ValueAddedPrintViewComponent }
    
  ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      }
      ,
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  }
,
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [CanActivateViaAuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
      ,
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'usersMgm',
        component: UsersMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'clientUsersMgm',
        component: ClientUsersMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'notificationReport',
        component: NotificationReportComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      
      {
        path: 'workerUsersMgm',
        component: UsersWorkerMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      
      {
        path: 'geoComponent',
        component: GeoComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'jobCategory',
        component: JobCategoryComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'docTypeMgm',
        component: DocumentTypeMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'settingeMgm',
        component: SettingMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      
      {
        path: 'workTypeMgm',
        component: WorkTypeMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'uworkerMgmComponent',
        component: UnregisteredWorkerMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      
      {
        path: 'subTypeMgm',
        component: SubscribtionTypeMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'workerStationMgmComponent',
        component: WorkerStationMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'workStationDashboard',
        component: WorkStationDashboardComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'workerMgmComponent',
        component: WorkerMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'jobGeoMgmComponent',
        component: JobGeoReportComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'WrPaymentReportComponent',
        component: WrPaymentReportComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'CartableWorkStationComponent',
        component: CartableWorkStationComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'CartableWorkStationWait4InitComponent',
        component: CartableWorkStationWait4InitComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'CartableWorkStationWait4DocComponent',
        component: CartableWorkStationWait4DocComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'CartableWorkStationWait4FinalComponent',
        component: CartableWorkStationWait4FinalComponent,
        canActivate: [CanActivateViaAuthGuard]
      },
      {
        path: 'CartableWorkerWait4InitComponent',
        component: CartableWorkerWait4InitComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'CartableWorkerWait4DocComponent',
        component: CartableWorkerWait4DocComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'CartableWorkerWait4FinalComponent',
        component: CartableWorkerWait4FinalComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'CartableWorkerWait4PreFinalComponent',
        component: CartableWorkerWait4PreFinalComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'CartableWorkerComponent',
        component: CartableWorkerComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'CartableExpiredRequstComponent',
        component: CartableExpiredRequstComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      
      ,
      {
        path: 'CartableDashboard',
        component: CartableDashboardComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'RequestMgmComponent',
        component: RequestMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'RequestDashboardComponent',
        component: RequestDashboardComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'RequestAllComponent',
        component: RequestAllComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'RequestFinishedDashboardComponent',
        component: RequestFinishedDashboardComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      
     /* , {
        path: 'RequestFinishedDashboardComponent',
        component: RequestFinishedDashboardComponent,
        canActivate: [CanActivateViaAuthGuard]
      },*/
      
      ,
      {
        path: 'RequestWaitToOfferComponent',
        component: RequestWaitToOfferComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      // ,
      // {
      //   path: 'RequestWaitToDoComponent',
      //   component: RequestWaitToDoComponent,
      //   canActivate: [CanActivateViaAuthGuard]
      // }
      ,
      {
        path: 'RequestOnProgressComponent',
        component: RequestOnProgressComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'RequestFinishedComponent',
        component: RequestFinishedComponent,
        canActivate: [CanActivateViaAuthGuard]
      }      
      ,
      {
        path: 'RequestWait4PaymentComponent',
        component: RequestWait4PaymentComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'RequestWait4PollComponent',
        component: RequestWait4PollComponent,
        canActivate: [CanActivateViaAuthGuard]
      }  
      ,
      {
        path: 'RequestOfferFinishedComponent',
        component: RequestOfferFinishedComponent,
        canActivate: [CanActivateViaAuthGuard]
      }            
      ,
      {
        path: 'TransactionMgmComponent',
        component: TransactionMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'WFinancialMgmComponent',
        component: WFinancialMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'ValueAddredReportComponent',
        component: ValueAddredReportComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'AFinancialMgmComponent',
        component: AFinancialMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'CFinancialMgmComponent',
        component: CFinancialMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'SendSMSComponent',
        component: SendSMSComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'AppVersionMgmComponent',
        component: AppVersionMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'DiscountCodeMgmComponent',
        component: DiscountCodeMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      ,
      {
        path: 'FestivalMgmComponent',
        component: FestivalMgmComponent,
        canActivate: [CanActivateViaAuthGuard]
      }
      
    ]
  }
  
  

];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [LoginLayoutComponent,HomeLayoutComponent, LoginComponent, HomeComponent, UsersMgmComponent, GeoComponent,
  DocumentTypeMgmComponent, WorkTypeMgmComponent, SubscribtionTypeMgmComponent,RequestMgmComponent,
  JobCategoryComponent, WorkerStationMgmComponent, WorkerMgmComponent,JobGeoReportComponent,
  TransactionMgmComponent,WFinancialMgmComponent,AFinancialMgmComponent,CFinancialMgmComponent];
