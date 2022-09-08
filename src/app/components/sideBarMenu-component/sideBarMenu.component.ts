import { ValueAddredReportComponent } from './../valueAdded-report/valueAddred-report.component';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, SlideMenu } from 'primeng/primeng';
import { User } from '../../entities/User.class';
import { UserRoleEnum } from '../../enums/userRole.enum';
import { AuthService } from '../../services/auth.service';
import { LoginCheck } from '../../services/loginCheck.service';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { CartableSummary } from './../../entities/cartableSummary.class';

@Component({
    moduleId: module.id,
    selector: 'sideBarMenu',
    templateUrl: './sideBarMenu.template.html',
    providers: [LoginCheck],
    styleUrls: ['sideBarStyle.css', '../../../assets/css/dashboard.css']
})

export class SideBarMenuComponent implements OnInit {
    @Input() isSideMenuOpen: boolean = true;
    @Input() selectedItemStyle = "";
    loggedInUser: boolean = false;
    loggedInUserName: string = "";
    loggedInRole: UserRoleEnum;
    loggedInProfileImagePath: string = "";
    items: MenuItem[];
    errorCntrler: HandleErrorMsg;
    loading: boolean = false;
    selectedRoute: ActivatedRoute;
    header: string = "";
    cartableSummary: CartableSummary = new CartableSummary();
    @ViewChild('menuElement') public menuElement: SlideMenu;
    constructor(private _router: Router, private _activatedRouter: ActivatedRoute,
        private _LoginCheck: LoginCheck,
        public shared: SharedValues,
        private cd: ChangeDetectorRef,
        private _authService: AuthService) {
        this.errorCntrler = new HandleErrorMsg(_router);
        this.selectedRoute = _activatedRouter;
    }
    ngOnInit() {
        this.buildMenu();
   
    }

    onToggleMenuBar() {
        this.isSideMenuOpen = !this.isSideMenuOpen;
    }
    initWSMenuGroup(role: number) {
        let wsDashboardMenuItem: MenuItem = {
            label: this.shared.statJobCategory, icon: 'fa-table',
            routerLink: ['/workStationDashboard']
        };
        let wsMgm = {
            label: this.shared.menuItem4Label, icon: 'fa-th-list',
            routerLink: ['/workerStationMgmComponent']
        };
        let wsNew = {
            label: this.shared.createNewWorkStation, icon: 'fa-plus-circle',
            routerLink: ['/NewWorkerStationComponent']
        };
        let wsWait4Init = {
            label: this.shared.wait4Init, icon: 'fa-thumbs-up',
            routerLink: ['/CartableWorkStationWait4InitComponent']
        };
        let wsWait4Doc = {
            label: this.shared.wait4Doc, icon: 'fa-thumbs-up',
            routerLink: ['/CartableWorkStationWait4DocComponent']
        };
        let wsWait4Final = {
            label: this.shared.wait4Final, icon: 'fa-thumbs-up',
            routerLink: ['/CartableWorkStationWait4FinalComponent']
        };

        let workStationMgmMenuItem = {
            label: this.shared.bizLabel,
            icon: 'fa-vcard fa-fw',
            items: []
        };
        workStationMgmMenuItem.items.push(wsDashboardMenuItem);
        workStationMgmMenuItem.items.push(wsMgm);
        workStationMgmMenuItem.items.push(wsWait4Init);
        workStationMgmMenuItem.items.push(wsWait4Doc);
        workStationMgmMenuItem.items.push(wsWait4Final);
        return workStationMgmMenuItem;
    }
    initWRMenuGroup(role: number) {
        let wrMgmMenuItem: MenuItem = {
            label: this.shared.manageWorkerLabel, icon: 'fa-table',
            routerLink: ['/workerMgmComponent']
        };
        let pendingWorkerItem: MenuItem = {
            label: this.shared.tempUsers, icon: 'fa-table',
            routerLink: ['/uworkerMgmComponent']
        };
        let workerMgmMenuItem = {
            label: this.shared.workersLabel,
            icon: 'fa-id-badge fa-fw',
            items: []

        };
        let jobGeoReportItem = {
            label: this.shared.menuItem9SubItem1Label, icon: 'fa-map-o',
            routerLink: ['/jobGeoMgmComponent']
        };
        let wrWait4Init = {
            label: this.shared.wait4Init, icon: 'fa-thumbs-up',
            routerLink: ['/CartableWorkerWait4InitComponent']
        };
        let wrWait4Doc = {
            label: this.shared.wait4Docx, icon: 'fa-thumbs-up',
            routerLink: ['/CartableWorkerWait4DocComponent']
        };
        let wrWait4Final = {
            label: this.shared.wait4Final, icon: 'fa-thumbs-up',
            routerLink: ['/CartableWorkerWait4FinalComponent']
        };
        let wrWait4PreFinal = {
            label: this.shared.wait4PreFinal, icon: 'fa-thumbs-up',
            routerLink: ['/CartableWorkerWait4PreFinalComponent']
        };

        workerMgmMenuItem.items.push(wrMgmMenuItem);
        workerMgmMenuItem.items.push(jobGeoReportItem);
        workerMgmMenuItem.items.push(wrWait4Init);
        workerMgmMenuItem.items.push(wrWait4Doc);
        workerMgmMenuItem.items.push(wrWait4Final);
        workerMgmMenuItem.items.push(wrWait4PreFinal);

        switch (this.loggedInRole) {
            case UserRoleEnum.SysAdmin:
            case UserRoleEnum.Operator_H:
                workerMgmMenuItem.items.push(pendingWorkerItem);
                break;
            default:
                break;
        }
        return workerMgmMenuItem;
    }

