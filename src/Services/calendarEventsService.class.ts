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
          name: 'John McClane',
          status: 'yes',
          image: 'https://upload.wikimedia.org/wikipedia/en/5/54/John_MacClane.jpg'
        },
        {
          name: 'Walter White',
          status: 'yes',
          image: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Walter_White_S5B.png/220px-Walter_White_S5B.png'
        },
        {
          name: 'Barbra Streisand',
          status: 'no',
          image: 'https://s3.amazonaws.com/cms.ipressroom.com/173/files/20219/61672a242cfac272344116ae_Barbra+Streisand/Barbra+Streisand_3380e497-e1c2-44b0-aa2e-a7eaf2b7d805-prv.jpg'
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