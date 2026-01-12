import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CanComponentDeactivate } from './add-new-course-can-deactivate-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
