import { ChangeDetectionStrategy, Component, Inject, Input } from "@angular/core";
import { CalendarEventsService } from "src/Services/calendarEventsService.class";

//ChangeDetection conclusions - both Monthly and Weekly views did not change dates of month/week, no events shown
@Component({
    selector: 'content-container',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'content_container.template.html'
})
export class ContentContainerComponent {}