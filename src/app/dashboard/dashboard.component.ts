import { Component, ViewChild } from '@angular/core';
import { ReportRequest, DateRange, Metric, Dimension, Filter, DimensionFilterClause } from '../models/index';
import { DataService } from '../services/data.service';
import { DataVisualizationComponent } from '../data-visualization/data-visualization.component';

enum ReportType {
  Frameworks = 'Frameworks',
  ProjectTypes = 'Project Types',
  Templates = 'Templates'
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private VIEW_ID = '174416971';

  @ViewChild('dataVisualization')
  private dataVisualization: DataVisualizationComponent;

  public loggedIn = false;
  public selected: ReportType;
  public reportsTypes: string[] = [ReportType.Frameworks, ReportType.ProjectTypes, ReportType.Templates];
  public frameworksData: FrameworkData[];
  public projectTypesData: ProjectTypeData[];
  public templatesData: TemplateData[];
  public labelMemberPath: string;

  constructor(
    private dataLoadService: DataService
  ) {
    this.dataLoadService.onDataLoaded.subscribe(v => this.onLoadData(v));
    this.selected = ReportType.Frameworks;
  }

  /**
   * Loads data from Google Analytics
   */
  public loadData() {
    const reportRequests = this.generateReportRequests(this.selected as ReportType);
    this.dataLoadService.loadData(reportRequests);
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
    this.labelMemberPath = '';
    switch (this.selected) {
      case ReportType.Frameworks:
        this.frameworksData = this.getFrameworksData(data.reports);
        this.labelMemberPath = 'frameworkName';
        break;
      case ReportType.ProjectTypes:
        this.projectTypesData = this.getProjectsTypeData(data.reports);
        this.labelMemberPath = 'projectType';
        break;
      case ReportType.Templates:
        this.templatesData = this.getTemplatesData(data.reports);
        this.labelMemberPath = 'templateName';
        break;
    }
  }

  private generateReportRequests(reportType: ReportType): ReportRequest[] {
    switch (reportType) {
      case ReportType.Frameworks:
        return this.generateFrameworksReportRequests();
      case ReportType.ProjectTypes:
        return this.generateProjectTypesReportRequests();
      case ReportType.Templates:
        return this.generateTemplatesReportRequests();
    }
  }

  private generateFrameworksReportRequests(): ReportRequest[] {
    const dateRange: DateRange = {
      startDate: this.dataVisualization.startDate.toISOString().substring(0, 10),
      endDate: this.dataVisualization.endDate.toISOString().substring(0, 10)
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
      startDate: this.dataVisualization.startDate.toISOString().substring(0, 10),
      endDate: this.dataVisualization.endDate.toISOString().substring(0, 10)
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

  private generateTemplatesReportRequests(): ReportRequest[] {
    const dateRange: DateRange = {
      startDate: this.dataVisualization.startDate.toISOString().substring(0, 10),
      endDate: this.dataVisualization.endDate.toISOString().substring(0, 10)
    };
    const metrics: Metric[] = [{expression: 'ga:totalEvents'}];
    const dimensionsForWizard: Dimension[] = [
      {name: 'ga:eventLabel'},
      {name: 'ga:eventAction'}
    ];
    const filtersForWizard: Filter[] = [
      {
          dimensionName: 'ga:eventLabel',
          operator: 'BEGINS_WITH',
          expressions: ['Choose project template:']
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

    return [reportRequestForWizard];
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

  private getTemplatesData = (reports): TemplateData[] => {
    const templatesData: TemplateData[] = this.initializeTemplatesData();
    for (const report of reports) {
      if (report.columnHeader.dimensions.includes('ga:eventLabel')) {
        this.getTemplatesDataForWizard(report, templatesData);
      }
    }
    return templatesData;
  }

  private initializeTemplatesData(): TemplateData[] {
    const templatesData: TemplateData[] = [];
    templatesData.push({
      templateName: 'empty',
      totalEvents: 0,
      commands: []
    });
    templatesData.push({
      templateName: 'base',
      totalEvents: 0,
      commands: []
    });
    templatesData.push({
      templateName: 'Empty Project',
      totalEvents: 0,
      commands: []
    });
    templatesData.push({
      templateName: 'Default side navigation',
      totalEvents: 0,
      commands: []
    });
    templatesData.push({
      templateName: 'Side navigation + login',
      totalEvents: 0,
      commands: []
    });
    templatesData.push({
      templateName: 'jquery with Javascript',
      totalEvents: 0,
      commands: []
    });
    templatesData.push({
      templateName: 'Default top navigation',
      totalEvents: 0,
      commands: []
    });
    return templatesData;
  }

  private getTemplatesDataForWizard(data: any, projectsTypeData: TemplateData[]): TemplateData[] {
    for (const row of data.data.rows) {
      const fullName: string = row.dimensions[1];
      const template: string = fullName.substring(fullName.indexOf(':') + 2);
      const templateData: TemplateData = projectsTypeData.find((item: TemplateData) => {
        return item.templateName.toLowerCase() === template.toLowerCase();
      });
      if (!templateData) {
        continue;
      }
      const totalEvents: number = parseInt(row.metrics[0].values[0]);
      templateData.totalEvents += totalEvents;
      templateData.commands.push({
        name: 'ig wizard',
        totalEvents
      });
    }

    return projectsTypeData;
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

interface TemplateData {
  templateName: string;
  totalEvents: number;
  commands: Command[];
}
