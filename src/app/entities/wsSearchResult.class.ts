import {WorkStationSearch} from './WorkStationSearch.class' 
import {WorkStation} from './workStation.class'
import { JobCategory1 } from '../entities/JobCategory1.class'
import { JobCategory2 } from '../entities/JobCategory2.class'
import { JobCategory3 } from '../entities/JobCategory3.class'
import { WorkType } from '../entities/WorkType.class'
import { City } from '../entities/City.class'
import { Region } from '../entities/Region.class'
import { Area } from '../entities/Area.class' 
import { User } from '../entities/User.class'
export class WorkStationSearchResult{
        workStationSearch:WorkStationSearch;
        workstations:WorkStation[];
        selectedCode : string = null;
        selectedJobCategory1:JobCategory1 = null;
        selectedJobCategory2:JobCategory2 = null;
        selectedJobCategory3:JobCategory3 = null;
        selectedWorkStationTitle:string = "";
        selectedWorkType:WorkType = null;
        selectedWorkStationWorkerTelNumber:string = "";
        selectedOfficeRegisterNumber:string = "";
        selectedOfficeNationalCode:string = "";
        selectedStoreLicenseNumber:string = "";
        selectedWorkStationWorkerfirstName:string = "";
        selectedWorkStationWorkerLastName:string = "";
        selectedWorkStationWorkerNationalCode:string = "";
        selectedCity:City = null;
        selectedRegion:Region = null;
        selectedArea:Area = null;
        selectedWorkStationRegisteredBy: User = null;
        selectedWorkStationVerifiedBy: User = null;
        selectedVerfied: number = undefined;
}