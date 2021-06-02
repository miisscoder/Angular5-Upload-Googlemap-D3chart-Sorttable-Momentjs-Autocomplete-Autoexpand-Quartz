import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

// @ngrx
import { Store } from "@ngrx/store";

// actions
import { SignOutAction } from "../../users/users.actions";

// go
import { Go } from "../../actions/router";

// reducers
import {
    getAuthenticatedUser,
    State
} from "../../reducers";

@Component({
    selector: 'app-side',
    templateUrl: './side.component.html',
    styleUrls: ['./side.component.scss']
})
export class SideComponent implements OnInit {


    constructor(private store: Store<State>
    ) { }

    /**
     * @method ngOnInit
     */
    public ngOnInit() {
    }

    goto(route) {
        sessionStorage.setItem('route', route);
    }

    /**
     * Sign out.
     * @method home
     */
    public signOut() {
        sessionStorage.setItem('userId', 'null');
        sessionStorage.setItem('password', 'null');
        sessionStorage.setItem('route', '');
        this.store.dispatch(new SignOutAction());
        this.store.dispatch(new Go({
            path: ["/sign-in"]
        }));
    }
}
