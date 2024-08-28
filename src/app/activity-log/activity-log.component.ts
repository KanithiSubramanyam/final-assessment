import { Component, OnInit } from '@angular/core';
import { ActivityLog } from '../Model/ActivityLog';
import { ActivityLogService } from '../Services/activityLog.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {

  activityLog: ActivityLog[] = [];
  filteredActivityLog: ActivityLog[] = [];
  pagedActivityLog: ActivityLog[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;
  searchTerm: string = '';

  constructor(private activityLogService: ActivityLogService) {}


  ngOnInit() {
    this.activityLogService.getAllActivity().subscribe(logs => {
      this.activityLog = Object.values(logs);
      this.filteredActivityLog = [...this.activityLog]; // Initialize with all logs
      this.applyFilter(); // Apply the filter when data is first loaded
    });
  }
  
  applyFilter() {
    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      this.filteredActivityLog = this.activityLog.filter(log => 
        (log.email?.toLowerCase().includes(lowerSearchTerm) || '') ||
        (log.role?.toLowerCase().includes(lowerSearchTerm) || '') ||
        (log.action?.toLowerCase().includes(lowerSearchTerm) || '')
      );
    } else {
      this.filteredActivityLog = [...this.activityLog];
    }
  
    this.totalPages = Math.ceil(this.filteredActivityLog.length / this.itemsPerPage);
    this.currentPage = 1;  // Reset to the first page after filtering
    this.updatePagedActivityLog();
  }
  
  

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagedActivityLog();
  }

  updatePagedActivityLog(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedActivityLog = this.filteredActivityLog.slice(startIndex, startIndex + this.itemsPerPage);
  }

  highlightText(text: string): string {
    if (!text) return ''; // If text is undefined or null, return an empty string
    if (!this.searchTerm) return text;
  
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(regex, `<mark>$1</mark>`);
  }
  

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}


