import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

const WEEK_DAYS: string[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//ChangeDetection conclusions - stopped changing month days
@Component({
    selector: 'monthly-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'monthly_calendar.template.html',
    styleUrls: ['monthlyCalendar.css']
})
export class MonthlyCalendarComponent implements OnInit, OnDestroy {
    events!: any;
    shownDate: any;
    shownMonth: any;
    shownYear: any;
    shownDay: any;
    monthArr!: any[];
    lastDayOfMonth: any;
    weekDays = WEEK_DAYS;

    eventsSubscription: any;
    dateSubscription: any;

    constructor(@Inject('monthNames') public monthNames: any,
        @Inject('CalendarEventsService') private calendarEventsService: CalendarEventsService,
        private changeRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.eventsSubscription = this.calendarEventsService.eventsShown$.subscribe(
            (events: any) => {
                this.changeRef.markForCheck();
                this.events = events;
            }
        );

        this.dateSubscription = this.calendarEventsService.dateShown$.subscribe(
            (date: any) => {
                this.shownDate = new Date(date.getFullYear(), date.getMonth(), 1);
                this.setStart();
                this.setMonthDays();
                this.changeRef.detectChanges();
            }
        );
    }

    ngOnDestroy(): void {
        this.eventsSubscription.unsubscribe();
        this.dateSubscription.unsubscribe();
    }

    setStart() {
        this.shownDate.setDate(1);
        this.shownMonth = this.shownDate.getMonth() + 1;
        this.shownYear = this.shownDate.getFullYear();
        this.lastDayOfMonth = new Date(this.shownDate.getFullYear(), this.shownDate.getMonth() + 1, 0).getDate();
    }

    setMonthDays() {
        this.monthArr = Array(this.lastDayOfMonth).fill(' ');
        let startDay = this.shownDate.getDay();
        
        for (let i = 1; i <= this.lastDayOfMonth; i++) {
            this.monthArr[startDay] = i;
            startDay++;
        }
    }

    trackEvents(index: number, event: any) {
        return event.calendar;
    }
}