import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

const HOURS = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

@Component({
    selector: 'daily-calendar',
    templateUrl: 'daily_calendar.template.html',
    styleUrls: ['dailyCalendar.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyCalendarComponent implements OnDestroy {
    currentDate = new Date();
    selectedDate!: number;
    shownDate: any;
    dayOfWeek!: string;
    eventsSubscription: Subscription;
    dateSubscription: Subscription;
    hours = HOURS;
    hourlyEvents: Map<any, any> = new Map<any, any>();
    hoursAndEvents: Map<any, any> = new Map<any, any>();
    events: any;


    constructor(@Inject('CalendarEventsService') private calendarEventsService: CalendarEventsService,
        @Inject('weekDays') private weekDays: any,
        private changeRef: ChangeDetectorRef) {

        this.eventsSubscription = this.calendarEventsService.eventsShown$.subscribe((events: any) => {
            this.events = events;
            this.setEvents();
        });
        this.dateSubscription = this.calendarEventsService.dateShown$.subscribe((date: any) => {
            this.changeRef.markForCheck();
            this.shownDate = date;
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

    setEvents() {
        if (this.events) {
            this.changeRef.markForCheck();
            this.events.forEach((element: any) => {
                Object.assign(element,
                    {
                        interval: Math.abs(element.ends.substring(0, 2) - element.starts.substring(0, 2)) + 1,
                        startTime: element.starts.substring(0, 2)
                    })
            });
        }
    }
}