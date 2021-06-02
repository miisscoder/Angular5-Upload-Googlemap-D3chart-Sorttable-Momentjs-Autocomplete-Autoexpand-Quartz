import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { sortBy, reverse, forEach, some, filter} from 'lodash';

@Component({
    selector: 'app-calendar-table',
    templateUrl: './calendar-table.component.html',
    styleUrls: ['./calendar-table.component.scss']
})
export class CalendarTableComponent implements OnChanges {
    @Input() data = []; // table data
    @Input() sumData: number = 0;
    loadData: number = 16;
    bCheckAll = false;
    bottom = document.body.scrollHeight;
    sort: any = {
        by: 'start',
        dir: 'asc'
    };

    // table sort criteria
    // table configuration
    options: any = {
        type: 'list',
        columns: [
            { title: 'Well Name', sortable: false, key: 'well', visiable: true, width: '27%' },
            { title: 'Frac Start', sortable: false, key: 'start', visiable: true, width: '10%' },
            { title: 'Frac End', sortable: true, key: 'end', visiable: true, width: '10%' },
            { title: 'Duration(d)', sortable: false, key: 'duration', visiable: true, width: '22%', style: { 'text-align': 'center' } },
            { title: 'API', sortable: false, key: 'API', visiable: true, width: '20%' },
            { title: 'Operator', sortable: false, key: 'operator', visiable: true, width: '13%' },
        ]
    };

    constructor() { }

    /**
     * @method ngOnChange
     */
    public ngOnChanges() {
        let load = this.loadData;

        for (let i = 0; i < this.sumData; i++) {
            if (i < load) {
                this.data[i]._visible = true;
            }
            else {
                this.data[i]._visible = false;
            }
        }
    }


    /**
     * when click on sortable column header
     * @param {object} column the column to sort
     */
    onSort(column) {
        this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
        this.sortDetails();
    }

    /**
     * attendee list will be totally fetched, thus sort should be handled at front end
     */
    sortDetails() {
        let sorted = sortBy(this.data, this.sort.by);
        if (this.sort.dir === 'desc') {
            sorted = reverse(this.data);
        }
        this.data = sorted;
    }


    scrollToBottom() {
        window.scrollTo(0, this.bottom);
    }


    onScrollDown() {
        if (this.loadData < this.data.length) {
            this.loadData += 14;
            for (let i = 0; i < this.data.length; i++) {
                if (i < this.loadData) {
                    this.data[i]._visible = true;
                }
                else {
                    this.data[i]._visible = false;
                }
            }
        }
    }


    
}
