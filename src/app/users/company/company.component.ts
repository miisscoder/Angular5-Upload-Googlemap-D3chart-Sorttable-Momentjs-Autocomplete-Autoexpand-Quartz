import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
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
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss'],
    providers: [DataService]
})
export class CompanyComponent implements OnInit {

    //basic data
    data: any = [];

    // text MS error load json
    errorMessage: string;

    members = [];

    bFilter = false;

    //active index
    index = 0;

    //all contacts content
    contact: any = {
        order: '',
        no: '',
        name: '',
        email: '',
        phone: '',
        city: '',
        state: ''
    };

    constructor(
        private dataService: DataService,
        private store: Store<State>
    ) { }

    ngOnInit() {
        if (sessionStorage.getItem('userId') === 'null'
            || !sessionStorage.getItem('userId')) {
            this.store.dispatch(new Go({
                path: ["/sign-in"]
            }));
        }
        sessionStorage.setItem('route', '/main/company');
        this.onload();
    }
    
    initData() {
        for (let i = 0; i < this.data.length; i++) {
            if (i === 0) {
                this.data[i]._active = true;
                this.members = this.data[i].items;
            } else {
                this.data[i]._active = false;
            }
            this.data[i]._expand = false;
        }
    }

    //load data from json
    onload = (): void => {
        this.dataService.getData('assets/data/companies.json').subscribe(
            data => {
                this.data = data;
            },
            error => this.errorMessage = <any>error,
            () => this.initData()
        );
    }

    company(index) {
        this.members = this.data[index].items;
        for (let i = 0; i < this.data.length; i++) {
            this.data[i]._active = false;
        }
        this.data[index]._active = true;
    }

    onClose($event) {
        this.bFilter = false;
    }

    onSubmit(contact) {
        this.contact = contact;
        this.members.push(this.contact);
    }
}
