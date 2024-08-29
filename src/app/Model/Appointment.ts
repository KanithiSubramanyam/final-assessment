export class Appointment {
    id: number;
    title: string;
    description : string;
    startDate: Date;
    endDate: Date;
    location: string;
    attendes : string[];
    recurrence : 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
    clientName: string;
    clientEmail: string;
}