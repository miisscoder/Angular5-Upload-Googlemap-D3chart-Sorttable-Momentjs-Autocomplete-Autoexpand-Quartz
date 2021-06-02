import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { sortBy, reverse, forEach, some, filter, keys, groupBy, map, uniq} from 'lodash';
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
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    providers: [DataService]
})
export class CalendarComponent implements OnInit {

    //basic data
    data: any[] = [];

    //this month and later
    filtered: any[] = [];

    // text MS error load json
    errorMessage: string;

    tableData = [];

    bFilter = false;

    //active index
    index = 0;

    //all dropdown content
    next = {
        current: 90,
        options: [5, 10, 15, 30, 60, 90, 150]
    };

    operators = {
        current: "All Operators",
        options: ["All Operators"]
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
        sessionStorage.setItem('route', '/main/calendar');
        this.onload();
    }

    getMonth(no) {
        let months = ["January", "February", "March", "Mar", "April", "May",
            "June", "July", "August", "September", "October", "November", "December"];
        return months[no - 1];

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

    initData() {
        this.initMockData();
        let today = new Date(Date.now());
        let thisMonth = today.getMonth();
        let thisYear = today.getFullYear();


        //filter
        this.filtered = filter(this.data, function (o) {
            let start = new Date(o.start);
            let startMonth = start.getMonth();
            let startYear = start.getFullYear();
            return (thisMonth === startMonth && thisYear === startYear) ||
                start >= today;
        });

        //operators
        this.operators.options = uniq(map(this.filtered, 'operator'));
        this.getTableData(this.filtered);

    }


    getTableData(filtered) {

        this.tableData = [];

        //group
        let grouped = groupBy(filtered, function (o) {
            let start = new Date(o.start);
            let months = ["January", "February", "March", "April", "May",
                "June", "July", "August", "September", "October", "November", "December"];
            let groupby = months[start.getMonth()] + ' ' + start.getFullYear();
            return groupby;
        });

        let keyGrouped = keys(grouped);

        let sortedGroup = sortBy(grouped, 'start');

        for (let i = 0; i < sortedGroup.length; i++) {
            let start = new Date(sortedGroup[i][0].start);
            let months = ["January", "February", "March", "April", "May",
                "June", "July", "August", "September", "October", "November", "December"];
            let groupby = (i > 1 ? months[start.getMonth()] + ' ' + start.getFullYear()
                : (i === 1 ? "Next Month, " + months[start.getMonth()] + ' ' + start.getFullYear() :
                    "This Month, " + months[start.getMonth()] + ' ' + start.getFullYear()));


            this.tableData.push({
                well: groupby,
                operator: "",
                start: "",
                end: "",
                duration: "",
                API: "",
                surface: {
                    "lat": "",
                    "long": ""
                },
                bottom: {
                    "lat": "",
                    "long": ""
                },
                TVD: "",
                in: "",
                _type: '0'
            });

            for (let j = 0; j < sortedGroup[i].length; j++) {
                let item = sortedGroup[i][j];
                item._type = '1';
                this.tableData.push(item);
            }
        }
    }

    //load data from json 
    onload = (): void => {
        this.dataService.getData('assets/data/dashboard.json').subscribe(
            data => {
                this.data = data;
            },
            error => this.errorMessage = <any>error,
            () => this.initData()
        );
    }

    filter() {
        let sfiltered = this.filtered;
        let nextCurrent = this.next.current;
        if (this.next.current) {
            sfiltered = filter(sfiltered, function (o) {
                let start = new Date(o.start);
                let due = new Date();
                due.setDate(new Date(Date.now()).getDate() + nextCurrent);
                return start <= due;
            });
        }
        let operatorsCurrent = this.operators.current;
        if (this.operators.current !== "All Operators") {
            sfiltered = filter(sfiltered, function (o) {
                return o.operator === operatorsCurrent;
            });
        }
        this.getTableData(sfiltered);
    }
}
