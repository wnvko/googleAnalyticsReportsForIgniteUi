/// <reference types="gapi" />
/// <reference types="gapi.auth2" />

import { Injectable, EventEmitter, NgZone } from "@angular/core";
import { Observable, Observer } from 'rxjs';

@Injectable()
export class GoogleApiService {
    private gapiUrl: string = "https://apis.google.com/js/client:platform.js";
    private loaded: boolean = false;
    private client_id = '290958631661-p03esksf53tnh34g1svcc5flhbrgcbsl.apps.googleusercontent.com';

    constructor(private zone: NgZone) {}

    public afterInit: EventEmitter<gapi.auth2.GoogleAuth> = new EventEmitter<gapi.auth2.GoogleAuth>();
    public onLoadData: EventEmitter<any> = new EventEmitter<any>();

    public getAuth = () => {
      this.onLoad().subscribe(() => {
              gapi.load('auth2', () => {
                  gapi.auth2.init({
                      client_id: this.client_id,
                      scope: 'https://www.googleapis.com/auth/analytics.readonly',
                      cookie_policy: 'none',
                    }).then(this.onInit, this.onError);
                });
            });
    }

    public loadData(reportRequests: ReportRequest[]) {
        gapi.client.request({
            path: '/v4/reports:batchGet',
            root: 'https://analyticsreporting.googleapis.com/',
            method: 'POST',
            body: {reportRequests}
        } as RequestOptions).then(this.afterLoadData, console.error.bind(console));
    }

    private onLoad(gapiUrl?: string): Observable<boolean> {
        if (gapiUrl) {
            this.gapiUrl = gapiUrl;
        }
        return this.loadGapi();
    }

    private loadGapi(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {
            if (this.loaded) {
                observer.next(true);
                observer.complete();
            }
            this.loaded = true;
            let node = document.createElement('script');
            node.src = this.gapiUrl;
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
            node.onload = (e) => {
                observer.next(true);
                observer.complete();
            };
        });
    }

    private onInit = (googleAuth: gapi.auth2.GoogleAuth) => {
        this.zone.run(() => {
            this.afterInit.emit(googleAuth);
        });
    }

    private afterLoadData = (response) => {
        this.zone.run(() => {
            this.onLoadData.emit(response);
        })
    }

    private onError(e) {
      console.log('error', e);
    }
}

export interface RequestOptions {
    path: string;
    root: string;
    method?: string;
    body?: any;
}

export interface Metric {
    expression: string;
}

export interface Dimension {
    name: string;
}

export interface Filter {
        dimensionName: string;
        operator: string;
        expressions: string[];
}

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface DimensionFilterClause {
    filters: Filter[];
}

export interface ReportRequest {
    viewId: string;
    dateRanges: DateRange[];
    metrics: Metric[];
    dimensions?: Dimension[];
    dimensionFilterClauses?: DimensionFilterClause[];
}
