import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { userDetails } from "../Model/userDetails";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

  public databaseUrl = "https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app";
  private user: userDetails | null = null;

  constructor(private http: HttpClient) {
    this.loadUserFromsessionStorage();
  }

  private loadUserFromsessionStorage(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedUser = sessionStorage.getItem('localUser');
      this.user = storedUser ? JSON.parse(storedUser) : null;
    } else {
      console.warn('sessionStorage is not available.');
      this.user = null;
    }
  }

  getCurrentUser(): Observable<userDetails | null> {
    if (this.user && this.user.id) {
      return this.http.get<userDetails>(`${this.databaseUrl}/users/${this.user.id}.json`);
    } else {
      return of(null);
    }
  }
}
