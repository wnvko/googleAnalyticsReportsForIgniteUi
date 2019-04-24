import { Component, Input } from '@angular/core';
import { Data } from '../models/index';

@Component({
  selector: 'app-events-visualization',
  templateUrl: './events-visualization.component.html',
  styleUrls: ['./events-visualization.component.scss']
})
export class EventsVisualizationComponent {
  @Input() item: Data;
}
