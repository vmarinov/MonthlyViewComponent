import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class CalendarEventsService {
  events = [
    {
      name: 'Available', starts: '12:00', ends: '13:00', calendar: 'emilia', date: new Date(2022, 2, 22),
    },
    {
      name: 'Marathon', starts: '16:00', ends: '20:00', calendar: 'emilia', date: new Date(2022, 2, 22),
    },
    {
      name: 'Meet', starts: '10:00', ends: '12:00', calendar: 'emilia', date: new Date(2022, 2, 10),
    }
    ,
    {
      name: 'Jog', starts: '10:00', ends: '12:00', calendar: 'john', date: new Date(2022, 2, 12),
    },
    {
      name: 'Jog', starts: '10:00', ends: '12:00', calendar: 'john', date: new Date(2022, 3, 1),
    },
    ,
    {
      name: 'Available', starts: '10:00', ends: '12:00', calendar: 'emilia', date: new Date(2022, 3, 2),
    },
    {
      name: 'Jog', starts: '10:00', ends: '13:00', calendar: 'emilia', date: new Date(2022, 3, 2),
    },
    {
      name: 'Meet', starts: '11:00', ends: '13:00', calendar: 'emilia', date: new Date(2022, 3, 2),
    },
    {
      name: 'Coffee', starts: '10:00', ends: '11:00', calendar: 'emilia', date: new Date(2022, 3, 2),
    },
    {
      name: 'Beer', starts: '12:00', ends: '14:00', calendar: 'emilia', date: new Date(2022, 3, 2),
    }];

  eventsSource = new BehaviorSubject<any>(null);
  dateSource = new BehaviorSubject<any>(new Date());
  leftNavDateSource = new Subject<any>();

  eventsShown$ = this.eventsSource.asObservable();
  dateShown$ = this.dateSource.asObservable();
  leftNavDateShown$ = this.leftNavDateSource.asObservable();
  eventsSelected: any;

  setEvents(events: any) {
    this.eventsSelected = this.events.filter((event: any) => events.has(event.calendar));
    this.eventsSource.next(this.eventsSelected);
  }

  getEvents() {
    return this.eventsSelected;
  }

  setDate(date: any) {
    this.dateSource.next(date);
  }

  setLeftCalendarDate(date: any) {
    this.leftNavDateSource.next(date);
  }
}