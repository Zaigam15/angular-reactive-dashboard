import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Activity } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {

  getActivities(): Observable<Activity[]> {

    const activities: Activity[] = [];
    let id = 1;

    for (let userId = 1; userId <= 10; userId++) {

      const activityCount = Math.floor(Math.random() * 40);

      for (let i = 0; i < activityCount; i++) {
        activities.push({
          id: id++,
          userId: userId,
          action: this.getRandomAction()
        });
      }
    }

    return of(activities);
  }

  private getRandomAction(): string {
    const actions = ['Login', 'Logout', 'Upload', 'Download', 'Edit'];
    return actions[Math.floor(Math.random() * actions.length)];
  }
}