import { Component, ViewChild } from '@angular/core';
import { ReportRequest, DateRange, Metric, Dimension, Filter, DimensionFilterClause } from '../models/index';
import { DataService } from '../services/data.service';
import { DataVisualizationComponent } from '../data-visualization/data-visualization.component';
import { Data } from '../models/index';

enum ReportType {
  Frameworks = 'frameworks',
  ProjectTypes = 'project types',
  Templates = 'templates'
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private VIEW_ID = '174416971';

  @ViewChild('frameworkDataVisualization')
  private frameworkDataVisualization: DataVisualizationComponent;

  @ViewChild('projectTypeDataVisualization')
  private projectTypeDataVisualization: DataVisualizationComponent;

  @ViewChild('templatesDataVisualization')
  private templatesDataVisualization: DataVisualizationComponent;

  public loggedIn = false;
  public selected: ReportType;
  public reportsTypes: string[] = [ReportType.Frameworks, ReportType.ProjectTypes, ReportType.Templates];
  public frameworksData: Data[];
  public projectTypesData: Data[];
  public templatesData: Data[];
  public labelMemberPath: string;

  constructor(
    private dataLoadService: DataService
  ) {
    this.dataLoadService.onDataLoaded.subscribe(v => this.onLoadData(v));
    this.selected = ReportType.Frameworks;
    this.labelMemberPath = 'name';
  }

  /**
   * Loads data from Google Analytics
   */
  public loadData() {
    const reportRequests = this.generateReportRequestsByType(this.selected as ReportType);
    this.dataLoadService.loadData(reportRequests);
  }

  tabItemSelected(event) {
    const oldSelected = this.selected;
    this.selected = event.group.label.toLowerCase();
    if (oldSelected === this.selected) {
      return;
    }

    this.loadData();
  }

  private dateRangeChanged(range: Date[]) {
    if (range.length > 1) {
      this.loadData();
    }
  }

  /**
   * Visualizes loaded data
   */
  private onLoadData = (data) => {
    this.frameworksData = null;
    this.projectTypesData = null;
    this.templatesData = null;
    switch (this.selected) {
      case ReportType.Frameworks:
        const frameworkNameFilter = (s: string) => s.substring(11);
        const frameworkNames: { name: string, imageUrl?: string }[] = [
          { name: 'Angular', imageUrl: './assets/angular.png' },
          { name: 'jQuery', imageUrl: './assets/JQuery.png' },
          { name: 'React', imageUrl: './assets/react.png' }
        ];
        const frameworkWizardFilter = 'ga:eventLabel';
        const frameworkEventFilter = 'ga:dimension1';
        this.frameworksData = this.getData(data.reports, frameworkNames, frameworkNameFilter, frameworkWizardFilter, frameworkEventFilter);
        break;
      case ReportType.ProjectTypes:
        const projectTypeNameFilter = (s: string) => s.substring(s.indexOf(':') + 2);
        const projectTypeNames: { name: string, imageUrl?: string }[] = [
          { name: 'Ignite UI Angular Wrappers' },
          { name: 'Ignite UI for Angular' },
          { name: 'Ignite UI for JavaScript React Wrappers' },
          { name: 'Ignite UI for React' }
        ];
        const projectTypeWizardFilter = 'ga:eventLabel';
        const projectTypeEventFilter = 'ga:dimension2';
        this.projectTypesData =
          this.getData(data.reports, projectTypeNames, projectTypeNameFilter, projectTypeWizardFilter, projectTypeEventFilter);
        break;
      case ReportType.Templates:
        const templateNameFilter = (s: string) => s.substring(s.indexOf(':') + 2);
        const templateNames: { name: string, imageUrl?: string }[] = [
          { name: 'empty' },
          { name: 'base' },
          { name: 'Empty Project' },
          { name: 'Default side navigation' },
          { name: 'Side navigation + login' },
          { name: 'jquery with Javascript' },
          { name: 'Default top navigation' }
        ];
        const templateWizardFilter = 'ga:eventLabel';
        this.templatesData = this.getData(data.reports, templateNames, templateNameFilter, templateWizardFilter);
        break;
    }
  }

