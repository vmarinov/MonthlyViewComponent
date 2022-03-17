import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

const HOURS = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const HRS = ['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM',
    '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];

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
                        interval: Math.abs(element.ends.substring(0, 2) - element.starts.substring(0, 2)),
                        startTime: element.starts.substring(0, 2)
                    })
            });
        }
    }

    //add fn to calculate width of events element
}