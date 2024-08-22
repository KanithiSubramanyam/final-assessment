export class User {

  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public photoURL: string,
    public emailVerified: boolean,
    public role: string,
    public createdAt: Date,
    public lastLoginAt: Date,
    public token: string,
    public passwordLastChangedAt: Date,
    public expiresIn: Date
  ) {}

  
  get tokenData(){
    if(!this.expiresIn || this.expiresIn < new Date()){
        return null;
    }
    return this.token;
  }
}
