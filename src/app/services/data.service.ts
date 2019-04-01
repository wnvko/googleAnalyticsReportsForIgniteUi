import { Injectable, EventEmitter } from '@angular/core';
import { ReportRequest } from '../models/index';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
  public onDataLoaded: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private http: HttpClient
  ) {}

  public loadData(reportRequests: ReportRequest[]) {
    const userInfo = localStorage.getItem('ig_user');
    if (userInfo) {
      const externalToken = JSON.parse(userInfo).externalToken;
      this.http.post(
        `https://analyticsreporting.googleapis.com/v4/reports:batchGet`,
        { reportRequests },
        { headers: { 'Authorization': `Bearer ${externalToken}`} }
      ).subscribe(
        {
          next: v => this.onDataLoaded.emit(v),
          error: e => this.onDataLoaded.emit(e)
        }
      );
    }
  }
}
