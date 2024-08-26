import { Component } from '@angular/core';
import { ActivityLog } from '../Model/ActivityLog';
import { ActivityLogService } from '../Services/activityLog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.css'
})
export class ActivityLogComponent {

  activityLog: ActivityLog[] = [];

  pagedActivityLog: ActivityLog[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;

  constructor(private activityLogService: ActivityLogService) {
    this.activityLogService.getAllActivity().subscribe(logs => {
      this.activityLog = Object.values(logs);
      this.totalPages = Math.ceil(this.activityLog.length / this.itemsPerPage);
      this.setPage(1);
    });
  }
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    this.pagedActivityLog = this.activityLog.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}
