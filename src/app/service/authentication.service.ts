import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

export class User{
  constructor(
    public status:string
     ) {}
  
}

export class JwtResponse{
  constructor(
    public jwttoken:string
     ) {}
  
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private httpClient:HttpClient
  ) {}
  private apiEndPointUrl = environment.apiEndPointUrl+"authenticate";

  authenticate(username:string, password:string) {
    return this.httpClient.post<any>(this.apiEndPointUrl,{username,password}).pipe(
     map(
       userData => {
        sessionStorage.setItem('username',username);
        let tokenStr= 'Bearer '+userData.token;
        sessionStorage.setItem('token', tokenStr);
        return userData;
       }
     )

    );
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username')
    //console.log(!(user === null))
    return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('username')
  }
}
