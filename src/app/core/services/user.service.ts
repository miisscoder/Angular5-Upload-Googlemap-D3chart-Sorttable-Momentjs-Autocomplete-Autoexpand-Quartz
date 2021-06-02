import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, Response } from '@angular/http';
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import { User } from "../models/user";

export const MOCK_USER = new User();
MOCK_USER._id = "1";
MOCK_USER.userId = "user@user";
MOCK_USER.password = "userhere";
MOCK_USER.passwordconfirm = "";

export const MOCK_ADMIN = new User();
MOCK_ADMIN._id = "1";
MOCK_ADMIN.userId = "admin@admin.com";
MOCK_ADMIN.password = "12345678";
MOCK_ADMIN.passwordconfirm = "";

/**
 * The user service.
 */
@Injectable()
export class UserService {
    /**
     * True if authenticated
     * @type
     */
    private _authenticated = false;


    /**
     * True if member
     * @type string
     */
    public user: Array<any>;
    public userId1: string;
    public password1: string;
    public userId2: string;
    public password2: string;


    /**
     * True if error login
     * @type
     */
    private _errorLogin = false;

    /**
    * ms if new error load json
    * @type {string}
    */
    errorMessage: string;

    /**
     * @constructor
     * @param {Http} http
     */
    constructor(
        private http: Http
    ) {
        /**
       *  load json user
       * @method onload
       */
        this.http.get('assets/data/sign-in.json').map((res: Response) => res.json()).subscribe(data => {
            this.userId1 = data.signin.user.userId;
            this.password1 = data.signin.user.password;

            this.userId2 = data.signin.admin.userId;
            this.password2 = data.signin.admin.password;
        });

    }

    /**
     * Authenticate the user
     *
     * @param {string} userId The user's name
     * @param {string} password The user's password
     * @returns {Observable<User>} The authenticated user observable.
     */
    public authenticate(userId: string, password: string): Observable<User> {
        // Normally you would do an HTTP request to determine to
        // attempt authenticating the user using the supplied credentials.

        if (userId === this.userId1 && password === this.password1) {
            this._authenticated = true;
            return Observable.of(MOCK_USER);
        }
        else if (userId === this.userId2 && password === this.password2) {
            this._authenticated = true;
            return Observable.of(MOCK_ADMIN);
        }


        return Observable.throw(new Error("Invalid email or password"));
    }

    /**
     * Determines if the user is authenticated
     * @returns {Observable<boolean>}
     */
    public authenticated(): Observable<boolean> {
        return Observable.of(this._authenticated);
    }

    /**
     * Returns the authenticated user
     * @returns {User}
     */
    public authenticatedUser(): Observable<User> {
        // Normally you would do an HTTP request to determine if
        // the user has an existing auth session on the server
        // but, let's just return the mock user for this example.

        return Observable.of(MOCK_USER);
    }

    /**
     * Create a new user
     * @returns {User}
     */
    public create(user: User): Observable<User> {
        // Normally you would do an HTTP request to POST the user
        // details and then return the new user object
        // but, let's just return the new user for this example.

        this._authenticated = true;
        return Observable.of(user);

    }

    /**
     * End session
     * @returns {Observable<boolean>}
     */
    public signout(): Observable<boolean> {
        // Normally you would do an HTTP request sign end the session
        // but, let's just return an observable of true.
        this._authenticated = false;

        return Observable.of(true);
    }
}
