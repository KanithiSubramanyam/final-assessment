export class User {

  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public address : string,
    public gender : string,
    public phone : string,
    public photoURL: string,
    public emailVerified: boolean,
    public role: string,
    public createdAt: Date,
    public lastLoginAt: Date,
    public _token: string,
    // private token: string,
    public passwordLastChangedAt: Date,
    public _expiresIn: Date
  ) {}

  get token(){
    if(!this._expiresIn || this._expiresIn < new Date()){
        return null;
    }
    return this._token;
  }
  
}
