import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

const WEEK_DAYS: string[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//ChangeDetection conclusions - stopped changing month days
@Component({
    selector: 'monthly-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'monthly_calendar.template.html'
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
                this.events = events;
                this.changeRef.detectChanges();
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
        this.monthArr = [];
        let week: any[] = Array(7);
        week.fill('');
        let startDay = this.shownDate.getDay();
        for (let i = 1; i <= this.lastDayOfMonth; i++) {
            if (startDay % 7 == 0 && startDay != 1) {
                if (week[0] != '' || week[week.length - 1] != '') {
                    this.monthArr.push(week);
                }
                week = [];
            }
            if (startDay == 7) {
                startDay = 0
            }
            week[startDay] = i;
            startDay++;
        }

        if (week.length > 0) {
            this.monthArr.push(week);
        }
    }

    trackEvents(index: number, event: any) {
        return event.calendar;
    }
}