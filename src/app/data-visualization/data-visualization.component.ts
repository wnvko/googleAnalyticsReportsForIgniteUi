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

  @Input()
  public dateRange: Date[];

  public gridData: Command[];

  public dateRangeChanged(range: Date[]) {
    this.dateRange = range;
    this.startDate = range[0];
    this.endDate = null;
    this.dataSource = null;
    if (range.length < 2) {
      return;
    }
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
    this.dateRange = [this.startDate, this.endDate];
    this.dateRangeChanged(this.dateRange);
  }

  ngOnInit() {
    this.setDates();
  }

  chart_SliceClicked(event) {
    const exploded = event.args.isExploded;
    event.sender.explodedSlices.clear();
    event.args.isExploded = !exploded;
    this.gridData = event.args.isExploded ? event.args.dataContext.commands : null;
  }
}
