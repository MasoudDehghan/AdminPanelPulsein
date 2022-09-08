import {Injectable} from '@angular/core'

@Injectable()
export class AuthService{
    isLoggedIn(){
       
        let auth = sessionStorage.getItem("authenticated");
        //console.log(auth);
        if(auth == "yes"){
             //console.log("Logged in before!");
             return true;
        }
        return false;
    }
}