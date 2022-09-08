import { RequestState } from './requestState.class';
import { RequestSearch } from './requestSearch.class';
import { RequestView } from './requestView.class';
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
export class RequestFilterSearchResult {
        requestSearch: RequestSearch;
        requests: RequestView[];
        totalSize:number = 0;
        selectedTitle:string = "";
        selectedCode:string = "";
        selectedCity: City = null;
        selectedRegion: Region = null;
        selectedArea: Area = null;
        selectedJobCategory1: JobCategory1 = null;
        selectedJobCategory2: JobCategory2 = null;
        selectedJobCategory3: JobCategory3 = null;
        selectedClientLastName: string = "";
        selectedClientFirstName: string = "";
        selectedClientMobileNumber: string = "";
        selectedRequestStateList: RequestState[] = [];
        selectedRegisterStartDate: string = "";
        selectedRegisterStopDate: string = "";
        selectedUpdateStartDate: string = "";
        selectedUpdateStopDate: string = "";
        selectedRequestPriceStart: number = 0;
        selectedRequestPriceStop: number = 0;
        selectedWorkerCode: string = "";
        selectedWorkerFirstName: string = "";
        selectedWorkerLastName: string = "";
}