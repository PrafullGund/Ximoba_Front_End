import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseName'
})
export class CourseNamePipe implements PipeTransform {

  transform(items: any[], term: string): any[] {
    if (!items) return [];
    if (!term) return items;
  
    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(term.toLowerCase());
      });
    });
   }
}
