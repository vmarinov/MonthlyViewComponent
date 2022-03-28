import { NgModule, Component, OnInit, OnChanges, SimpleChanges, Inject, ChangeDetectionStrategy } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { TopNavbarComponent } from "./Navigation/topNavbar.component";
import { LeftNavbarComponent } from "./Navigation/leftNavbar.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarComponent } from "./Calendars/calendar.component";
import { MonthlyCalendarComponent } from "./Calendars/monthlyCalendar.component";
import { ContentContainerComponent } from "./Navigation/contentContainer.component";
import { Routes, RouterModule, Router } from "@angular/router";
import { MenuButtonComponent } from "./Navigation/menuButton.component";
import { CalendarEventsService } from "./Services/calendarEventsService.class";
import { WeeklyCalendarComponent } from "./Calendars/weeklyCalendar.component";
import { DailyCalendarComponent } from "./Calendars/dailyCalendar.component";
import { CommonModule } from "@angular/common";
import { CalendarEventSettings } from "./Calendars/calendarEventSettings.component";
import { CallendarEventInfo } from "./Calendars/calendarEventInfo.component";

const routes: Routes = [
  { path: "", component: MonthlyCalendarComponent },
  { path: "day", component: DailyCalendarComponent },
  { path: "week", component: WeeklyCalendarComponent },
  { path: "month", component: MonthlyCalendarComponent },
  { path: "year", redirectTo: '' },
  { path: "schedule", redirectTo: '' },
  { path: "four-days", redirectTo: '' }];

const WEEK_DAYS: string[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS: string[] =
  ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

// ChangeDetection conclusion - app works as intended
@Component({
  selector: "app",
  //changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <top-navbar></top-navbar>
      <left-navbar 
        [personCalendars]="personCalendars" 
        [leftCalendarDate]="leftCalendarDate"
        (dateSelected)="selectDate($event)">
      </left-navbar>
      <content-container></content-container>
  `
})
class AppComponent {
  personCalendars = ['emilia', 'john'];
  leftCalendarDate = new Date();
  selectedDay: any;
  selectedView: any;
  shownEvents: any;

  constructor(private router: Router, @Inject('CalendarEventsService') private calendarEventsService: CalendarEventsService) { }

  selectDate(date: any) {
    this.selectedDay = date;
  }

  changeView(path: any) {
    this.router.navigate(path);
  }
}

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FontAwesomeModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  declarations: [
    AppComponent,
    TopNavbarComponent,
    LeftNavbarComponent,
    CalendarComponent,
    MonthlyCalendarComponent,
    ContentContainerComponent,
    MenuButtonComponent,
    WeeklyCalendarComponent,
    DailyCalendarComponent,
    CalendarEventSettings,
    CallendarEventInfo
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: 'weekDays', useValue: WEEK_DAYS },
    { provide: 'monthNames', useValue: MONTHS },
    { provide: 'CalendarEventsService', useClass: CalendarEventsService }
  ]
})
class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);