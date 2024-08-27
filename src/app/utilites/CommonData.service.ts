import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { userDetails } from "../Model/userDetails";
import { Observable, of } from "rxjs";
import { User } from "../Model/User";

@Injectable({
    providedIn: 'root'
})
export class CommonDataService {

    public databaseUrl = "https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app";
    user : User = JSON.parse(localStorage.getItem('localUser'));

    constructor(private http: HttpClient,

    ) { }

    getCurrentUser(): Observable<userDetails> {
        if (this.user && this.user.id) {
            return this.http.get<userDetails>(`${this.databaseUrl}/users/${this.user.id}.json`);
        } else {
            return of(null);
        }
    }
}
    