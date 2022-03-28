import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { Subscription } from "rxjs";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

const HRS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const EVENT_MAX_WIDTH = 1200;
const EVENT_MIN_HEIGHT = 12;
const EVENT_MAX_HEIGHT = 48;
const VIEW_HEIGHT = 560;

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
  groupedEvents: any;
  mouseMoveEvent: any;
  draggedEventEl: any;
  draggedEventLastPos: any;
  targetEvent: any;
  layoutEl!: HTMLElement;

  constructor(@Inject('CalendarEventsService') private calendarEventsService: CalendarEventsService,
    @Inject('weekDays') private weekDays: any, private changeRef: ChangeDetectorRef,
    private renderer: Renderer2) {

    this.dateSubscription = this.calendarEventsService.dateShown$.subscribe((date: any) => {
      this.setDate(date);
      this.clearEvents();
      this.setEvents(this.calendarEventsService.getEvents());
    });

    this.eventsSubscription = this.calendarEventsService.eventsShown$.subscribe((events: any) => {
      this.clearEvents();
      if (events) {
        this.setEvents(events);
      }
    });
  }

  ngOnInit(): void {
    for (let hr of this.hours) {
      let hour = hr % 12 == 0 ? '12' : `${hr % 12}`;
      hour += hr <= 11 ? ' AM' : ' PM'
      this.hoursAndEvents.set(hr, { hour, events: [] });
    }
    this.layoutEl = document.getElementById('daily-calendar-layout') as HTMLElement;
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
    if (this.mouseMoveEvent) {
      this.mouseMoveEvent();
    }
  }

  parseTime(minutes: any) {
    let hr: any = Math.floor(minutes / 60);
    let min: any = ((minutes / 60) - hr) * 60;
    hr = String(hr).padStart(2, '0');
    min = String(min).padStart(2, '0');

    return `${hr}:${min}`;
  }

  parseEventDuration(start: any, end: any) {
    let startHour = Number(start.substring(0, 2));
    let startMinutes = Number(start.substring(3, 5));
    let endHour = Number(end.substring(0, 2));
    let endMinutes = Number(end.substring(3, 5));
    let startTime = `${startHour % 12 == 0 ?
      `12${startMinutes != 0 ? `:${startMinutes}` : ''}` :
      `${startHour % 12}${startMinutes != 0 ? `:${startMinutes}` : ''}`}${startHour <= 11 && endHour > 11 ? 'am' : ''}`;

    let endTime = `${endHour % 12 == 0 ?
      `12${endMinutes != 0 ? `:${endMinutes}` : ''}` :
      `${endHour % 12}${endMinutes != 0 ? `:${endMinutes}` : ''}`}${endHour < 11 ? 'am' : 'pm'}`;

    let durationTxt = startTime + ' - ' + endTime;

    return <any>[startHour, endHour, startMinutes, endMinutes, durationTxt];
  }

  setDate(date: any) {
    this.shownDate = date;
    this.selectedDate = date.getDate();
    this.dayOfWeek = this.weekDays[date.getDay()];
  }

  setEvents(events: any) {
    if (!events) {
      return;
    }
    this.changeRef.markForCheck();
    this.events = events;
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
      this.groupEvents();
      this.setEventsPositions();
      this.setHourlyEvents();
    }
  }

  clearEvents() {
    for (let hour of this.hoursAndEvents.values()) {
      hour.events = [];
    }
    this.groupedEvents = [];
  }

  setEventProperties(event: any) {
    let [startHour, endHour, startMinutes, endMinutes, duration] = this.parseEventDuration(event.starts, event.ends);
    let startInMin = (startHour * 60) + startMinutes;
    let endInMin = (endHour * 60) + endMinutes;
    let interval = endInMin - startInMin;
    let elemHeight = (interval / 15) * EVENT_MIN_HEIGHT;

    Object.assign(event,
      {
        startInMin,
        endInMin,
        interval,
        startHour,
        endHour,
        duration,
        elemHeight,
      })
  }

  setHourlyEvents() {
    for (let group of this.groupedEvents) {
      let hourlyEventObj = this.hoursAndEvents.get(Number(group.start));
      if (hourlyEventObj) {
        hourlyEventObj.events = group.events;
      }
    }
  }
  // event positioning fn
  // when events have same start hour the shorter event should always have higher z-index and they are shown in longest -> shortest order
  // events that start 1 hour later should have margin left in order for the previous event to show
  // try to put events in groups depending on duration overlaps and then determine z-index and margins
  setEventsPositions() {
    this.changeRef.markForCheck();
    for (let group of this.groupedEvents) {
      for (let i = 0; i < group.events.length; i++) {
        let event = group.events[i];
        event.zIndex = i + 1;
        event.width = EVENT_MAX_WIDTH;
        event.marginLeft = 0;
        event.top = event.startHour * EVENT_MAX_HEIGHT;
        event.top += ((event.startInMin - (event.startHour * 60)) / 15) * EVENT_MIN_HEIGHT;
        if (i > 0) {
          let prevEvent = group.events[i - 1];
          if (prevEvent.endHour > event.startHour) {
            event.marginLeft = i * 150;
            event.width = EVENT_MAX_WIDTH - event.marginLeft;
          } else {
            event.zIndex = 1
          }
        }
      }
    }
  }

  groupEvents() {
    let sortedEvents = this.events.sort((event1: any, event2: any) => event1.startHour - event2.startHour);
    let groupedEvents = [];
    let currGroup = { start: sortedEvents[0].startHour, end: sortedEvents[0].endHour, events: [sortedEvents[0]] };
    groupedEvents.push(currGroup);

    for (let i = 1; i < sortedEvents.length - 1; i++) {
      let event = sortedEvents[i];
      if (event.startHour < currGroup.end) {
        currGroup.end = currGroup.end > event.endHour ? currGroup.end : event.endHour;
        currGroup.events.push(event);
      } else {
        currGroup = { start: event.startHour, end: event.endHour, events: [event] };
        groupedEvents.push(currGroup);
      }
    }
    this.groupedEvents = groupedEvents;
    this.sortAndIdEvents();
  }

  sortAndIdEvents() {
    //sort longest -> shortest group events
    for (let group of this.groupedEvents) {
      group.events.sort((event1: any, event2: any) => event2.interval - event1.interval);
      for (let i = 0; i < group.events.length; i++) {
        group.events[i].id = i;
      }
    }
  }

  changeEventGroup(calendarEvent: any) {
    let removed = false;
    let added = false;
    for (let group of this.groupedEvents) {
      if (removed && added) {
        break;
      }

      if (group.end > calendarEvent.prevStartHour && group.start <= calendarEvent.prevStartHour) {
        group.events.splice(calendarEvent.id, 1);
        removed = true;
      }

      if (group.start <= calendarEvent.startHour && group.end > calendarEvent.startHour) {
        group.events.push(calendarEvent);
        group.end = group.end > calendarEvent.endHour ? group.end : calendarEvent.endHour;
        added = true;
      }
    }

    if (!added) {
      this.groupedEvents.push({ start: calendarEvent.startHour, end: calendarEvent.endHour, events: [calendarEvent] });
    }

    this.sortAndIdEvents();
    this.setEventsPositions();
    this.setHourlyEvents();
  }

  onMouseDown(event: any, calendarEvent: any) {
    if (event.button != 0) {
      return;
    }
    event.preventDefault();
    this.targetEvent = calendarEvent;
    this.targetEvent.prevStartHour = this.targetEvent.startHour;
    this.draggedEventEl = event.target;
    this.draggedEventEl.style.zIndex = 999;
    this.draggedEventEl.style.cursor = 'move';
    this.draggedEventEl.style.marginLeft = '0px';
    this.draggedEventEl.style.width = `${EVENT_MAX_WIDTH}px`;
    this.mouseMoveEvent = this.renderer.listen(this.layoutEl, 'mousemove', this.onMouseMove.bind(this));
    this.draggedEventEl.style.marginTop = '0px';
    this.draggedEventLastPos = this.targetEvent.top;
  }

  onMouseMove(event: any) {
    let posY = event.pageY - this.layoutEl.getBoundingClientRect().top + this.layoutEl.scrollTop;
    posY -= this.draggedEventEl.getBoundingClientRect().height / 2;
    if (this.draggedEventEl) {
      this.draggedEventEl.style.top = `${posY}px`;
      this.draggedEventEl.scrollIntoView({behavior: 'smooth', block: 'end'});
      posY = Math.round(posY);
      if (posY % EVENT_MIN_HEIGHT == 0) {
        this.draggedEventEl.style.top = `${posY}px`;
        let min = ((posY - this.draggedEventLastPos) / EVENT_MIN_HEIGHT) * 15;
        this.targetEvent.startInMin += min;
        this.targetEvent.endInMin = this.targetEvent.startInMin + this.targetEvent.interval;
        this.targetEvent.starts = this.parseTime(this.targetEvent.startInMin);
        this.targetEvent.ends = this.parseTime(this.targetEvent.endInMin);
        this.setEventProperties(this.targetEvent);
        this.draggedEventEl.innerText = `${this.targetEvent.name}\n ${this.targetEvent.duration}`;
        this.draggedEventLastPos = posY;
      }
    }

    if (event.buttons == 0) {
      this.onMouseUp();
    }
  }

  onMouseUp() {
    let newStartHr = Math.round(Math.ceil(this.draggedEventEl.style.top.substring(0, this.draggedEventEl.style.top.length - 2)) / EVENT_MAX_HEIGHT);
    this.targetEvent.startHour = newStartHr;
    this.targetEvent.endHour = Math.round(newStartHr + (this.targetEvent.interval / 60));
    this.changeEventGroup(this.targetEvent);
    this.setDraggedElProperties();
    this.draggedEventEl = undefined;
    this.mouseMoveEvent();
    this.mouseMoveEvent = undefined;
  }

  setDraggedElProperties() {
    this.changeRef.markForCheck();
    this.draggedEventEl.style.cursor = 'pointer';
    this.draggedEventEl.style.marginLeft = `${this.targetEvent.marginLeft}px`;
    this.draggedEventEl.style.zIndex = this.targetEvent.zIndex;
    this.draggedEventEl.style.top = `${this.targetEvent.top}px`;
    this.draggedEventEl.style.width = `${this.targetEvent.width}px`;
    this.draggedEventEl.innerText = `${this.targetEvent.name}\n ${this.targetEvent.duration}`;
  }

  scrollView(posY: any) {
    if (VIEW_HEIGHT < posY) {
      this.layoutEl?.scrollBy(0, 3);
    }

    if (VIEW_HEIGHT > posY) {
      this.layoutEl?.scrollBy(0, -3);
    }
  }
}