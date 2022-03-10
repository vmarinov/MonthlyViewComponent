import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

// ChangeDetection conclusions - works as intended
@Component({
    selector: "menu-button",
    // changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<button class="top-nav-viewSelect-btn" (click)="toggleMenu()">
                    {{ selectedView[0].name }} <fa-icon [icon]="faSortDown"></fa-icon>
                </button>
                <div *ngIf="showMenuItems" class="view-menu">
                    <div *ngFor="let item of items" class="view-menu-item" [routerLink]="[item.path]" (click)="selectView(item)"> 
                        <span class="view-menu-item-name">{{ item.name }}</span>
                        <span class="view-menu-item-shortcut">{{ item.shortcut }}</span>
                    </div>
                </div>`
})
export class MenuButtonComponent {
    @Input() items!: any;
    @Input() selectedView!: any;
    @Output() selectedViewChange: EventEmitter<any> = new EventEmitter<any>();

    showMenuItems: boolean = false;
    faSortDown = faSortDown;

    toggleMenu() {
        this.showMenuItems = !this.showMenuItems;
    }

    selectView(menuItem: any) {
        this.selectedView[0] = menuItem;
        this.toggleMenu();
    }
}