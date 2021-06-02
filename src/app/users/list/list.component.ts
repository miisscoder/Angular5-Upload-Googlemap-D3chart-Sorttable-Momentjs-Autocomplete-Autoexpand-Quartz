 import { Component, OnInit } from '@angular/core';
 import { DataService } from '../../core/services/data.service';
 import * as moment from "moment"

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
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [DataService]
})
export class ListComponent implements OnInit {

    //data
    data: any = [];

    //filtered data
    filtered: any = [];

    // text MS error load json
    errorMessage: string;

    constructor(
        private dataService: DataService,
        private store: Store<State>
    ) { }

    ngOnInit() {
        console.log(sessionStorage.getItem('userId'));
        if (sessionStorage.getItem('userId') === 'null'
            || !sessionStorage.getItem('userId')) {
            this.store.dispatch(new Go({
                path: ["/sign-in"]
            }));
        }
        sessionStorage.setItem('route', '/main/dashboard/list');
        this.onload();
    }


    //load data from json
    onload = (): void => {
        this.dataService.getData('assets/data/dashboard.json').subscribe(
            data => {
                this.data = data;
                this.filtered = data;
            },
            error => this.errorMessage = <any>error,
           () => this.initMockData()
        );
    }

    initMockData() {
        for (let i = 0; i < this.data.length; i++) {
            let now = new Date(Date.now());
            let start = now;
            let end = now;
            moment(now).add(this.data[i].in, 'days').format("MM/DD/YY");
            
            this.data[i].start = moment(now).add(this.data[i].in, 'days').format("MM/DD/YY");
            this.data[i].end = moment(end).add(this.data[i].in + this.data[i].duration, 'days').format("MM/DD/YY");
        }

    }

    onApply(filteredData) {
        this.filtered = filteredData;
      
    }

    goto(route) {
        sessionStorage.setItem('route', '/main/dashboard/' + route);
    }
}
