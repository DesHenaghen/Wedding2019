import {Pipe, PipeTransform} from '@angular/core';
import {Attending} from "./models";

@Pipe({
  name: 'attendingFilter',
  pure: false
})
export class AttendingFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter || filter.filter == false) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => {
      if (filter.attending == Attending.Yes) {
        return item.attending == filter.attending || item.main_guest_id;
      } else if (filter.attending == null) {
        return item.attending == filter.attending && !item.main_guest_id;
      }
      return item.attending == filter.attending
    });
  }
}