    initUserManagementMenuGroup(role: number) {
        let systemUsersMgmMenuItem: MenuItem = {
            label: this.shared.panelOperatorLabel, icon: 'fa-users',
            routerLink: ['/usersMgm']
        };
        let clientUsersMgmMenuItem: MenuItem = {
            label: this.shared.appClientUsersLabel, icon: 'fa-users',
            routerLink: ['/clientUsersMgm']
        };

        let notificationReportMenuItem: MenuItem = {
            label: this.shared.notificationReportLabel, icon: 'fa-send',
            routerLink: ['/notificationReport']
        };
        let workerUsersMgmMenuItem = {
            label: this.shared.appWorkertUsersLabel, icon: 'fa-users',
            routerLink: ['/workerUsersMgm']
        };
        let userMgmMenuItem = {
            label: this.shared.userMgmLabel,
            icon: 'fa-users fa-fw',
            items: []
        };
        userMgmMenuItem.items.push(clientUsersMgmMenuItem);
        userMgmMenuItem.items.push(workerUsersMgmMenuItem);
        userMgmMenuItem.items.push(notificationReportMenuItem);

        switch (this.loggedInRole) {
            case UserRoleEnum.SysAdmin:
                userMgmMenuItem.items.push(systemUsersMgmMenuItem);
                break;
            default:
                break;
        }
        return userMgmMenuItem;
    }

    initSystemMenu(role: number) {
        let AppVersionMgm: MenuItem = {
            label: this.shared.menuItem3SubItem2Label, icon: 'fa-cog',
            routerLink: ['/AppVersionMgmComponent']
        };
        let settingeMgm: MenuItem = {
            label: this.shared.settingLabel, icon: 'fa-gear',
            routerLink: ['/settingeMgm']
        };
        let systemMenuItem = {
            label: this.shared.menuItem3Label,
            icon: 'fa-gears fa-fw',
            items: []
        };
        let FestivalMgmComponentMenuItem = {
            label: this.shared.festivalMGMLabel, icon: 'fa-bolt',
            routerLink: ['/FestivalMgmComponent']
        };
        systemMenuItem.items.push(AppVersionMgm);
        systemMenuItem.items.push(settingeMgm);
        systemMenuItem.items.push(FestivalMgmComponentMenuItem);
        return systemMenuItem;

    }

