import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-visualization',
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.component.scss']
})
export class DataVisualizationComponent {
  @Input()
  public dataSource: any[];

  @Input()
  public labelMemberPath: string;

  constructor() { }
}
