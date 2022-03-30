import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class CalendarEventsService {
  events = [
    {
      name: 'Available', starts: '12:00', ends: '13:00', calendar: 'emilia', date: new Date(2022, 2, 22), guests: []
    },
    {
      name: 'Marathon', starts: '16:00', ends: '20:00', calendar: 'emilia', date: new Date(2022, 2, 22), guests: []
    },
    {
      name: 'Meet', starts: '10:00', ends: '12:00', calendar: 'emilia', date: new Date(2022, 2, 10), guests: []
    }
    ,
    {
      name: 'Jog', starts: '10:00', ends: '12:00', calendar: 'john', date: new Date(2022, 2, 12), guests: []
    },
    {
      name: 'Jog', starts: '10:00', ends: '12:00', calendar: 'john', date: new Date(2022, 3, 1), guests: []
    },
    ,
    {
      name: 'Available', starts: '10:00', ends: '12:00', calendar: 'emilia', date: new Date(2022, 3, 2), guests: []
    },
    {
      name: 'Jog', starts: '10:00', ends: '13:00', calendar: 'emilia', date: new Date(2022, 3, 2), guests: []
    },
    {
      name: 'Meet', starts: '11:00', ends: '13:00', calendar: 'emilia', date: new Date(2022, 3, 2), guests: []
    },
    {
      name: 'Coffee', starts: '10:00', ends: '11:00', calendar: 'emilia', date: new Date(2022, 3, 2), guests: []
    },
    {
      name: 'Beer', starts: '12:00', ends: '14:00', calendar: 'emilia', date: new Date(2022, 3, 2), 
      guests: [
        {
          userId: 1,
          going: true,
        },
        {
          userId: 2,
          going: true,
        },
        {
          userId: 3,
          going: false,
        }
      ]
    },
    {
      name: 'Fish n Chips', starts: '12:00', ends: '14:00', calendar: 'emilia', date: new Date(2022, 3, 2), guests: []
    },
    {
      name: 'Nap', starts: '13:00', ends: '14:00', calendar: 'emilia', date: new Date(2022, 3, 2), guests: []
    },
    {
      name: 'Sleep Walk', starts: '13:00', ends: '15:00', calendar: 'emilia', date: new Date(2022, 3, 2), guests: []
    },
    {
      name: 'Walk the dog', starts: '08:15', ends: '09:30', calendar: 'emilia', date: new Date(2022, 3, 2), guests: []
    },
    {
      name: 'Long', starts: '17:00', ends: '23:00', calendar: 'emilia', date: new Date(2022, 3, 2), guests: []
    },
    {
      name: 'Shorter', starts: '19:00', ends: '21:00', calendar: 'emilia', date: new Date(2022, 3, 2), guests: []
    },
    {
      name: 'Shortest', starts: '19:00', ends: '20:00', calendar: 'emilia', date: new Date(2022, 3, 2), guests: []
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