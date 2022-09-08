export class CommercialNoteItemV{
    id:number;
	//type:number;// 0:Web-Socket  1:Android  2:IOS
	//result:number; // 0:Not Applicable 1:Success 2:Failed
	androidState:number;// 0:no try  1:Send_OK  2:Send_Fail
	iosState:number; //  0:no try  1:Send_OK  2:Send_Fail
	webState:number;//  0:no try  1:Send_OK  2:Send_Fail
	seen:boolean;
	userId:number;
	userFirstName:string;
	userLastName:string;
	userMobileNumber:string;
}