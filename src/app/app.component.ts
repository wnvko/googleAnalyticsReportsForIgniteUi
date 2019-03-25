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
  public frameworksData: FrameworkData[];
  public projectTypesData: ProjectTypeData[];

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
        this.frameworksData = this.getFrameworksData(data.result.reports);
        break;
      case this.reports[1]:
        this.projectTypesData = this.getProjectsTypeData(data.result.reports);
        break;
      case this.reports[2]:
        break;
    }
  }

  private generateReportRequests(type: string): ReportRequest[] {
    switch (type) {
      case 'frameworks':
        return this.generateFrameworksReportRequests();
      case 'project types':
        return this.generateProjectTypesReportRequests();
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

    const dimensionsForEvents: Dimension[] = [
      {name: 'ga:dimension1'},
      {name: 'ga:eventCategory'}
    ];
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

  private generateProjectTypesReportRequests(): ReportRequest[] {
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
          operator: 'IN_LIST',
          expressions: ['Choose the type of project:', 'Choose the type of the project:']
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

    const dimensionsForEvents: Dimension[] = [
      {name: 'ga:dimension2'},
      {name: 'ga:eventCategory'}
    ];
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

  private getFrameworksData = (reports): FrameworkData[] => {
    const frameworksData: FrameworkData[] = this.initializeFrameworksData();
    for (const report of reports) {
      if (report.columnHeader.dimensions.includes('ga:eventLabel')) {
        this.getFrameworksDataForWizard(report, frameworksData);
      }

      if (report.columnHeader.dimensions.includes('ga:dimension1')) {
        this.getFrameworksDataForEvents(report, frameworksData);
      }
    }
    return frameworksData;
  }

  private initializeFrameworksData(): FrameworkData[] {
    const frameworksData: FrameworkData[] = [];
    frameworksData.push({
      frameworkName: 'Angular',
      totalEvents: 0,
      commands: []
    });
    frameworksData.push({
      frameworkName: 'jQuery',
      totalEvents: 0,
      commands: []
    });
    frameworksData.push({
      frameworkName: 'React',
      totalEvents: 0,
      commands: []
    });
    return frameworksData;
  }

  private getFrameworksDataForWizard(data: any, frameworksData: FrameworkData[]): FrameworkData[] {
    for (const row of data.data.rows) {
      const frameworkName: string = row.dimensions[1].substring(11);
      const frameworkData: FrameworkData = frameworksData.find((item: FrameworkData) => {
        return item.frameworkName.toLowerCase() === frameworkName.toLowerCase();
      });
      if (!frameworkData) {
        continue;
      }
      const totalEvents: number = parseInt(row.metrics[0].values[0]);
      frameworkData.totalEvents += totalEvents;
      frameworkData.commands.push({
        name: 'ig wizard',
        totalEvents
      });
    }

    return frameworksData;
  }

  private getFrameworksDataForEvents(data: any, frameworksData: FrameworkData[]): FrameworkData[] {
    for (const row of data.data.rows) {
      const frameworkName: string = row.dimensions[0];
      const frameworkData: FrameworkData = frameworksData.find((item: FrameworkData) => {
        return item.frameworkName.toLowerCase() === frameworkName.toLowerCase();
      });
      if (!frameworkData) {
        continue;
      }
      const totalEvents: number = parseInt(row.metrics[0].values[0]);
      frameworkData.totalEvents += totalEvents;
      //  TODO: check if command already exists in the list
      frameworkData.commands.push({
        name: row.dimensions[1],
        totalEvents
      });
    }

    return frameworksData;
  }

  private getProjectsTypeData = (reports): ProjectTypeData[] => {
    const projectsTypeData: ProjectTypeData[] = this.initializeProjectsTypeData();
    for (const report of reports) {
      if (report.columnHeader.dimensions.includes('ga:eventLabel')) {
        this.getProjectsTypeDataForWizard(report, projectsTypeData);
      }

      if (report.columnHeader.dimensions.includes('ga:dimension2')) {
        this.getProjectsTypeDataForEvents(report, projectsTypeData);
      }
    }
    return projectsTypeData;
  }

  private initializeProjectsTypeData(): ProjectTypeData[] {
    const projectsTypeData: ProjectTypeData[] = [];
    projectsTypeData.push({
      projectType: 'Ignite UI Angular Wrappers', //ig-ts
      totalEvents: 0,
      commands: []
    });
    projectsTypeData.push({
      projectType: 'Ignite UI for Angular', //igx-ts
      totalEvents: 0,
      commands: []
    });
    projectsTypeData.push({
      projectType: 'jquery', //js
      totalEvents: 0,
      commands: []
    });
    projectsTypeData.push({
      projectType: 'Ignite UI for JavaScript React Wrappers', //es6
      totalEvents: 0,
      commands: []
    });
    projectsTypeData.push({
      projectType: 'Ignite UI for React', //igr-es6
      totalEvents: 0,
      commands: []
    });
    return projectsTypeData;
  }

  private getProjectsTypeDataForWizard(data: any, projectsTypeData: ProjectTypeData[]): ProjectTypeData[] {
    for (const row of data.data.rows) {
      const fullName: string = row.dimensions[1];
      const projectType: string = fullName.substring(fullName.indexOf(':') + 2);
      const projectTypeData: ProjectTypeData = projectsTypeData.find((item: ProjectTypeData) => {
        return item.projectType.toLowerCase() === projectType.toLowerCase();
      });
      if (!projectTypeData) {
        continue;
      }
      const totalEvents: number = parseInt(row.metrics[0].values[0]);
      projectTypeData.totalEvents += totalEvents;
      projectTypeData.commands.push({
        name: 'ig wizard',
        totalEvents
      });
    }

    return projectsTypeData;
  }

  private getProjectsTypeDataForEvents(data: any, projectsTypeData: ProjectTypeData[]): ProjectTypeData[] {
    for (const row of data.data.rows) {
      const projectTypeName: string = this.translateProjectTypeName(row.dimensions[0]);
      const projectTypeData: ProjectTypeData = projectsTypeData.find((item: ProjectTypeData) => {
        return item.projectType.toLowerCase() === projectTypeName.toLowerCase();
      });
      if (!projectTypeData) {
        continue;
      }
      const totalEvents: number = parseInt(row.metrics[0].values[0]);
      projectTypeData.totalEvents += totalEvents;
      //  TODO: check if command already exists in the list
      projectTypeData.commands.push({
        name: row.dimensions[1],
        totalEvents
      });
    }

    return projectsTypeData;
  }

  private translateProjectTypeName(shortTypeName: string): string {
    let longTypeName: string;
    switch (shortTypeName) {
      case 'ig-ts':
        longTypeName = 'Ignite UI Angular Wrappers';
        break;
      case 'igx-ts':
        longTypeName = 'Ignite UI for Angular';
        break;
      case 'js':
        longTypeName = 'jquery';
        break;
      case 'es6':
        longTypeName = 'Ignite UI for JavaScript React Wrappers';
        break;
      case 'igr-es6':
        longTypeName = 'Ignite UI for React';
        break;
      default:
        longTypeName = 'UNSUPPORTED SHORT TYPE NAME!';
    }

    return longTypeName;
  }
}

interface Command {
  name: string;
  totalEvents: number;
}

interface FrameworkData {
  frameworkName: string;
  totalEvents: number;
  commands: Command[];
}

interface ProjectTypeData {
  projectType: string;
  totalEvents: number;
  commands: Command[];
}
