import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientService, Token } from '../service/httpclient.service';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  tokens: Token[]=[];
  baseTokens: Token[]=[];
  expired = false;
  tokenSearch='';
  constructor(
    private httpClientService:HttpClientService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {  
    this.httpClientService.getTokens().subscribe(
      response =>this.handleSuccessfulResponse(response),
     );
  }

  handleSuccessfulResponse(response)
  {
    //console.log(response);
      this.tokens=response;
      this.baseTokens=response;
  }

  genToken() {
    this.httpClientService.generateToken()
      .subscribe( data => {
        if(data){
          if(data.status){ //custom error sent by rest api
            
          }else{
            this.tokens = [...this.tokens,data];
          }
         
        }
      
    })
  };

 updateToken(token: Token, flag:number): void {
   if( flag===1) { //enable token
    let dtNewValidity = new Date();
    dtNewValidity.setDate(dtNewValidity.getDate() + 7);
    let newValidity = this.datepipe.transform(dtNewValidity, 'yyyy-MM-dd HH:mm:ss');
    token.validTo = newValidity;
   }else{ //expire token
    let dtNewValidity = new Date();
    let newValidity = this.datepipe.transform(dtNewValidity, 'yyyy-MM-dd HH:mm:ss');
    token.validTo = newValidity;
   }
  this.httpClientService.updateToken(token)
    .subscribe( data => {
      let tokenIndex = this.tokens.findIndex((obj => obj.id == data.id));
      
        this.tokens[tokenIndex].validTo=data.validTo;
  })
};

deleteToken(token: Token): void {
  this.httpClientService.deleteToken(token)
    .subscribe( data => {
     this.tokens = this.tokens.filter(u => u !== token);
  })
};

  isExpired(token: Token){
    let tokenValidity = new Date(token.validTo);
    let currentDateTime = new Date();
    if(currentDateTime <= tokenValidity)
    {
      this.expired=false;
      return false;
    }
    this.expired=true;
    return true;
  }

  searchTokens(searchToken: string){
    console.log('token to search:',searchToken);
    this.tokens = this.getSearchedToken(searchToken);
    //console.log(this.tokens);
    //console.log(this.baseTokens)
  }

  getSearchedToken(query: string){
    return [...this.baseTokens].filter(
      token => token.apiToken.indexOf(query) > -1
    ); 
  }

  clearSearch(){
    this.tokenSearch='';
    this.searchTokens('');
  }
}
