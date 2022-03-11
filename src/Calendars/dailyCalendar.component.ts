import { Component, Inject, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

const HOURS = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

@Component({
    selector: 'daily-calendar',
    templateUrl: 'daily_calendar.template.html',
    styleUrls: ['dailyCalendar.css']
})
export class DailyCalendarComponent implements OnDestroy {
    currentDate = new Date().getDate();
    selectedDate!: number;
    dayOfWeek!: string;
    eventsSubscription: Subscription;
    dateSubscription: Subscription;
    hours = HOURS;
    hourlyEvents: Map<any, any> = new Map<any, any>();
    hoursAndEvents: any;

    constructor(@Inject('CalendarEventsService') private calendarEventsService: CalendarEventsService, @Inject('weekDays') private weekDays: any) {
        for (let hour of this.hours) {
            this.hourlyEvents.set(hour, { hour, events: [] });
        }

        this.eventsSubscription = this.calendarEventsService.eventsShown$.subscribe((events: any) => {
            if (events) {
                for (let event of events) {
                    if (event.date.getDate() != this.currentDate) {
                        continue;
                    }
                    let hour: number = this.parseTime(event.starts);
                    let hourlyEvent = this.hourlyEvents.get(Number(hour));
                    if (hourlyEvent) {
                        hourlyEvent.events.push(event);
                    }
                }
            }
            console.log(this.hourlyEvents.values());
        });
        this.dateSubscription = this.calendarEventsService.dateShown$.subscribe((date: any) => {
            this.selectedDate = date.getDate();
            this.dayOfWeek = this.weekDays[date.getDay()];
        });
    }

    ngOnDestroy(): void {
        this.eventsSubscription.unsubscribe();
    }

    parseTime(time: any): number {
        let [hr, _] = time.split(':');
        return hr;
    }
}