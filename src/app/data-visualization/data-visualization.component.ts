import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Data, Command } from '../models/index';

@Component({
  selector: 'app-data-visualization',
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.component.scss']
})
export class DataVisualizationComponent implements OnInit {

// tslint:disable-next-line: no-output-on-prefix
  @Output() onDateRangeChanged = new EventEmitter<Date[]>();

  @Input()
  public dataSource: Data[];

  @Input()
  public labelMemberPath: string;

  @Input()
  public startDate: Date;

  @Input()
  public endDate: Date;

  public gridData: Command[];

  constructor() {
  }

  public dateRangeChanged(range: Date[]) {
    this.startDate = range[0];
    this.endDate = range[range.length - 1];
    this.onDateRangeChanged.emit(range);
  }

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
    this.onDateRangeChanged.emit([this.startDate, this.endDate]);
  }

  formatDateForHeader(date: Date): string {
    const options = { month: 'short', day: 'numeric'};
    return date.toLocaleDateString('en-US', options);
  }

  ngOnInit() {
    this.setDates();
  }

  chart_SliceClicked(event) {
    event.sender.explodedSlices.clear();
    event.args.isExploded = true;
    this.gridData = event.args.dataContext.commands;
  }
}
