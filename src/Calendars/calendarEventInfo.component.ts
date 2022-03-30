import { Component, Inject, Input, Output, EventEmitter } from "@angular/core";
import { faSquare, faClone, faCalendarDay } from "@fortawesome/free-solid-svg-icons";

const WEEK_DAYS: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

@Component({
    selector: 'calendar-event-info',
    templateUrl: 'calendar_event_info.template.html',
    styleUrls: ['calendarEventInfo.css']
})
export class CallendarEventInfo {
    @Input('event') event: any;
    @Output() eventChange: EventEmitter<any> = new EventEmitter<any>();

    faSquare = faSquare;
    faClone = faClone;
    faCalendarDay = faCalendarDay;

    constructor(@Inject('monthNames') public monthNames: any) { }

    setTitle() {
        let weekDay = WEEK_DAYS[this.event.date.getDay()];
        let month = this.monthNames[this.event.date.getMonth() - 1];
        let date = this.event.date.getDate();
        let title = `${weekDay}, ${month} ${date} - ${this.event.duration}`;

        return title;
    }

    closeWindow() {
        this.event = undefined;
        this.eventChange.emit();
    }

    guestsStatus() {
        if (this.event.guests.length == 0) {
            return '';
        }
        let yesCount = 0;
        let noCount = 0;
        let awaitingCount = 0;
        for (let guest of this.event.guests) {
            switch (guest.status) {
                case 'yes':
                    yesCount++;
                    break;
                case 'no':
                    noCount++;
                    break;
                default:
                    awaitingCount++;
                    break;
            }
        }
        let text = `${yesCount} yes`;
        text += noCount > 0 ? `, ${noCount} no` : '';
        text += awaitingCount > 0 ? `, ${awaitingCount} awaiting` : '';

        return text;
    }
}