import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
@Injectable()
export class DataService {

  constructor(
    private http: Http
  ) { }

  getData(url): Observable<any> {
      var data = this.http.get(url).map((res: Response) => res.json());
      return data;
  }

  private handleError (error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
