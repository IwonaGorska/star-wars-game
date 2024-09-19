import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SWAPI } from '../resources/api';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  // TODO: add interfaces and change any to type then
  // TODO: check if there is any other http request to check how many people/starships there are maximum

  private baseUrl = SWAPI.url;

  constructor(private http: HttpClient) { }

  getPeopleList(): Observable<any[]> {
    return this.http.get(`${this.baseUrl}people`).pipe(
      map((response: any) => response.results) // Extract the array of results
    );
  }

  getStarshipList(): Observable<any[]> {
    return this.http.get(`${this.baseUrl}starships`).pipe(
      map((response: any) => response.results)
    );
  }

  getPersonById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}people/${id}`);
  }

  getStarshipById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}starships/${id}`);
  }
}
