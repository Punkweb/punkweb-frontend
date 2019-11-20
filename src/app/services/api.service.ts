import { Injectable } from '@angular/core';
import {
  of as observableOf,
  throwError as observableThrowError,
  combineLatest as observableCombineLatest,
  Observable,
} from 'rxjs';
import { flatMap, map, catchError } from 'rxjs/operators';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';

interface ApiOperations {
  create(payload: any): Observable<any>;
  read(id: number | string, params: any): Observable<any>;
  list(params: any): Observable<any>;
  paged(params: any): Observable<any>;
  update(id: number | string, payload: any, put: boolean): Observable<any>;
  delete(id: number | string): Observable<any>;
  listRoute(method: string, route: string, payload: any, params: any);
  detailRoute(method: string, route: string, id: string, payload: any, params: any);
}

interface ListResponse {
  results: any[];
  count: number;
  previous: string;
  next: string;
}

class ApiEndpoint implements ApiOperations {

  constructor(private http: HttpService, public endpoint: string) { }

  public create(payload = {}): Observable<any> {
    const request = this.http.post(this.createUrl(), payload);
    return request.pipe(catchError((error: any) => {
      return observableThrowError(error);
    }));
  }

  public read(id: number | string, params = {}): Observable<any> {
    const request = this.http.get(this.createUrl(id), params);
    return request.pipe(catchError((error: any) => {
      return observableThrowError(error);
    }));
  }

  public list(params = {}): Observable<any> {
    const request = this.http.get(this.createUrl(), params);
    return request.pipe(
      map((response: ListResponse) => {
        const results = Object.assign(response.results, {
          count: response.count,
          next: response.next,
          previous: response.previous
        });
        return results;
      }), catchError((error: any) => {
        return observableThrowError(error);
      }));
  }

  public paged(params = {}): Observable<any> {
    let request = this.http.get(this.createUrl(), params);
    return request.pipe(
      flatMap((firstPage: ListResponse) => {
        let pageObservables: Observable<any>[] = [observableOf(firstPage.results)];
        // construct each page url for each existing page, starting at 2
        if (firstPage.next) {
          for (let i = 2; i <= Math.ceil(firstPage.count / firstPage.results.length); i++) {
            const page = this.http.get(this.createUrl(), Object.assign(params, { page: i })).pipe(
              map((pageResponse: ListResponse) => pageResponse.results));
            pageObservables.push(page);
          }
        }
        return observableCombineLatest(pageObservables).pipe(
          map((nested) => nested.reduce((acc, cur) => acc.concat(cur), [])),
          catchError((error: any) => {
            return observableThrowError(error);
          }));
      }), catchError((error: any) => {
        return observableThrowError(error);
      }));
  }

  public update(id: number | string, payload = {}, put = false): Observable<any> {
    let request = null;
    if (put) {
      request = this.http.put(this.createUrl(id), payload);
    } else {
      request = this.http.patch(this.createUrl(id), payload);
    }
    return request.pipe(catchError((error: any) => {
      return observableThrowError(error);
    }));
  }

  public delete(id: number | string): Observable<any> {
    const request = this.http.delete(this.createUrl(id));
    return request.pipe(catchError((error: any) => {
      return observableThrowError(error);
    }));
  }

  public listRoute(method: string, route: string, payload = {}, params = {}): Observable<any> {
    const request = this.http.request(method, `${this.createUrl()}${route}`, payload, params);
    return request.pipe(catchError((error: any) => {
      return observableThrowError(error);
    }));
  }

  public detailRoute(method: string, route: string, id: number | string, payload = {}, params = {}): Observable<any> {
    const request = this.http.request(method, `${this.createUrl()}${id}/${route}`, payload, params);
    return request.pipe(catchError((error: any) => {
      return observableThrowError(error);
    }));
  }

  private createUrl(id: number | string = null): string {
    if (id) {
      return `${environment.apiUrl}/${this.endpoint}/${id}/`;
    } else {
      return `${environment.apiUrl}/${this.endpoint}/`;
    }
  }
}

@Injectable()
export class ApiService {

  public AnalyticsEvent = new ApiEndpoint(this.http, 'analytics/analytics_events');
  public ClientError = new ApiEndpoint(this.http, 'analytics/client_errors');

  public ContactForms = new ApiEndpoint(this.http, 'contact_forms');

  public BoardCategories = new ApiEndpoint(this.http, 'board/categories');
  public BoardSubcategories = new ApiEndpoint(this.http, 'board/subcategories');
  public BoardThreads = new ApiEndpoint(this.http, 'board/threads');
  public BoardPosts = new ApiEndpoint(this.http, 'board/posts');
  public BoardShouts = new ApiEndpoint(this.http, 'board/shouts');
  public BoardProfiles = new ApiEndpoint(this.http, 'board/profiles');

  public Artist = new ApiEndpoint(this.http, 'artists');
  public Album = new ApiEndpoint(this.http, 'albums');
  public Audio = new ApiEndpoint(this.http, 'audio');
  public ArtistEvent = new ApiEndpoint(this.http, 'artist_events');
  public Users = new ApiEndpoint(this.http, 'users');

  constructor(
    private http: HttpService
  ) { }
}
