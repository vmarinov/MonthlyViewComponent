import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from "@angular/core";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

const HOURS = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
//TODO change how event times work and think of solution for month conflicts

//ChangeDetection conclusions - stopped changing dates in the week
@Component({
    selector: 'weekly-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'weekly_calendar.template.html'
})
export class WeeklyCalendarComponent implements OnDestroy {
    shownDate: any;
    week: any[] = [];
    hours = HOURS;
    events!: any;

    dateSubscription: any;
    eventSubscription: any;

    constructor(@Inject('CalendarEventsService') private calendarEventsService: CalendarEventsService, 
        @Inject('weekDays') public weekDays: any, private changeRef: ChangeDetectorRef) {
        this.dateSubscription = this.calendarEventsService.dateShown$.subscribe((date: any) => {
            this.shownDate = date;
            this.setWeek();
            this.changeRef.detectChanges();
        });

        this.eventSubscription = this.calendarEventsService.eventsShown$.subscribe((events: any) => {
            this.events = events;
            if (this.events) {
                this.events.forEach((element: any) => {
                    Object.assign(element,
                        {
                            interval: Math.abs(element.ends.substring(0, 2) - element.starts.substring(0, 2)) + 1,
                            startTime: element.starts.substring(0, 2)
                        })
                });
                this.changeRef.detectChanges();
            }
        });
    }

    ngOnDestroy(): void {
        this.dateSubscription.unsubscribe();
        this.eventSubscription.unsubscribe();
    }

    setWeek() {
        this.week = [];
        for (let i = 1; i <= 7; i++) {
            this.shownDate.setDate(this.shownDate.getDate() + 1);
            this.week.push(this.shownDate.getDate());
        }
    }
}