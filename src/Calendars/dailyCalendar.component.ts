import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

const HRS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

@Component({
    selector: 'daily-calendar',
    templateUrl: 'daily_calendar.template.html',
    styleUrls: ['dailyCalendar.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyCalendarComponent implements OnInit, OnDestroy {
    currentDate = new Date();
    selectedDate!: number;
    shownDate: any;
    dayOfWeek!: string;
    eventsSubscription: Subscription;
    dateSubscription: Subscription;
    hours = HRS;
    hoursAndEvents: Map<any, any> = new Map<any, any>();
    events: any;
    draggedEvent: any;

    constructor(@Inject('CalendarEventsService') private calendarEventsService: CalendarEventsService,
        @Inject('weekDays') private weekDays: any, private changeRef: ChangeDetectorRef) {

        this.eventsSubscription = this.calendarEventsService.eventsShown$.subscribe((events: any) => {
            this.clearEvents();
            this.setEvents(events);
        });
        this.dateSubscription = this.calendarEventsService.dateShown$.subscribe((date: any) => {
            this.changeRef.markForCheck();
            this.setDate(date);
            this.clearEvents();
            this.setEvents(this.calendarEventsService.getEvents());
        });
    }

    ngOnInit(): void {
        for (let hr of this.hours) {
            let hour = hr % 12 == 0 ? '12' : `${hr % 12}`;
            hour += hr <= 11 ? ' AM' : ' PM'
            this.hoursAndEvents.set(hr, { hour, events: [] });
        }
    }

    ngOnDestroy(): void {
        this.eventsSubscription.unsubscribe();
    }

    parseTime(time: any): number {
        let [hr, _] = time.split(':');
        return hr;
    }

    setDate(date: any) {
        this.shownDate = date;
        this.selectedDate = date.getDate();
        this.dayOfWeek = this.weekDays[date.getDay()];
    }

    setEvents(events: any) {
        this.events = events;
        if (!this.events) {
            return;
        }
        this.events = this.events.filter((event: any) => {
            return event.date.getDate() == this.shownDate.getDate() &&
                (event.date.getMonth() == this.shownDate.getMonth() ||
                    event.date.getMonth() == this.shownDate.getMonth() - 1 ||
                    event.date.getMonth() == this.shownDate.getMonth() + 1) &&
                event.date.getFullYear() == this.shownDate.getFullYear()
        });

        this.events.forEach((event: any) => {
            this.setEventProperties(event);
        });

        if (this.events.length > 0) {
            for (let event of this.events) {
                let hourlyEventObj = this.hoursAndEvents.get(Number(event.startTime));
                hourlyEventObj.events.push(event);
            }
            this.setEventsPositions();
        }
        this.changeRef.detectChanges();
    }

    clearEvents() {
        for (let hour of this.hoursAndEvents.values()) {
            hour.events = [];
        }
    }

    // event positioning fn
    // when events have same start hour the shorter event should always have higher z-index and they are shown in longest -> shortest order
    // events that start 1 hour later should have margin left in order for the previous event to show
    // try to put events in groups depending on duration overlaps and then determine z-index and margins
    setEventsPositions() {
        for (let obj of this.hoursAndEvents.values()) {
            obj.events.sort((a: any, b: any) => b.interval - a.interval); //sort events by duration longer -> shortest
            let prevHourlyEventObj;
            if (obj.events[0]?.startTime > 2) {
                prevHourlyEventObj = this.hoursAndEvents.get(Number(obj.events[0].startTime - 1));
            }
            if (prevHourlyEventObj?.events.length > 0) {
                let margin = prevHourlyEventObj.events[0].marginLeft;
                obj.events[0].marginLeft = margin ? margin * 2 + 10 : 10;
            }
        }
    }

    dragStart(event: any, calendarEvent: any, eventPos: any) {
        this.draggedEvent = calendarEvent;
        this.draggedEvent.pos = eventPos;
        event.dataTransfer.setData("text/plain", event.target.id);
        event.target.style.cursor = 'move';
        event.target.style.opacity = 1;
    }

    onDragOver(event: any) {
        event.preventDefault()
    }

    onDrop(event: any) {
        let eventsObj = this.hoursAndEvents.get(Number(this.draggedEvent.startTime));
        if (eventsObj) {
            eventsObj.events.splice(this.draggedEvent.pos, 1);
        }

        let newStartHour = event.target.attributes?.hour?.value;
        this.draggedEvent.starts = newStartHour;
        this.draggedEvent.ends = `${Number(newStartHour) + this.draggedEvent.interval}`;
        this.setEventProperties(this.draggedEvent);
        let hourEvent = this.hoursAndEvents.get(Number(newStartHour));
        hourEvent.events.push(this.draggedEvent);
        event.dataTransfer.clearData();

        let id = event.dataTransfer.getData("text/plain");
        // let target = event.target;
        // while (target?.class != 'time') {
        //     target = target.parentElement;
        // }
        event.target.appendChild(document.getElementById(id));

        this.setEventsPositions();
    }

    setEventProperties(event: any) {
        let startTime = event.starts.substring(0, 2);
        let endTime = event.ends.substring(0, 2);
        let duration = `${startTime % 12 == 0 ? '12' : startTime % 12}${startTime <= 11 && endTime > 11 ? 'am' : ''} - 
                ${endTime % 12 == 0 ? '12' : endTime % 12}${endTime < 11 ? 'am' : 'pm'}`;
        let interval = endTime - startTime;
        let elemHeight = interval > 0 ? interval * 48 : 48;

        Object.assign(event,
        {
            interval,
            startTime,
            endTime,
            duration,
            elemHeight,
        })
    }
}