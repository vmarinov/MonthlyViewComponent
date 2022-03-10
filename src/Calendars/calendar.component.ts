import { ChangeDetectionStrategy } from "@angular/core";
import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

const WEEK_DAYS: string[] = ["S", "M", "T", "W", "T", "F", "S"];

//ChangeDetection conclusion - works as intended
@Component({
    selector: 'calendar',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'calendar.template.html'
})
export class CalendarComponent implements OnInit, OnChanges, OnDestroy {
    @Output() dateSelected: EventEmitter<Object> = new EventEmitter();
    @Input() shownDate: any;
    @Input() isSelectable!: boolean;

    currDate = new Date();
    currMonth!: number;
    currYear!: number;
    currDay!: number;
    shownMonth!: number;
    shownYear!: number;
    monthArr: Array<Array<any>> = [];
    selectedDate: any;
    lastDayOfMonth!: number;
    locale: any;
    localeOptions: any;
    dateSubscription: any;
    daysInWeek = WEEK_DAYS;

    faAngleLeft = faAngleLeft;
    faAngleRight = faAngleRight;

    constructor(
        @Inject('monthNames') public monthNames: any,
        @Inject('CalendarEventsService') private calendarEventsService: CalendarEventsService) {

        this.dateSubscription = this.calendarEventsService.leftNavDateShown$.subscribe((date: any) => {
            this.shownDate = new Date(date.getFullYear(), date.getMonth(), 1);
            this.setStart();
            this.setMonthDays();
        });
    }

    ngOnInit(): void {
        this.currDay = this.currDate.getDate();
        this.currMonth = this.currDate.getMonth();
        this.currYear = this.currDate.getFullYear();
        this.setStart();
        this.setMonthDays();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setStart();
        this.setMonthDays();
    }

    ngOnDestroy(): void {
        this.dateSubscription.unsubscribe();
    }

    selectDate(date: number) {
        this.selectedDate = new Date(this.shownDate.getFullYear(), this.shownDate.getMonth(), date);
        this.dateSelected.emit(this.selectedDate);
    }

    setStart() {
        this.shownDate.setDate(1);
        this.shownMonth = this.shownDate.getMonth();
        this.shownYear = this.shownDate.getFullYear();
        this.lastDayOfMonth = new Date(this.shownDate.getFullYear(), this.shownDate.getMonth() + 1, 0).getDate();
    }

    getNextMonth() {
        this.shownDate.setMonth(this.shownDate.getMonth() + 1, 1);
        this.setStart();
        this.setMonthDays();
    }

    getPrevMonth() {
        this.shownDate.setMonth(this.shownDate.getMonth() - 1, 1);
        this.setStart();
        this.setMonthDays();
    }

    setMonthDays() {
        this.monthArr = [];
        let week: any[] = Array(7);
        week.fill('');
        let startDay = this.shownDate.getDay();
        for (let i = 1; i <= this.lastDayOfMonth; i++) {
            if (startDay % 7 == 0 && startDay != 1) {
                this.monthArr.push(week);
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
}