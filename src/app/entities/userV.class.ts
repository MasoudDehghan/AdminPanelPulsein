import { UserLoginData } from "./userLoginData.class";
import { UserPersonalData } from "./userPersonalData.class";

export class UserV{
    id:number;
    loginData:UserLoginData;
    personalData:UserPersonalData;
    credit:number;
    creditUpdateTime:string;
}