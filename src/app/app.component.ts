import { Component } from '@angular/core';
import {
  GoogleApiService,
  DateRange,
  Metric,
  Dimension,
  DimensionFilterClause,
  Filter,
  ReportRequest } from './services/google-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private VIEW_ID = '174416971';
  public loggedIn = false;
  public startDate: Date;
  public endDate: Date;
  public selected: string;
  public reports: string[] = ['Frameworks', 'Project Types', 'Templates'];
  public data: any[];

  constructor(private googleApiService: GoogleApiService) {
    this.googleApiService.afterInit.subscribe(this.onInit);
    this.googleApiService.onLoadData.subscribe(this.onLoadData);
    this.selected = this.reports[0];
    this.setDates();
  }

  /**
   * Log in the user if necessary
   */
  public start() {
    this.googleApiService.getAuth();
  }

  /**
   * Loads data from Google Analytics
   */
  public loadData() {
    const reportRequests = this.generateReportRequests(this.selected.toLocaleLowerCase());
    this.googleApiService.loadData(reportRequests);
  }

  private onInit = (googleAuth: gapi.auth2.GoogleAuth) => {
    if (!googleAuth.isSignedIn.get()) {
      googleAuth.signIn().then(this.onSignIn, this.onError);
    } else {
      this.onSignIn();
    }
  }

  /**
   * Sets initial dates to last full month
   */
  private setDates() {
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayLastMonth = new Date(firstDayOfCurrentMonth.getFullYear(), firstDayOfCurrentMonth.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(
      firstDayOfCurrentMonth.getFullYear(),
      firstDayOfCurrentMonth.getMonth(),
      firstDayOfCurrentMonth.getDate() - 1);
    this.startDate = firstDayLastMonth;
    this.endDate = lastDayLastMonth;
  }

  private onSignIn = () => {
    this.loggedIn = true;
  }

  private onError(e) {
    console.log('error', e);
  }

  /**
   * Visualizes loaded data
   */
  private onLoadData = (data) => {
    switch (this.selected) {
      case this.reports[0]:
        this.showFrameworksData(data);
        break;
      case this.reports[1]:
        break;
      case this.reports[2]:
        break;
    }
  }

  private generateReportRequests(type: string): ReportRequest[] {
    switch (type) {
      case 'frameworks':
        return this.generateFrameworksReportRequests();
    }
  }

  private generateFrameworksReportRequests(): ReportRequest[] {
    const dateRange: DateRange = {
      startDate: this.startDate.toISOString().substring(0, 10),
      endDate: this.endDate.toISOString().substring(0, 10)
    };
    const metrics: Metric[] = [{expression: 'ga:totalEvents'}];
    const dimensionsForWizard: Dimension[] = [
      {name: 'ga:eventLabel'},
      {name: 'ga:eventAction'}
    ];
    const filtersForWizard: Filter[] = [
      {
          dimensionName: 'ga:eventLabel',
          operator: 'EXACT',
          expressions: ['Choose framework:']
      }
    ];
    const dimensionFilterClausesForWizard: DimensionFilterClause[] = [{filters: filtersForWizard}];
    const reportRequestForWizard: ReportRequest = {
      viewId: this.VIEW_ID,
      dateRanges: [dateRange],
      metrics,
      dimensions: dimensionsForWizard,
      dimensionFilterClauses: dimensionFilterClausesForWizard
    };

    const dimensionsForEvents: Dimension[] = [{name: 'ga:dimension1'}];
    const reportRequestForEvents: ReportRequest = {
      viewId: this.VIEW_ID,
      dateRanges: [dateRange],
      metrics,
      dimensions: dimensionsForEvents
    };

    return [
      reportRequestForWizard,
      reportRequestForEvents
    ];
  }

  private showFrameworksData = (data) => {
    const wizardResults: [any] = data.result.reports[0].data.rows;
    const chartData: any[] = [];
    for (const result of wizardResults) {
      chartData.push({
        Framework: result.dimensions[1].substring(11),
        TotalEvents: parseInt(result.metrics[0].values[0])
      });
    }

    const otherResults: [any] = data.result.reports[1].data.rows;
    let angular = 0;
    let jquery = 0;
    let react = 0;
    for (const result of otherResults) {
      switch (result.dimensions[0]) {
        case 'angular':
          angular += parseInt(result.metrics[0].values[0]);
          break;
        case 'jquery':
          jquery += parseInt(result.metrics[0].values[0]);
          break;
        case 'react':
          react += parseInt(result.metrics[0].values[0]);
          break;
      }
    }

    for (const row of chartData) {
      if (row.Framework.toLowerCase() === 'angular') {
        row.TotalEvents += angular;
        angular = row.TotalEvents;
      } else if (row.Framework.toLowerCase() === 'jquery') {
        row.TotalEvents += jquery;
        jquery = row.TotalEvents;
      } else if (row.Framework.toLowerCase() === 'react') {
        row.TotalEvents += react;
        react = row.TotalEvents;
      }
    }

    this.data = chartData;
  }
}
