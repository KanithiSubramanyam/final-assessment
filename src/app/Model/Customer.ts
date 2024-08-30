export class Customer {
    constructor(
    public id: string='',
    public firstName: string='',
    public lastName: string='',
    public email: string='',
    public phone: string='',
    public address: string='',
    public city: string='',
    public state: string='',
    public zip: string='',
    public country: string='',
    public createdDate: Date = new Date(),
    public updatedAt: string=''
    ){

    }
}