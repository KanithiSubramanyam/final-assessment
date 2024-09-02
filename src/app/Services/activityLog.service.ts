import { inject, Injectable } from "@angular/core";
import { ActivityLog } from "../Model/ActivityLog";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { userDetails } from "../Model/userDetails";
import { User } from "../Model/User";

@Injectable({
  providedIn: "root",
})
export class ActivityLogService {
  activityLog: ActivityLog;

  http: HttpClient = inject(HttpClient);


  dataBaseUrl = `https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app`;

  logData: ActivityLog;

  user : User;

  ngOnInit(): void {
     this.user = JSON.parse(sessionStorage.getItem('localUser') || '{}');
  }

  getAllActivity(): Observable<{ [key: string]: ActivityLog }> {
    return this.http
      .get<{ [key: string]: ActivityLog }>(
        `${this.dataBaseUrl}/activityLogs.json`
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  addActivityLog(logData: ActivityLog | string) {
    if (logData instanceof ActivityLog) {
      // console.log("logData is an instance of ActivityLog");
      this.logData = logData;
      this.postLogData();
    } else if (typeof logData === "string") {
      this.getCurrentUser().subscribe((userDetails) => {
        if (userDetails) {
          console.log("activity log added success");
          this.logData = new ActivityLog(
            userDetails.id,
            userDetails.email,
            userDetails.role,
            `${userDetails.email} has ${logData} at ${new Date().toDateString()}`,
            new Date()
          );
          this.postLogData();
        } else {
          console.log("User details could not be fetched.");
        }
      });
    } else {
      console.error("Invalid log data format");
    }
    return of(this.logData);
  }

  private postLogData() {
    this.http
      .post(`${this.dataBaseUrl}/activityLogs.json`, this.logData)
      .subscribe({
        next: () => console.log("Activity logged successfully"),
        error: (error) => console.error("Error logging activity:", error),
      });
  }

  getCurrentUser(): Observable<userDetails | null> {
    if (this.user && this.user.id) {
      return this.http.get<userDetails>(`${this.dataBaseUrl}/users/${this.user.id}.json`);
    } else {
      return of(null);
    }
  }
}