    buildMenu() {
        let auth = sessionStorage.getItem("authenticated");
        if (auth = "yes") {
            this.loggedInUserName = sessionStorage.getItem("userName");
            this.loggedInRole = Number(sessionStorage.getItem("roleId"));
        }
        else
            this.loggedInUserName = sessionStorage.getItem("anonymous");
        this.loggedInProfileImagePath = "../../assets/images/sampleProfilePic.png";
        let homeItem: MenuItem = {
            label: this.shared.menuItem1Label,
            icon: `fa-home fa-fw`,
            routerLink: ['/home']

        };
        let cmsItem: MenuItem = {
            label: this.shared.menuItem2Label,
            icon: 'fa-sitemap fa-fw',
            items: [
                {
                    label: this.shared.menuItem2SubItem1Label, icon: 'fa-map',
                    routerLink: ['/geoComponent']
                },
                {
                    label: this.shared.menuItem2SubItem2Label, icon: 'fa-list-alt',
                    routerLink: ['/workTypeMgm']
                },
                {
                    label: this.shared.menuItem2SubItem3Label, icon: 'fa-address-card-o',
                    routerLink: ['/jobCategory']
                },
                {
                    label: this.shared.menuItem2SubItem4Label, icon: 'fa-drivers-license',
                    routerLink: ['/docTypeMgm']
                },
                {
                    label: this.shared.menuItem2SubItem5Label, icon: 'fa-diamond',
                    routerLink: ['/subTypeMgm']
                }
            ]
        };

        let cartableMenuItem = {
            label: this.shared.menuItem5Label,
            icon: 'fa-eye fa-fw',
            items: [
                {
                    label: this.shared.cartableDashboard, icon: 'fa-table',
                    routerLink: ['/CartableDashboard']
                },
                {
                    label: this.shared.wsCartableLabel, icon: 'fa-th-list',
                    routerLink: ['/CartableWorkStationComponent']
                },
                {
                    label: this.shared.wrCartableLabel, icon: 'fa-th-list',
                    routerLink: ['/CartableWorkerComponent']
                },
                {
                    label: this.shared.expiredRequestCartableLabel, icon: 'fa-th-list',
                    routerLink: ['/CartableExpiredRequstComponent']
                }

            ]

        };


        let requestMgmMenuItem = {
            label: this.shared.totalRequestedLabel,
            icon: 'fa-flash fa-fw'
            , items: [
                {
                    label: this.shared.allRequests, icon: 'fa-table',
                    routerLink: ['/RequestAllComponent']
                },
                {
                    label: this.shared.currentRequestsLabel, icon: 'fa-table',
                    routerLink: ['/RequestDashboardComponent']
                },

                {
                    label: this.shared.finishedRequestsLabel, icon: 'fa-th-list',
                    routerLink: ['/RequestFinishedDashboardComponent']
                }

            ]

        };
        let WFinancialMgmComponentMenuItem = {
            label: this.shared.menuItem6SubItem2Label, icon: 'fa-user-secret',
            routerLink: ['/WFinancialMgmComponent']
        };
        let ValueAddredReportComponentMenuItem = {
            label: this.shared.valueAddredReportLabel, icon: 'fa-user-secret',
            routerLink: ['/ValueAddredReportComponent']
        };
        let AFinancialMgmComponentMenuItem = {
            label: this.shared.menuItem6SubItem4Label, icon: 'fa-user-secret',
            routerLink: ['/AFinancialMgmComponent']
        };
        let CFinancialMgmComponentMenuItem =
        {
            label: this.shared.menuItem6SubItem3Label, icon: 'fa-user',
            routerLink: ['/CFinancialMgmComponent']
        };
        let WrPaymentReportComponentMenuItem = {
            label: this.shared.wrPaymentReport, icon: 'fa-money',
            routerLink: ['/WrPaymentReportComponent']
        };
        let DiscountCodeMgmComponentMenuItem = {
            label: this.shared.discountCodeMGMLabel, icon: 'fa-percent',
            routerLink: ['/DiscountCodeMgmComponent']
        };


        let billingMenuItem = {
            label: this.shared.menuItem6Label,
            icon: 'fa-credit-card fa-fw',
            items: [
                {
                    label: this.shared.valueAddredReportLabel, icon: 'fa-user-secret',
                    routerLink: ['/ValueAddredReportComponent']
                },
                {
                    label: this.shared.menuItem6SubItem4Label, icon: 'fa-user-secret',
                    routerLink: ['/AFinancialMgmComponent']
                },
                {
                    label: this.shared.menuItem6SubItem2Label, icon: 'fa-user-secret',
                    routerLink: ['/WFinancialMgmComponent']
                },
                {
                    label: this.shared.menuItem6SubItem3Label, icon: 'fa-user',
                    routerLink: ['/CFinancialMgmComponent']
                }
                , {
                    label: this.shared.wrPaymentReport, icon: 'fa-money',
                    routerLink: ['/WrPaymentReportComponent']
                }

                , {
                    label: this.shared.discountCodeMGMLabel, icon: 'fa-percent',
                    routerLink: ['/DiscountCodeMgmComponent']
                }
            ]

        };

        let logoutMenuItem = {
            label: this.shared.menuItem8Label,
            icon: 'fa-sign-out fa-fw',
            command: (click) => {
                this._LoginCheck.sendLogoutRequest()
                    .subscribe(response => {
                        let result: User = <User>response;
                        this._router.navigate(['/login']);
                    }
                        , error => {
                            this._router.navigate(['/login']);

                        }
                    );

                sessionStorage.clear();
                this._router.navigate(['/login']);

            }
        };
        let workStationMgmMenuItem = this.initWSMenuGroup(this.loggedInRole);
        let workerMgmMenuItem = this.initWRMenuGroup(this.loggedInRole);
        let systemMenuItem = this.initSystemMenu(this.loggedInRole);
        let userMgmMenuItem = this.initUserManagementMenuGroup(this.loggedInRole);
        switch (this.loggedInRole) {
            case UserRoleEnum.SysAdmin:
                this.items = [
                    homeItem,
                    requestMgmMenuItem,
                    workerMgmMenuItem,
                    workStationMgmMenuItem,
                    cartableMenuItem,
                    cmsItem,
                    billingMenuItem,
                    userMgmMenuItem,
                    systemMenuItem,
                    logoutMenuItem
                ];

                break;
            case UserRoleEnum.Operator_H:
                this.items = [
                    homeItem,
                    requestMgmMenuItem,
                    workerMgmMenuItem,
                    workStationMgmMenuItem,
                    cartableMenuItem,
                    cmsItem,
                    billingMenuItem,
                    userMgmMenuItem,
                    logoutMenuItem
                ];
                break;
            case UserRoleEnum.Operator_M:
                this.items = [
                    homeItem,
                    requestMgmMenuItem,
                    workerMgmMenuItem,
                    workStationMgmMenuItem,
                    cartableMenuItem,
                    userMgmMenuItem,
                    DiscountCodeMgmComponentMenuItem,
                    logoutMenuItem
                ];
                break;
            case UserRoleEnum.Operator_L:
                this.items = [
                    homeItem,
                    requestMgmMenuItem,
                    workerMgmMenuItem,
                    workStationMgmMenuItem,
                    logoutMenuItem
                ];
                break;
            case UserRoleEnum.Accountant:
                this.items = [
                    ValueAddredReportComponentMenuItem,
                    AFinancialMgmComponentMenuItem,
                    WFinancialMgmComponentMenuItem,
                    CFinancialMgmComponentMenuItem,
                    WrPaymentReportComponentMenuItem,
                    DiscountCodeMgmComponentMenuItem,
                    logoutMenuItem
                ];
                break;
        }
    }
    addBadges() {       

        let els = document.querySelectorAll('[class*=add-badge-]');

        for (let el of Array.from(els)) {
            let matches = el.className.match(/add-badge-(\S+)/)
            let badgeVal = matches ? matches[1] : ''
            let badgeText = badgeVal.replace(/\\\-/g, '__dash__').replace(/\-/g, ' ').replace('__dash__', '-')
            let badgeTextNode = document.createTextNode(badgeText)
            matches = el.className.match(/badge-class-(\S+)/)
            let badgeClass = matches ? matches[1] : 'danger'
            let badge = document.createElement('span')
            badge.classList.add('badge')
            badgeClass && badgeClass !== 'none' ? badge.classList.add('badge-' + badgeClass) : null
            badge.appendChild(badgeTextNode)
            el.nextSibling.appendChild(badge)
            el.classList.remove('add-badge-' + badgeVal, 'badge-class-' + badgeClass)
        }
    }
    updateBadges() {       

        let els = document.querySelectorAll('[class*=add-badge-]');

        for (let el of Array.from(els)) {
            let matches = el.className.match(/add-badge-(\S+)/)
            let badgeVal = matches ? matches[1] : ''
            let badgeText = badgeVal.replace(/\\\-/g, '__dash__').replace(/\-/g, ' ').replace('__dash__', '-')
            let badgeTextNode = document.createTextNode(badgeText)
            matches = el.className.match(/badge-class-(\S+)/)
            let badgeClass = matches ? matches[1] : 'danger'
            console.log(el);
            let innerSpanList = el.querySelectorAll('span');
            for (let ispan of Array.from(innerSpanList)) {
                console.log("i", ispan);
            }


            // let badge = document.createElement('span')
            // badge.classList.add('badge')
            // badgeClass && badgeClass !== 'none' ? badge.classList.add('badge-' + badgeClass) : null
            // badge.appendChild(badgeTextNode)
            // el.nextSibling.appendChild(badge)
            // el.classList.remove('add-badge-' + badgeVal, 'badge-class-' + badgeClass)
        }
    }
    removeBadges() {
        let els = document.querySelectorAll('[class*=ui-menuitem-text]');
        console.log("ellll", els);
        for (let el of Array.from(els)) {

                let innerSpanList = el.querySelectorAll('span');
                for (let ispan of Array.from(innerSpanList)) {
                    ispan.setAttribute("style","display:none");
                    //el.removeChild(ispan);
                    console.log("i", ispan);
                }
            


        }
    }

}