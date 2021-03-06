import { Component, Inject, Input, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { faSquare, faClone, faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { UsersService } from "src/Services/usersService.class";

const WEEK_DAYS: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//TODO
//Prevent scrolling of daily view while info dialog is open
//Add dialogs for event notes next to yes button
//On hover over guests show small dialog with info 
// Move info dialog to seperate logic
@Component({
    selector: 'calendar-event-info',
    templateUrl: 'calendar_event_info.template.html',
    styleUrls: ['calendarEventInfo.css']
})
export class CallendarEventInfo implements OnInit, OnDestroy {
    @Input('event') event: any;
    @Output() eventChange: EventEmitter<any> = new EventEmitter<any>();

    guests!: any[];
    showNotes: boolean = false;
    hoveredGuest: any;
    hoveringGuestInfo: boolean = false;
    pageY: any;
    pageX: any;

    faSquare = faSquare;
    faClone = faClone;
    faAngleDown = faAngleDown;
    faAngleUp = faAngleUp;

    constructor(@Inject('monthNames') public monthNames: any, private usersService: UsersService) { }

    ngOnInit(): void {
        this.setGuests();
    }

    ngOnDestroy(): void {
        this.guests = [];
        this.event = undefined;
    }

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
            switch (guest.going) {
                case true:
                    yesCount++;
                    break;
                case false:
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

    setGuests() {
        if (this.event.guests.length == 0) {
            return;
        }
        let guestIds = this.event.guests.map((guest: any) => guest.userId);
        this.guests = this.usersService.getUsers(guestIds);
        for (let guest of this.guests) {
            if (!guest.image && !guest.name) {
                guest.image = 'assets/images/default_user_avatar.jpg';
                guest.name = guest.email;
            }

            if (!guest.image) {
                guest.image = `https://ui-avatars.com/api/?name=${guest.name.charAt(0)}&font-size=0.75`;
            }
            guest.going = this.event.guests.find((eventG: any) => eventG.userId == guest.userId).going;
        }
    }

    onGuestHover(event: any, guest: any) {
        if (!this.hoveredGuest) {
            this.pageY = event.pageY;
            this.pageX = event.pageX;
            this.hoveredGuest = guest;
        } else {
            let timeout = setTimeout(() => {
                if (!this.hoveringGuestInfo) {
                    this.hoveredGuest = undefined;
                    this.pageX = undefined;
                    this.pageY = undefined;
                }
                clearTimeout(timeout);
            }, 100);
        }
    }
}