import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, switchMap, of, shareReplay, Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ActivityService } from '../../services/activity.service';
import { User } from '../../models/user.model';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  search$ = new BehaviorSubject<string>('');
  role$ = new BehaviorSubject<string>('All');
  sort$ = new BehaviorSubject<'name' | 'activity'>('name');
  refresh$ = new BehaviorSubject<void>(undefined);

  sortAsc = true;

  users$!: Observable<User[]>;
  activities$!: Observable<Activity[]>;
  filteredData$!: Observable<(User & { activityCount: number })[]>;

  constructor(
    private userService: UserService,
    private activityService: ActivityService
  ) { }

  ngOnInit(): void {

    this.users$ = this.userService.getUsers();
    this.activities$ = this.activityService.getActivities();

    this.filteredData$ = combineLatest([
      this.refresh$,
      this.users$,
      this.activities$,
      this.search$.pipe(debounceTime(300), distinctUntilChanged()),
      this.role$,
      this.sort$
    ]).pipe(
      switchMap(([_, users, activities, search, role, sortType]) =>
        of(users).pipe(
          map((users: User[]) =>
            users
              .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
              .filter(u => role === 'All' ? true : u.role === role)
              .map(user => ({
                ...user,
                activityCount: activities.filter((a: Activity) => a.userId === user.id).length
              }))
              .sort((a, b) => {
                if (sortType === 'name') {
                  return this.sortAsc
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
                } else {
                  return this.sortAsc
                    ? a.activityCount - b.activityCount
                    : b.activityCount - a.activityCount;
                }
              })
          )
        )
      ),
      shareReplay(1)
    );
  }

  highlight(text: string): string {
    const search = this.search$.value;
    if (!search) return text;

    return text.replace(
      new RegExp(search, 'gi'),
      match => `<mark>${match}</mark>`
    );
  }

  trackById(index: number, item: User) {
    return item.id;
  }
}