  private generateReportRequestsByType(reportType: ReportType): ReportRequest[] {
    const wizardDimensions: Dimension[] = [
      { name: 'ga:eventLabel' },
      { name: 'ga:eventAction' }
    ];
    let dates: Dates[];
    switch (reportType) {
      case ReportType.Frameworks:
        dates = [
          this.frameworkDataVisualization.startDate,
          this.frameworkDataVisualization.endDate
        ];
        const frameworkFilters: Filter[] = [{
          dimensionName: 'ga:eventLabel',
          operator: 'EXACT',
          expressions: ['Choose framework:']
        }];

        const frameworkEventDimensions: Dimension[] = [
          { name: 'ga:dimension1' },
          { name: 'ga:eventCategory' }
        ];

        return this.generateReportRequests(dates, frameworkFilters, wizardDimensions, frameworkEventDimensions);
      case ReportType.ProjectTypes:
        dates = [
          this.projectTypeDataVisualization.startDate,
          this.projectTypeDataVisualization.endDate
        ];
        const projectTypeFilters: Filter[] = [{
          dimensionName: 'ga:eventLabel',
          operator: 'IN_LIST',
          expressions: ['Choose the type of project:', 'Choose the type of the project:']
        }];

        const projectTypeEventDimensions: Dimension[] = [
          { name: 'ga:dimension2' },
          { name: 'ga:eventCategory' }
        ];

        return this.generateReportRequests(dates, projectTypeFilters, wizardDimensions, projectTypeEventDimensions);
      case ReportType.Templates:
        dates = [
          this.templatesDataVisualization.startDate,
          this.templatesDataVisualization.endDate
        ];
        const templatesFilters: Filter[] = [{
          dimensionName: 'ga:eventLabel',
          operator: 'BEGINS_WITH',
          expressions: ['Choose project template:']
        }];
        return this.generateReportRequests(dates, templatesFilters, wizardDimensions);
    }
  }

  private generateReportRequests(
    dates: Date[],
    filters: Filter[],
    wizardDimensions: Dimension[],
    eventDimensions?: Dimension[]): ReportRequest[] {
    const dateRange: DateRange = {
      startDate: dates[0].toISOString().substring(0, 10),
      endDate: dates[1].toISOString().substring(0, 10)
    };
    const metrics: Metric[] = [{ expression: 'ga:totalEvents' }];
    const dimensionFilterClausesForWizard: DimensionFilterClause[] = [{ filters }];
    const reportRequestForWizard: ReportRequest = {
      viewId: this.VIEW_ID,
      dateRanges: [dateRange],
      metrics,
      dimensions: wizardDimensions,
      dimensionFilterClauses: dimensionFilterClausesForWizard
    };

    const reportRequest: ReportRequest[] = [reportRequestForWizard];
    if (eventDimensions) {
      const reportRequestForEvents: ReportRequest = {
        viewId: this.VIEW_ID,
        dateRanges: [dateRange],
        metrics,
        dimensions: eventDimensions
      };
      reportRequest.push(reportRequestForEvents);
    }

    return reportRequest;
  }

  private getData = (
    reports,
    names: { name: string, imageUrl?: string }[],
    nameFilter: (s: string) => string,
    wizardFilter: string,
    eventFilter?: string): Data[] => {
    const data: Data[] = this.initializeData(names);
    for (const report of reports) {
      if (report.columnHeader.dimensions.includes(wizardFilter)) {
        this.getWizardData(report, data, nameFilter);
      }

      if (report.columnHeader.dimensions.includes(eventFilter)) {
        this.getEventData(report, data);
      }
    }
    return data;
  }

  private initializeData(items: { name: string, imageUrl?: string }[]): Data[] {
    const data: Data[] = [];
    for (const item of items) {
      data.push({
        name: item.name,
        totalEvents: 0,
        imageUrl: item.imageUrl,
        commands: []
      });
    }
    return data;
  }

  private getWizardData(gaData: any, data: Data[], nameFilter: (s: string) => string): Data[] {
    for (const row of gaData.data.rows) {
      const name: string = nameFilter(row.dimensions[1]);
      const dataRow: Data = data.find((item: Data) => {
        return item.name.toLowerCase() === name.toLowerCase();
      });
      if (!dataRow) {
        continue;
      }
      const totalEvents: number = parseInt(row.metrics[0].values[0]);
      dataRow.totalEvents += totalEvents;
      dataRow.commands.push({
        name: 'ig wizard',
        totalEvents
      });
    }

    return data;
  }

  private getEventData(gaData: any, data: Data[]): Data[] {
    for (const row of gaData.data.rows) {
      const name: string = this.updateName(row.dimensions[0]);
      const dataRow: Data = data.find((item: Data) => {
        return item.name.toLowerCase() === name.toLowerCase();
      });
      if (!dataRow) {
        continue;
      }
      const totalEvents: number = parseInt(row.metrics[0].values[0], 10);
      dataRow.totalEvents += totalEvents;
      //  TODO: check if command already exists in the list
      dataRow.commands.push({
        name: row.dimensions[1],
        totalEvents
      });
    }

    return data;
  }

  private updateName(shortTypeName: string): string {
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
        longTypeName = shortTypeName;
    }

    return longTypeName;
  }
}
