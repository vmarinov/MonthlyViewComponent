import { Component, Inject, Input } from "@angular/core";
import { faXmark, faPen, faTrashCan, faEllipsisVertical, faSquare, faVideo, faClone } from "@fortawesome/free-solid-svg-icons";

const WEEK_DAYS: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

@Component({
    selector: 'calendar-event-info',
    templateUrl: 'calendar_event_info.template.html',
    styleUrls: ['calendarEventInfo.css']
})
export class CallendarEventInfo {
    @Input('event') event: any;

    faXmark = faXmark;
    faPen = faPen;
    faTrashCan = faTrashCan;
    faEllipsisVertical = faEllipsisVertical;
    faSquare = faSquare;
    faVideo = faVideo;
    faClone = faClone;

    constructor(@Inject('monthNames') public monthNames: any) {}

    setTitle() {
        let weekDay = WEEK_DAYS[this.event.date.getDay()];
        let month = this.monthNames[this.event.date.getMonth()];
        let date = this.event.date.getDate();
        let title = `${weekDay}, ${month} ${date} - ${this.event.duration}`;

        return title;
    }
}