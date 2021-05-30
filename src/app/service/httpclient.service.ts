import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

export class Token{
  public get validTo(): string {
    return this._validTo;
  }
  public set validTo(value: string) {
    this._validTo = value;
  }
  public get apiToken(): string {
    return this._apiToken;
  }
  public set apiToken(value: string) {
    this._apiToken = value;
  }
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  constructor(
    private _id: number,
    private _apiToken: string,
    private _validTo: string
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private httpClient:HttpClient) { }
  private api_url = "https://api.acme-corp.com/1.0";
  private apiEndPointUrl = environment.apiEndPointUrl+"api/token";
    
  getTokens()
  {  
    return this.httpClient.post<Token[]>(this.apiEndPointUrl+'/all',{"appUrl":this.api_url});
  }

  public updateToken(token:Token) {
    return this.httpClient.post<Token>(this.apiEndPointUrl+'/update',token);
  }

  public generateToken() {
    return this.httpClient.post<any>(this.apiEndPointUrl+'/generate',{"appUrl":this.api_url});
  }

  public deleteToken(token:Token) {
    return this.httpClient.delete<Token>(this.apiEndPointUrl+'/delete' + "/"+ token.id);
  }
}
