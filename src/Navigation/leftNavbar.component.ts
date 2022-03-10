import { Component, Input, Output, EventEmitter, Inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

//ChangeDetection conclusions - works as intended
@Component({
    selector: 'left-navbar',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'left_navbar.template.html'
})
export class LeftNavbarComponent {
    @Input() personCalendars!: any[]; //holds options for which calendars to show
    @Input() leftCalendarDate: any;

    myCalendarsCollapsed: boolean = true;
    selectedCalendars: Set<any> = new Set<any>();

    faAngleUp = faAngleUp;
    faAngleDown = faAngleDown;

    constructor(@Inject('CalendarEventsService') private calendarEventsService: CalendarEventsService) {}

    selectCalendars(calendar: any) {
        if (this.selectedCalendars.has(calendar)) {
            this.selectedCalendars.delete(calendar);
        } else {
            this.selectedCalendars.add(calendar);
        }

        this.calendarEventsService.setEvents(this.selectedCalendars);
    }

    toggleMyCalendars() {
        this.myCalendarsCollapsed = !this.myCalendarsCollapsed;
    }

    selectDate(date: any) {
        this.calendarEventsService.setDate(date);
    }
}