export class User {
    constructor(
        public id: string,
        public firstname: string,
        public lastname: string,
        public email: string,
        public status: number,
        public country: string,
        public phone: string,
        public profile_pic: string,
        public flag: string,
        private _token: string,
        private _tokenExpiration: Date
    ) {}

    get token() {
        if(!this._tokenExpiration || this._tokenExpiration <= new Date()) {
            return null;
        }
        return this._token;
    }

    get tokenDuration() {
        if(!this.token) {
            return 0;
        }
        return this._tokenExpiration.getTime() - new Date().getTime();
    }
    
}