import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http:HttpClient) { }
  httpOptions={
    headers:new HttpHeaders({
      'Content-Type':'application/json',
      'Accept':'application/json'
    })
  };

  public get(url:string):Observable<any[]>{
    return this.http.get(`http://localhost:8080/${url}`, this.httpOptions) as Observable<any[]>;
  }

  public post<T>(data:any,url:string):Observable<any>{
    return this.http.post<T>(`http://localhost:8080/${url}`,data);
  }

}
