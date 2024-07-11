import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Observable, throwError, catchError} from "rxjs";

const baseUrl = 'http://api.openweathermap.org/data/2.5/';
const APPID_HEADER = 'YOUR_APPID_HERE';
const resource = 'weather';

@Injectable({
  providedIn: 'root'
})
export class OpenWeatherService {
  private httpClient: HttpClient = inject(HttpClient);

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() =>
      'Error - Unable to retrieve Weather Condition for Specified City.');
  }

  public getWeatherAtCity(city: string, country: string): Observable<unknown> {
    const params = new HttpParams().set('q', city + ',' + country).set('appid', APPID_HEADER);
    const options = {params, responseType: 'json' as const};
    // @ts-ignore
    return this.httpClient.get(baseUrl + resource, options).pipe(
      catchError(this.handleError)
    );
  }
}
