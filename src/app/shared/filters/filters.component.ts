import { Component, OnInit, EventEmitter, Input, Output,AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { DataService } from '../../core/services/data.service';
import { filter} from 'lodash';
import * as moment from "moment";
import * as d3 from "d3";

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
    providers: [DataService]
})
export class FiltersComponent implements OnInit, AfterViewInit {

    //show or not
    bFilter: boolean = false;
    @Output() onApply = new EventEmitter();

    //basic data
    data: any = [];
    regions: any = {
    };
    operators: any = {
    };


    //slider
    public sliderVal: number = 10;
    min = 0;
    max = 100;

    //all filter content
    //dateType:  custom , upcoming
    filters: any = {
        region: '',
        operator: '',
        start: '',
        end: '',
        range: '',
        dateType: 'custom'// 'upcoming'
    };

    // text MS error load json
    errorMessage: string;

    constructor(
        private dataService: DataService
    ) { }
    

    /**
     * @method ngOnInit
     */
    public ngOnInit() {
        this.onload();
    }

    public sliderChange() {
        var s = this.sliderVal / this.max * 100 + "%";
        d3.select(".noUi-connects").attr("style", "width:" + s + "; ");
        d3.select(".noUi-handle").attr("style", "right:0px; ");
    }

    public ngAfterViewInit() {
        this.sliderChange();
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

    onChange($event) {
        this.sliderChange();
    }


    initData() {

        this.initMockData();

        //filters select component options
        this.regions = {
            current: "Region Name",
            options: []
        };
        this.operators = {
            current: "All Operators",
            options: ["All Operators"]
        };
        for (let i = 0; i < this.data.length; i++) {
            let bExist = false;
            for (let j = 0; j < this.regions["options"].length; j++) {
                if (this.regions["options"][j] === this.data[i]["well"]) {
                    bExist = true;
                }
            }
            if (!bExist) {
                this.regions["options"].push(this.data[i]["well"]);
            }
            bExist = false;
            for (let j = 0; j < this.operators["options"].length; j++) {
                if (this.operators["options"][j] === this.data[i]["operator"]) {
                    bExist = true;
                }
            }
            if (!bExist) {
                this.operators["options"].push(this.data[i]["operator"]);
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

    //init filters
    initFilter() {
        this.filters = {
            region: '',
            operator: '',
            start: '',
            end: '',
            range: '',
            dateType: 'custom'
        }

        this.regions.current = "Region Name";
        this.operators.current = "All Operators";

        let filtered = this.data;
        this.onApply.emit(filtered);
    }
    

    apply() {
        let filtered = this.data;
        let filters = this.filters;
        if (this.filters.region) {
            filtered = filter(filtered, function (o) {
                return o.well === filters.region;
            });
        }
        if (this.filters.operator) {
            filtered = filter(filtered, function (o) {
                return o.operator === filters.operator;
            });
        }
        if (this.filters.dateType === 'custom') {
            if (this.filters.start || this.filters.end) {
                filtered = filter(filtered, function (o) {
                    
                    if (filters.start && filters.end) {
                        return (new Date(o.start)) >= (new Date(filters.start))
                            && (new Date(o.end)) <= (new Date(filters.end));
                    }
                    else if (!filters.end) {
                        return (new Date(o.start)) >= (new Date(filters.start));
                    }
                    else {
                        return (new Date(o.end)) <= (new Date(filters.end));
                    }

                });
            }
        }
        else if (this.filters.dateType === 'upcoming') {
            this.filters.range = this.sliderVal;
            if (this.filters.range) {
                filtered = filter(filtered, function (o) {
                    let now = new Date(Date.now());
                    let due = new Date();
                    due.setDate(now.getDate() + filters.range);
                    let start = new Date(o.start);
                    return start <= due;
                });
            }
        }
        this.onApply.emit(filtered);
    } 
}
