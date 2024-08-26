import { Component } from '@angular/core';
import { ScheduleModule, ScheduleComponent, EventSettingsModel } from '@syncfusion/ej2-angular-schedule';

@Component({
  selector: 'app-dairy-management',
  standalone: true,
  imports: [ScheduleModule],
  templateUrl: './dairy-management.component.html',
  styleUrl: './dairy-management.component.css'
})
export class DairyManagementComponent {

  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel = {
    dataSource: [] // Your data source for events
  };

  onActionBegin(args: any): void {
    if (args.requestType === 'eventCreate') {
      console.log('Event created:', args.data);
    }
 

  }
}
