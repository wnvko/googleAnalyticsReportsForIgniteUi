import { Pipe, PipeTransform } from '@angular/core';
import { Data } from '../models/data';


@Pipe({
    name: 'eventSort',
    pure: false
})
export class EventSortPipe implements PipeTransform {
    transform(events: Data[]) {
        if (!events) {
            return events;
        }
        events.sort((x: Data, y: Data) => y.totalEvents - x.totalEvents );
        return events.filter((x: Data) => x.totalEvents > 0);
    }
}