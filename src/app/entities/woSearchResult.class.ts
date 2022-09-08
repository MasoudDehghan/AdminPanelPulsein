import { RegisterState } from './registerState.class';
import { WorkerSearch } from './WorkerSearch.class'
import { WorkStation } from './workStation.class'
import { Worker } from './worker.class'
import { JobCategory1 } from '../entities/JobCategory1.class'
import { JobCategory2 } from '../entities/JobCategory2.class'
import { JobCategory3 } from '../entities/JobCategory3.class'
import { WorkType } from '../entities/WorkType.class'
import { City } from '../entities/City.class'
import { Region } from '../entities/Region.class'
import { Area } from '../entities/Area.class'
import { User } from '../entities/user.class'
import { WorkerSummary } from './workerSummary.class';
export class WorkerSearchResult {
        workerSearch: WorkerSearch;
        workers: WorkerSummary[];
        selectedCity: City = null;
        selectedRegion: Region = null;
        selectedArea: Area = null;
        selectedJobCategory1: JobCategory1 = null;
        selectedJobCategory2: JobCategory2 = null;
        selectedJobCategory3: JobCategory3 = null;
        selectedKeyword: string = "";
        selectedRegisterBy: User = null;
        selectedVerifyBy: User = null;
        selectedw_code: string;
        selectedw_firstName: string;
        selectedw_lastName: string;
        selectedw_nationalCode: string;
        selectedw_mobileNumber: string;
        selectedw_active: boolean;
        selectedw_haveBond: boolean;
        selectedw_offerBlock: boolean;
        selectedw_cityList: City[] = [];
        selectedw_cityListID: number[];
        selectedRegisterState: RegisterState = null;
        selectedRegisterStartDate: string;
        selectedRegisterStopDate: string;
        selectedAppVersion: string;
}