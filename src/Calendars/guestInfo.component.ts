import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'guest-info',
    templateUrl: 'guest_info.template.html',
    styleUrls: ['guestInfo.css']
})
export class GuestInfoComponent {
    @Input('guest') guest: any;
    @Input('posTop') posTop: any;
    @Input('posLeft') posLeft: any;

    @Output() guestChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() mouseEntered: EventEmitter<any> = new EventEmitter<any>();

    isHovering: boolean = false;

    onMouseLeave() {
        this.guest = undefined;
        this.isHovering = false;
        this.guestChange.emit();
        this.mouseEntered.emit(this.isHovering);
    }

    onMouseOver() {
        this.isHovering = true;
        this.mouseEntered.emit(this.isHovering);
    }
}