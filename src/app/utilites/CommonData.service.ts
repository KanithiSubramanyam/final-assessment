import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { userDetails } from "../Model/userDetails";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CommonDataService {

    public databaseUrl = "https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app";
    
    constructor(private http: HttpClient,

    ) { }

    getCurrentUserRole(): Observable<userDetails> {
        const user = JSON.parse(localStorage.getItem('localUser'));
        if (user && user.id) {
            return this.http.get<userDetails>(`${this.databaseUrl}/users/${user.id}.json`);
        } else {
            return of(null); // Return an observable with null if user data is missing
        }
    }
    
}