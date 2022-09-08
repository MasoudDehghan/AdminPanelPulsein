import { JobCategory1 } from './JobCategory1.class';
import { SelectItem } from 'primeng/primeng';
import { JobCategory3 } from './JobCategory3.class';
export class BasicData{
    public workTypeList: SelectItem[] = [];
    public filterWorkTypeList: SelectItem[] = [];
    public filterPhoneTypeList: SelectItem[] = [];
    public filterPhoneTypeList2: SelectItem[] = [];
    public registerResourceList: SelectItem[] = [];
    public provinceList: SelectItem[] = [];
    public editProvinceList: SelectItem[] = [];
    public chooseProvinceList: SelectItem[] = [];
    public townshipList: SelectItem[] = [];
    public cityList: SelectItem[] = [];
    public regionList: SelectItem[] = [];
    public areaList: SelectItem[] = [];
    public jobCategory1Stat: JobCategory1[] = [];
    public jobCategory1List: SelectItem[] = [];
    public filteredJobCatgory1List: SelectItem[] = [];
    public editJobCategory1List: SelectItem[] = [];
    public specifiedJobCategory1List: SelectItem[] = [];
    public jobCategory2List: SelectItem[] = [];
    public editJobCategory2List: SelectItem[] = [];
    public jobCategory3List: SelectItem[] = [];
    public editJobCategory3List: SelectItem[] = [];
    public usersList: SelectItem[] = [];
    public positionTypeList: SelectItem[] = [];
    public registerStateList: SelectItem[] = [];
    public filteredRegisterStateList: SelectItem[] = [];
    public filteredRegisterStateIDList: SelectItem[] = [];
    public docTypeList: SelectItem[] = [];
    public wdocTypeList: SelectItem[] = [];
    public requestStateList: SelectItem[] = [];
    public finishedRequestStateList: SelectItem[] = [];
    public transactionTypeList: SelectItem[] = [];
    public rtransactionTypeList: SelectItem[] = [];
    public jobCategory1Map: Map<number, JobCategory1>;
    public jobCategory3DataList:JobCategory3[];
    public workerAppVersions: SelectItem[] = [];
    public clientAppVersions: SelectItem[] = [];
    public activeCityList : SelectItem[] = [];
    public clientAppVersionMap: Map<string, boolean>;
    public clientUserList: SelectItem[] = [];
    public activeVerClients:number;
    public passiveVerClients:number;
    public clientVerChartData:any;

}