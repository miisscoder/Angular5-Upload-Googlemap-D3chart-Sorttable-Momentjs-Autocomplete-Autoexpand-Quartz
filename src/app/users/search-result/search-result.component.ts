import { Component, OnInit } from '@angular/core';

// @ngrx
import { Store } from '@ngrx/store';
// reducers
import {
    getAuthenticationError,
    getAuthenticatedUser,
    isAuthenticated,
    isGetRole,
    isAuthenticationLoading,
    State
} from '../../reducers';
import { Go } from "../../actions/router";

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {


    constructor(
        private store: Store<State>
    ) { }

    ngOnInit() {
        if (sessionStorage.getItem('userId') === 'null'
            || !sessionStorage.getItem('userId')) {
            this.store.dispatch(new Go({
                path: ["/sign-in"]
            }));
        }
        sessionStorage.setItem('route', '/main/result');
    }      
}
