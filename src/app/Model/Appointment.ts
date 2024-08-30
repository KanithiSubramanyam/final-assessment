export class Appointment {
    id?: string;
    title: string;
    description : string;
    startDateTime: Date;
    endDateTime: Date;
    location: string;
    attendees : string[];
    recurrence : 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
    customer: string;
    customerEmail: string;
    userName: string;
    userEmail: string;
}