import { HttpClientModule, HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../Model/User";
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root'
})

export class AuthService{

    isAuthenticated: boolean = false;
    http : HttpClient = inject(HttpClient);
    user = new BehaviorSubject<User>(null);
    router : Router = inject(Router);

    private passwordLastChanged: Date = new Date();

    signUp(user : User){
        //   console.log('Sign up data', this.user.value);
        //   // Log the User object to the console
        //   alert('Sign up successful');

         return this.http.post('https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json',user)
          .subscribe(responseData => {
            console.log('Sign up data', user);
            // Log the User object to the console
            alert('Sign up successful');
            this.router.navigate(['/login']);
          })    
    }

    logIn(email: string, password: string){
        this.http.get<{ [key: string]: User }>('https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json')
        .subscribe(users => {
            let userFound = false;
            for (let key in users) {
                const user = users[key];
                if (user.email === email && user.password === password) {
                    console.log('Login successful', user);
                    alert('Login successful');
                    userFound = true;
                    this.router.navigate(['/dashboard']);
                    break;
                }
            }
            if (!userFound) {
                console.log('Invalid credentials');
                alert('Invalid credentials');
            }
        });
    }


    checkPasswordExpiration(): boolean {
        const expirationPeriod = 90;
        const currentDate = new Date();
        const daysSinceChange = Math.floor((currentDate.getTime() - this.passwordLastChanged.getTime()) / (1000 * 60 * 60 * 24));
    
        return daysSinceChange >= expirationPeriod;
      }
      
      notifyPasswordExpiration() {
        if (this.checkPasswordExpiration()) {
          alert('Your password has expired. Please change it immediately.');
          // Redirect to password change page
        }
      }
      
}