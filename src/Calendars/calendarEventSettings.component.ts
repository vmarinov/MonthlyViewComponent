import { Component } from "@angular/core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'calendar-event-settings',
    templateUrl: 'calendar_event_settings.template.html',
    styleUrls: ['calendar_event_settings.css']
})
export class CalendarEventSettings {
    faXmark = faXmark;
}