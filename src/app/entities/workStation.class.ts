import { Worker } from './worker.class'
import { WorkType } from './WorkType.class'
import { WorkTime } from './workTime.class'
import { WorkerScore } from './workerScore.class'
import { WorkerPhone } from './workerPhone.class'
import { WorkerDocument } from './workerDocument.class'
import { WorkerStationCatalog } from './workerStationCatalog.class'
import { WorkerToJobsMap } from './workerToJobsMap.class'
import { JobResource } from './jobResource.class'
import { SubscriptionType } from './SubscriptionType.class';
import { RegisterState } from './registerState.class'
import { City } from './city.class'
import { Region } from './region.class'
import { Area } from './area.class'
import { Request } from './request.class'
import { JobCategory1 } from './JobCategory1.class'
import { WorkStationScore } from './workStationScore.class'
import { WorkStationPhone } from './workStationPhone.class'
import { WorkerStationDocument } from './workerStationDocument.class'
import { PositionType } from './positionType.class'
import { BalanceSheet } from './balanceSheet.class'
import { WorkStationJob } from './workStationJob.class';
import { User } from './user.class'
import { BackendMessage } from '../entities/Msg.class'

export class WorkStation {
	id: number;
	code: string;
	title: string;
	name: string;
	logo:string;
	owner: User = new User();
	ownerPosition: PositionType;
	info: string;
	workType: WorkType = new WorkType();
	officeNationalCode: string;
	officeRegisterNumber: string;
	officeRegisterDateS: string;
	storeLicenseNumber: string;
	storeLicenseDateS: string;
	area: Area = new Area();
	address: string;
	lat: number;
	longg: number;
	postalCode: string;
	website: string;
	email: string;
	telegram: string;
	instagram: string;
	subscriptionType: SubscriptionType = new SubscriptionType();
	registerState: RegisterState = new RegisterState();
	regStateInfo: string;
	debit: number;
	credit: number;
	workStationScore: WorkStationScore = new WorkStationScore();
	jobResource: JobResource = new JobResource();
	registerTimeS: string;
	registerTime: Date;
	registerBy: User;
	verified: number;
	verificationTimeS:string;	
	verifyBy: User;
	updateTimeS: string;
	updateBy: User;
	deleted: boolean;
	deleteTimeS: string;
	workStationPhones: WorkStationPhone[] = [];
	balanceSheets: BalanceSheet[] = [];
	workStationCatalogs: WorkerStationCatalog[] = [];
	workStationDocuments: WorkerStationDocument[] = [];
	workers: Worker[] = [];
	workStationJobs: WorkStationJob[] = [];
	
	logoVerified:number;
	logoVerificationTimeS:string;
	logoVerifyBy:User;


	error: BackendMessage;
}