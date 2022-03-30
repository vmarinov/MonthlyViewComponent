import { Component, EventEmitter, Input, Output } from "@angular/core";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'calendar-event-settings',
    templateUrl: 'calendar_event_settings.template.html',
    styleUrls: ['calendar_event_settings.css']
})
export class CalendarEventSettings {
    @Input() selectedHour: any;
    @Output() selectedHourChange: EventEmitter<any> = new EventEmitter<any>();

    faCalendarDay = faCalendarDay;

    closeWindow() {
        this.selectedHour = undefined;
        this.selectedHourChange.emit();
    }
}