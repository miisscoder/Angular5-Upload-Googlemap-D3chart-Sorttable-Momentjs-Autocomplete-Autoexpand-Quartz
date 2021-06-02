import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot } from "@angular/router";

// import rxjs
import { Observable } from "rxjs/Observable";

// import @ngrx
import { Store } from "@ngrx/store";


import { Go } from "../actions/router";

import { Router } from "@angular/router";

// reducers
import {
    isAuthenticated,
    State
} from "../reducers";

/**
 * Prevent unauthorized activating and loading of routes
 * @class AuthenticatedGuard
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate, CanLoad {

    /**
     * @constructor
     */
    constructor(
        public router: Router,
        private store: Store<State>
    ) { }

    /**
     * True when user is authenticated
     * @method canActivate
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        // get observable
        const observable = this.store.select(isAuthenticated);

        // redirect to sign in page if user is not authenticated
        observable.subscribe(authenticated => {

            if (!authenticated) {
                    this.store.dispatch(new Go({
                        path: ["/sign-in"]
                    }));
            }
        });

        return observable;
    }

    /**
     * True when user is authenticated
     * @method canLoad
     */
    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        // get observable
        const observable = this.store.select(isAuthenticated);

        // redirect to sign in page if user is not authenticated
        observable.subscribe(authenticated => {
            if (!authenticated) {
                this.store.dispatch(new Go({
                    path: ["/sign-in"]
                }));
            }
        });

        return observable;
    }
}
