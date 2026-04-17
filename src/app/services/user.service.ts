import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  getUsers(): Observable<User[]> {
    return of([
      { id: 1, name: 'Zaigam', role: 'Admin' },
      { id: 2, name: 'Rajat', role: 'User' },
      { id: 3, name: 'Sahil', role: 'User' },
      { id: 4, name: 'Aman', role: 'Admin' },
      { id: 5, name: 'Neha', role: 'User' },
      { id: 6, name: 'Riya', role: 'User' },
      { id: 7, name: 'Karan', role: 'Admin' },
      { id: 8, name: 'Pooja', role: 'User' },
      { id: 9, name: 'Arjun', role: 'User' },
      { id: 10, name: 'Meena', role: 'Admin' }
    ]);
  }
}