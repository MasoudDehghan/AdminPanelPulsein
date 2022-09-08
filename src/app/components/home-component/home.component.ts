import { PortalNotification } from './../../pEntites/portalNotification.class';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationTypeEnum } from 'app/enums/notificationType.enum';
import { environment } from 'environments/environment';
import * as Highcharts from 'highcharts';
import * as HighchartsStock from 'highcharts/highstock';
import { timer } from 'rxjs';
import "rxjs/add/operator/takeWhile";
import { webSocket, WebSocketSubject } from 'rxjs/websocket';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { Statistics } from '../../entities/statistics.class';
import { RequestStateEnum } from '../../enums/requestState.enum';
import { HomePageService } from '../../services/homePage.service';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { RequestStats } from './../../entities/requestStats.class';
import { PrintService } from './../../services/print.service';

@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: './home.template.html',
    styleUrls: ['home.component.css', '../../../assets/css/dashboard.css'],
    providers: [HomePageService]
})


export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

    activeLabel: string = this.shared.menuItem1Label;
    loading: boolean = false;
    hmsgs: GrowlMessage[] = [];
    errorCntrler: HandleErrorMsg;
    stat: Statistics = new Statistics();
    role: number;

    lastRefreshTime: Date = new Date();

    alive: boolean; // used to unsubscribe from the TimerObservable
    // when OnDestroy is called.
    interval: number
    inActiveWorkerCntr: number = 0;
    totalRequestCntr: number = 0;
    workerstationNeedToCheck: number = 0;
    workerNeedToCheck: number = 0;
    docNeedToCheck: number;
    expiredReqCnt: number = 0;
    currentRequestState: number = 0;
    chartData: RequestStats[] = [];
    Highcharts = Highcharts;
    HighchartsStock = HighchartsStock;
    chartOptions: any;
    chartUpdateFlag: boolean = false;
    socket$: WebSocketSubject<PortalNotification>;
    chart: any;
    isErrSoket = false;
    chartInstance: Highcharts.Chart;
    //@ViewChild('statChart') public statChart: HighchartsChartComponent ;
    constructor(private _router: Router,
        public shared: SharedValues,
        public printService: PrintService,
        private _statService: HomePageService) {
        this.alive = true;
        this.interval = 5000;

    }
    ngOnInit() {

        this.errorCntrler = new HandleErrorMsg(this._router);
        this.refreshDataWithLoading();
        setInterval(() => {
            timer(0, this.interval)
                .takeWhile(() => this.alive)
                .subscribe(() => {
                    this.refreshData();
                });
        }, 60000);
        this.initSocket();
        setInterval(() => {
            console.log("*** setInterval ***");
            if (this.isErrSoket) {
                console.log("isErrorSocket** : " + this.isErrSoket);
                this.isErrSoket = false;
                this.initSocket();
            }
        }, 60000);
        this.chartData = [];

        this.rtvRequestStat();

    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.chartOptions = {
            chart: {
                zoomType: 'x',
                spacingLeft: 0,
                renderTo: 'statChart'
            },
            title: {
                text: ''
            },
            credits: { enabled: false },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: [{
                title: {
                    text: 'جاری'
                }
                ,
                height: '20%',
                lineWidth: 2,
                offset: 0,
                opposite: false,
                tickInterval: 1,
                className: 'highcharts-font-style'
            },
            {
                title: {
                    text: 'اتمام '
                },
                top: '25%',
                height: '20%',
                lineWidth: 2,
                offset: 0,
                tickInterval: 1,
                opposite: false
            },
            {
                title: {
                    text: 'ثبت '
                },
                top: '50%',
                height: '20%',
                lineWidth: 2,
                offset: 0,
                tickInterval: 1,
                opposite: false
            },
            {
                title: {
                    text: 'لغو '
                },
                top: '75%',
                height: '20%',
                lineWidth: 2,
                offset: 0,
                tickInterval: 1,
                opposite: false,
                className: 'highcharts-font-style'
            }],
            plotOptions: {
                line: {
                    threshold: null
                }

            },
            tooltip:
            {
                shared: true,
                useHTML: true
            },
            series: [{
                yAxis: 0,
                name: 'inProgress',
                color: '#5B5B5B',
                step: 1
            },
            {
                yAxis: 1,
                name: 'todayCompleted',
                color: '#64dd17',
                step: 1
            },
            {
                yAxis: 2,
                name: 'todayRegistered',
                color: '#EE962A',
                step: 1
            },
            {
                yAxis: 3,
                name: 'todayCanceled',
                color: '#e91e63',
                step: 1
            }
            ]

        };

    }
    rtvRequestStat() {
        this._statService.getRequestTodayStats().subscribe(response => {
            this.chartData = <RequestStats[]>response;
            this.loadChartData();
            if (!this.chartInstance)
                this.chartInstance = new Highcharts.Chart(this.chartOptions);
            else
                this.chartInstance.options = this.chartOptions;
        });
    }
    addDataSocket(requestStats: RequestStats) {
        //this.loadChartData();
        console.log(this.chartInstance);
        if (!this.chartInstance)
            this.chartInstance = new Highcharts.Chart(this.chartOptions);
        this.chartInstance.series[0].addPoint([requestStats.timeInMil, requestStats.inProgress]);
        this.chartInstance.series[1].addPoint([requestStats.timeInMil, requestStats.todayCompleted]);
        this.chartInstance.series[2].addPoint([requestStats.timeInMil, requestStats.todayRegistered]);
        this.chartInstance.series[3].addPoint([requestStats.timeInMil, requestStats.todayCanceled]);
    }
    loadChartData() {
        if (this.chartOptions) {
            this.chartOptions.series[0].data = this.chartData.map(function (point) {
                return [point.timeInMil, point.inProgress];
            });
            this.chartOptions.series[1].data = this.chartData.map(function (point) {
                return [point.timeInMil, point.todayCompleted];
            });
            this.chartOptions.series[2].data = this.chartData.map(function (point) {
                return [point.timeInMil, point.todayRegistered];
            });
            this.chartOptions.series[3].data = this.chartData.map(function (point) {
                return [point.timeInMil, point.todayCanceled];
            });
            this.chartUpdateFlag = true;
        }

    }
    initSocket() {
        console.log("do initSocket !!!");
        this.socket$ = webSocket(environment.webSocketAddress);
        //console.log(this.socket$);
        this.socket$.subscribe(
            (socketData) => {
                //console.log("socket$.subscribe");
                this.isErrSoket = false;
                let notification: PortalNotification = <PortalNotification>socketData;
                let typeID = notification.typeId;

                switch (typeID) {
                    case NotificationTypeEnum.NewRequestStats:
                        console.log(notification.requestStats);
                        this.addDataSocket(notification.requestStats);
                        break;
                    case NotificationTypeEnum.ClearRequestStats:
                        this.rtvRequestStat();
                        break;
                    case NotificationTypeEnum.SMS:
                        console.log(notification.smsCode + "----->" + notification.mobileNumber);
                        this.shared.smsSubject.next(notification);
                        break;
                    default:
                        console.error("Unknown Notification Type : " + typeID);
                        break;
                }

            },
            (err) => {
                console.log(err);
                console.log("*** is error in connect socket ***");
                this.isErrSoket = true;
                this.socket$.unsubscribe();
            });
    }

    ngOnDestroy(): void {
        //clearInterval(this.interval);
        this.alive = false;
        this.socket$.unsubscribe();

    }
    buildStat() {
        this.inActiveWorkerCntr = this.stat.wRegCompleteCnt - this.stat.wActiveCnt;
        this.totalRequestCntr = this.stat.reqInProgress + this.stat.reqSuggestFinished +
            this.stat.reqWait4Do + this.stat.reqWait4Nazarsanji + this.stat.reqWait4Payment +
            this.stat.reqWait4Suggest + this.stat.reqWait4DoAck;

        if (this.stat.cartableSummary) {
            this.workerNeedToCheck = this.stat.cartableSummary.wrDocCompleteCnt +
                this.stat.cartableSummary.wrDocCompleteCntW4Ws + this.stat.cartableSummary.wrNewCnt +
                this.stat.cartableSummary.wrW4Doc + this.stat.cartableSummary.wrDocCompleteCntW4Ws;
            this.workerstationNeedToCheck = this.stat.cartableSummary.wsW4Area + this.stat.cartableSummary.wsDocCompleteCnt +
                this.stat.cartableSummary.wsNewCnt + this.stat.cartableSummary.wsW4Area +
                this.stat.cartableSummary.wsW4Doc;
            this.docNeedToCheck = this.stat.cartableSummary.wrDocCnt + this.stat.cartableSummary.wsCatalogCnt +
                this.stat.cartableSummary.wsDocCnt + this.stat.cartableSummary.wsLogoCnt;
            this.expiredReqCnt = this.stat.cartableSummary.reqExpireCnt;
        }
        this.lastRefreshTime = new Date();
    }
    refreshDataWithLoading() {
        this.role = Number(sessionStorage.getItem('roleId'));
        this.loading = true;
        this.hmsgs = [];
        this._statService.geStats().subscribe(result => {
            this.loading = false;
            this.stat = <Statistics>result;
            if (this.stat)
                this.buildStat();

        }, error => {
            this.loading = false;
            let obj: Statistics = error.error;
            let err: BackendMessage = obj.error;
            let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
            let errorMessages = this.errorCntrler.gMessage;
            errorMessages.forEach(element => {
                this.hmsgs.push(element);
            });
        });
    }

    refreshData() {
        this.role = Number(sessionStorage.getItem('roleId'));
        this.hmsgs = [];
        this._statService.geStats().subscribe(result => {
            this.stat = <Statistics>result;
            this.buildStat();
        }, error => {
            let obj: Statistics = error.error;
            let err: BackendMessage = obj.error;
            let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
            let errorMessages = this.errorCntrler.gMessage;
            errorMessages.forEach(element => {
                this.hmsgs.push(element);
            });
        });
    }

    onClickBizCard() {
        this._router.navigate(['/workerMgmComponent']);

    }
    onClickUserCard() {
        this._router.navigate(['/clientUsersMgm']);

    }
    onClickCartableCard() {
        this._router.navigate(['/CartableDashboard']);

    }
    onClickAll() {
        this._router.navigate(['/RequestMgmComponent', { current: true, load: -1 }]);



    }

    // onClickRequest(reqStateID: number) {
    //     this._router.navigate(['/RequestMgmComponent', { load: reqStateID }]);
    // }
    onClickWait4SuggestRequest() {
        this.currentRequestState = RequestStateEnum.waitToOffer;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickSuggestFinishedRequest() {
        this.currentRequestState = RequestStateEnum.offerTimeFinished;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }

    onClickWait4DoAckRequest() {
        this.currentRequestState = RequestStateEnum.Wait4DoAck;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickInProgressRequest() {
        this.currentRequestState = RequestStateEnum.ongoing;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickWait4PaymentRequest() {
        this.currentRequestState = RequestStateEnum.waitToPayment;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickWait4PollRequest() {
        this.currentRequestState = RequestStateEnum.waitToPoll;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    goToWorkerMgmActive() {
        this._router.navigate(['/workerMgmComponent', { filteredActive: true }]);

    }
    goToWorkerMgmInActive() {
        this._router.navigate(['/workerMgmComponent', { filteredActive: false }]);

    }
    gotoWorkstationCartable() {
        this._router.navigate(['/workerStationMgmComponent']);
    }
    gotoWorkerCartable() {
        this._router.navigate(['/workerMgmComponent']);
    }
    gotoDocCartable() {
        this._router.navigate(['/CartableDashboard']);
    }
    gotoExpiredReqCartable() {
        this._router.navigate(['/CartableExpiredRequstComponent']);
    }
}