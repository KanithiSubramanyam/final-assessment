import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  sortByField<T>(data: T[], field: string, direction: 'asc' | 'desc'): T[] {
    return data.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }
}
