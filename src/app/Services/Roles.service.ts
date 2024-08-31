import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'

})
export class RolesService {
    public static readonly ADMIN = 'ADMIN';
    public static readonly USER = 'USER';
    public static readonly ACCOUNTMANAGER = 'ACCOUNTMANAGER'

    getRoles() {
        return [RolesService.ADMIN, RolesService.USER, RolesService.ACCOUNTMANAGER];
    }
}