export class userDetails {
  constructor(
    public id: string = '',
    public firstName: string = '',
    public lastName: string = '',
    public email: string = '',
    public password: string = '',
    public address: string = '',
    public gender: string = '',
    public phone: string = '',
    public photoUrl: any = '',
    public emailVerified: boolean = false,
    public role: string = 'user',
    public passwordLastChangedAt: Date = new Date(),
    public createdAt: Date = new Date(),
    public lastLoginAt: Date = new Date(),
    public mfaBtn : boolean = false,
    public mfaSecertKey : string = '',
    public name?: string
  ) {}
}
