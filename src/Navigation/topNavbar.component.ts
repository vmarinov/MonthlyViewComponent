import { Component, Output, EventEmitter, Input, Inject, OnInit, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { faBars, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { filter } from "rxjs";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

//ChangeDetection conclusions - works as intended
@Component({
    selector: 'top-navbar',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'top_navbar.template.html'
})
export class TopNavbarComponent implements OnInit, OnDestroy {
    @Output() selectedViewChange: EventEmitter<any> = new EventEmitter<any>();

    selectedView: any;
    shownDate: any;
    shownEvents: any;
    menuItems = [
        { name: 'Day', shortcut: 'D', path: 'day' },
        { name: 'Week', shortcut: 'W', path: 'week' },
        { name: 'Month', shortcut: 'M', path: 'month' },
        { name: 'Year', shortcut: 'Y', path: 'year' },
        { name: 'Schedule', shortcut: 'A', path: 'schedule' },
        { name: '4 Day', shortcut: 'X', path: 'four-days' },
    ];
    currRoute: any;

    faBars = faBars;
    faAngleLeft = faAngleLeft;
    faAngleRight = faAngleRight;

    eventsSubscription: any;
    dateSubscription: any;
    routerSubscription: any;

    constructor(
        @Inject('weekDays') public daysInWeek: any,
        @Inject('monthNames') public monthNames: any,
        @Inject('CalendarEventsService') private calendarEventsService: CalendarEventsService,
        private router: Router) {

        this.routerSubscription = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        )
        .subscribe(event => {
            this.currRoute = event;
        });

        this.eventsSubscription = this.calendarEventsService.eventsShown$.subscribe(
            (events: any) => { this.shownEvents = events }
        );

        this.dateSubscription = this.calendarEventsService.dateShown$.subscribe(
            (date: any) => { this.shownDate = date }
        );
    }

    ngOnInit(): void {
        this.selectedView = this.menuItems.filter((n) => n.name == "Month");
    }

    ngOnDestroy(): void {
        this.eventsSubscription.unsubscribe();
        this.dateSubscription.unsubscribe();
        this.routerSubscription.unsubscribe();
    }

    changeDate(direction: any) {
        let fnNext = this.getNavFunction('next');
        let fnPrev = this.getNavFunction('prev');

        direction == 'next' ? fnNext() : fnPrev();
    }

    getNavFunction(direction: string) {
        switch(this.currRoute.url) {
            case '/':
            case '/month':
                return direction == 'next' ? this.getNextMonth.bind(this) : this.getPrevMonth.bind(this);
            case '/week':
                return direction == 'next' ? this.getNextWeek.bind(this) : this.getPrevWeek.bind(this);
            case '/day':
                return direction == 'next' ? this.getNextDay.bind(this) : this.getPrevDay.bind(this);
            default:
                return direction == 'next' ? this.getNextMonth.bind(this) : this.getPrevMonth.bind(this);
        }
    }

    getNextDay() {
        let date = new Date(this.shownDate.setDate(this.shownDate.getDate() + 1));
        this.calendarEventsService.setDate(date);
    }

    getPrevDay() {
        let date = new Date(this.shownDate.setDate(this.shownDate.getDate() - 1));
        this.calendarEventsService.setDate(date);
    }

    getNextWeek() {
        let date = new Date(this.shownDate.setDate(this.shownDate.getDate()));
        this.calendarEventsService.setDate(date);
    }

    getPrevWeek() {
        let date = new Date(this.shownDate.setDate(this.shownDate.getDate() - 14));
        this.calendarEventsService.setDate(date);
    }

    getNextMonth() {
        let date = new Date(this.shownDate.getFullYear(), this.shownDate.getMonth() + 1, 1);
        this.calendarEventsService.setDate(date);
    }

    getPrevMonth() {
        let date = new Date(this.shownDate.getFullYear(), this.shownDate.getMonth() - 1, 1);
        this.calendarEventsService.setDate(date);
    }

    showToday() {
        this.calendarEventsService.setDate(new Date());
        this.calendarEventsService.setLeftCalendarDate(new Date());
    }

    selectView(view: any) {
        this.selectedViewChange.emit(view);
    }
}
