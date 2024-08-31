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
  itemsPerPageOptions = [10, 20, 30, 50]; // Options for items per page

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
    const totalPagesToShow = 3;
    const pages: number[] = [];
  
    if (this.totalPages <= totalPagesToShow * 2 + 1) {
      // If total pages are less than the combined visible pages, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPages = [];
      const endPages = [];
      let middlePages = [];
  
      if (this.currentPage <= totalPagesToShow) {
        // Near the start of the pagination
        for (let i = 1; i <= totalPagesToShow + 1; i++) {
          startPages.push(i);
        }
        middlePages.push(-1); // Indicating ellipsis
      } else if (this.currentPage >= this.totalPages - totalPagesToShow) {
        // Near the end of the pagination
        middlePages.push(-1); // Indicating ellipsis
        for (let i = this.totalPages - totalPagesToShow; i <= this.totalPages; i++) {
          endPages.push(i);
        }
      } else {
        // Somewhere in the middle
        middlePages.push(-1); // Indicating ellipsis before middle pages
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          middlePages.push(i);
        }
        middlePages.push(-1); // Indicating ellipsis after middle pages
      }
  
      // Always include the first and last pages
      pages.push(1, ...startPages, ...middlePages, ...endPages, this.totalPages);
    }
  
    return pages.filter((page, index, array) => array.indexOf(page) === index); // Remove duplicates
  }
}