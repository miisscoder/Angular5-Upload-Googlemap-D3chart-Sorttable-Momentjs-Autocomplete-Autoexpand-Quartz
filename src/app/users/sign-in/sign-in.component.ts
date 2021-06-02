import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// @ngrx
import { Store } from '@ngrx/store';

import { DataService } from '../../core/services/data.service';

import { Cookie } from 'ng2-cookies/ng2-cookies';


import { Go } from '../../actions/router';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeWhile';

// actions
import { AuthenticateAction } from '../users.actions';

// reducers
import {
    getAuthenticationError,
    getAuthenticatedUser,
    isAuthenticated,
    isGetRole,
    isAuthenticationLoading,
    State
} from '../../reducers';


// models
import { User } from '../../core/models/user';

/**
 * /users/sign-in
 * @class SignInComponent */

@Component({
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})

export class SignInComponent implements OnDestroy, OnInit {
    public userIdValue = 'user@user';
    public  passwordValue = 'userhere';

    // the authenticated user
    public user: Observable<User>;

    /**
     * The error if authentication fails.
     * @type {Observable<string>}
     */
    public error: Observable<string>;

    /**
     * True if the authentication is loading.
     * @type {boolean}
     */
    public loading: Observable<boolean>;


    /**
     * True if the authentication is loading.
     * @type {number}
     */
    public role: Observable<number>;

    /**
     * The authentication form.
     * @type {FormGroup}
     */
    public form: FormGroup;

    /**
     * Component state.
     * @type {boolean}
     */
    private alive = true;
    

    /**
     * resetPass user.
     * @type {boolean}
     */
    resetPass = false;

    /**
    * init name show json page
    * @type {string}
    */
    jsonTitle: string;
    jsonUserName: string;
    jsonPassword: string;
    jsonSubmit: string;

    /**
    * ms if new error load json
    * @type {string}
    */
    errorMessage: string;

    /**
     * @constructor
     * @param {FormBuilder} formBuilder
     * @param {Store<State>} store
     */
    constructor(
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private store: Store<State>
    ) { }

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * @method ngOnInit
     */
    public ngOnInit() {
        // load json init
        this.onload();

        // init ms change pass
        this.resetPass = false;

        // get change pass
        if (Cookie.get('reset') == 'done') {
            this.resetPass = true;

        }

        // off ms change pass
        setTimeout(() => {
            this.resetPass = false;
            Cookie.set('reset', '');
        }, 2000);

        // set formGroup
        this.form = this.formBuilder.group({
            userId: ['user@user', Validators.required],
            password: ['userhere', Validators.required]
        });
        this.form.valueChanges
            .filter(data => this.form.valid)
            .subscribe(data => console.log(JSON.stringify(data)));
        // set error
        this.error = this.store.select(getAuthenticationError);
        // set loading
        this.loading = this.store.select(isAuthenticationLoading);

        // check role login
        this.store.select(isGetRole).subscribe(value => {
            if (value === 0 &&
                 sessionStorage.getItem('userId') !== 'null'
                && sessionStorage.getItem('userId')
            ) {
                console.log(value);
                console.log(sessionStorage.getItem('userId'));
                
                // dispatch AuthenticationAction and pass in payload
                const payload = {
                    userId: sessionStorage.getItem('userId'),
                    password: sessionStorage.getItem('password')
                };
                this.store.dispatch(new AuthenticateAction(payload));
              
            }
            // if role === 1 'user'
            else if (value === 1) {
                this.store.dispatch(new Go({
                    path: [sessionStorage.getItem('route') ?
                        sessionStorage.getItem('route') : '/main/dashboard/map']
                }));
            }
            // if role === 2 'admin'
            else if (value === 2) {
                this.store.dispatch(new Go({
                    path: [sessionStorage.getItem('route') ?
                        sessionStorage.getItem('route') : '/main/dashboard/map']
                }));
            }

        });
    }
     
    /**
     *  load json file
     * @method onload
     */
    onload = (): void => {
        this.dataService.getData('assets/data/sign-in.json').subscribe(
            data => {
                this.jsonTitle = data.signin.elements.pageTitle.title;
                this.jsonUserName = data.signin.elements.username.hint;
                this.jsonPassword = data.signin.elements.password.hint;
                this.jsonSubmit = data.signin.elements.submit.title;
            },
            error => this.errorMessage = <any>error
        );
    }

    /**
     *  Lifecycle hook that is called when a directive, pipe or service is destroyed.
     * @method ngOnDestroy
     */
    public ngOnDestroy() {
        this.alive = false;
    }

    /**
     * To to the sign up page.
     * @method signUp
     */
    public signUp() {
        this.store.dispatch(new Go({
            path: ['/sign-up']
        }));
    }

    /**
     * Submit the authentication form.
     * @method submit
     */
    public submit() {
        // get email and password values
        const userId: string = this.form.get('userId').value;
        const password: string = this.form.get('password').value;

        // trim values
        userId.trim();
        password.trim();
        // set payload
        const payload = {
            userId: userId,
            password: password
        };
        // dispatch AuthenticationAction and pass in payload
        this.store.dispatch(new AuthenticateAction(payload));
        sessionStorage.setItem('route','/main/dashboard/map');
    }
}
