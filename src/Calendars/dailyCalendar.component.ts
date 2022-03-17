import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

const HOURS = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const HRS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

@Component({
    selector: 'daily-calendar',
    templateUrl: 'daily_calendar.template.html',
    styleUrls: ['dailyCalendar.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyCalendarComponent implements OnInit, OnDestroy {
    currentDate = new Date();
    selectedDate!: number;
    shownDate: any;
    dayOfWeek!: string;
    eventsSubscription: Subscription;
    dateSubscription: Subscription;
    hours = HRS;
    hoursAndEvents: Map<any, any> = new Map<any, any>();
    events: any;

    constructor(@Inject('CalendarEventsService') private calendarEventsService: CalendarEventsService,
        @Inject('weekDays') private weekDays: any, private changeRef: ChangeDetectorRef) {

        this.eventsSubscription = this.calendarEventsService.eventsShown$.subscribe((events: any) => {
            this.clearEvents();
            this.setEvents(events);
        });
        this.dateSubscription = this.calendarEventsService.dateShown$.subscribe((date: any) => {
            this.changeRef.markForCheck();
            this.setDate(date);
            this.clearEvents();
            this.setEvents(this.calendarEventsService.getEvents());
        });
    }

    ngOnInit(): void {
        for (let hr of this.hours) {
            let hour = hr % 12 == 0 ? '12' : `${hr % 12}`;
            hour += hr < 11 ? ' AM' : ' PM'
            this.hoursAndEvents.set(hr, { hour, events: [] });
        }
    }

    ngOnDestroy(): void {
        this.eventsSubscription.unsubscribe();
    }

    parseTime(time: any): number {
        let [hr, _] = time.split(':');
        return hr;
    }

    setDate(date: any) {
        this.shownDate = date;
        this.selectedDate = date.getDate();
        this.dayOfWeek = this.weekDays[date.getDay()];
    }

    setEvents(events: any) {
        this.events = events;
        this.events = this.events.filter((event: any) => {
            return event.date.getDate() == this.shownDate.getDate() &&
                (event.date.getMonth() == this.shownDate.getMonth() ||
                    event.date.getMonth() == this.shownDate.getMonth() - 1 ||
                    event.date.getMonth() == this.shownDate.getMonth() + 1) &&
                event.date.getFullYear() == this.shownDate.getFullYear()
        });

        this.events.forEach((element: any) => {
            let startTime = element.starts.substring(0, 2);
            let endTime = element.ends.substring(0, 2);
            let duration = `${startTime}${startTime < 11 && endTime > 11 ? 'am' : ''} - ${endTime}${endTime < 11 ? 'am' : 'pm'}`;
            let interval = endTime - startTime;
            Object.assign(element,
                {
                    interval,
                    startTime,
                    duration
                })
        });

        if (this.events.length > 0) {
            for (let event of this.events) {
                let hourlyEventObj = this.hoursAndEvents.get(Number(event.startTime));
                hourlyEventObj.events.push(event);
            }
        }
        this.changeRef.detectChanges();
    }

    clearEvents() {
        for (let hour of this.hoursAndEvents.values()) {
            hour.events = [];
        }
        this.changeRef.detectChanges();
    }

    //add fn to calculate width of events element
}