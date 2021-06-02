import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { sortBy, reverse, forEach, some, filter} from 'lodash';

@Component({
    selector: 'app-sort-table',
    templateUrl: './sort-table.component.html',
    styleUrls: ['./sort-table.component.scss']
})
export class SortTableComponent implements OnChanges {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @Input() data = []; // table data
    loadData: number = 15;
    sumData: number = 0;
    bottom = document.body.scrollHeight;
    sort: any = {
        by: 'start',
        dir: 'asc'
    }; // table sort criteria
    // table configuration
    options: any = {
        type: 'list',
        columns: [
            { title: 'Well Name', sortable: false, key: 'well', visiable: true, width: '23%' },
            { title: 'Operator', sortable: false, key: 'operator', visiable: true, width: '7%' },
            { title: 'Frac Start', sortable: true, key: 'start', visiable: true, width: '9%' },
            { title: 'Frac End', sortable: false, key: 'end', visiable: true, width: '9%' },
            { title: 'Duration(d)', sortable: false, key: 'duration', visiable: true, width: '9%', style: {'text-align': 'center'}},
            { title: 'API', sortable: false, key: 'API', visiable: true, width: '12%' },
            { title: 'Surface Lat,Long', sortable: false, key: 'surface', visiable: true, width: '14%', type:'latlong' },
            { title: 'Bottomhole Lat,Long', sortable: false, key: 'bottom', visiable: true, width: '14%', type: 'latlong' },
            { title: 'TVD', sortable: false, key: 'TVD', visiable: true, width: '10%' },
            { title: 'Start in (d)', sortable: false, key: 'in', visiable: true, width: '8%' }
        ]
    };

    constructor() { }

    /**
     * @method ngOnInit
     */
    public ngOnChanges() {
        this.sumData = this.data.length;
        let load = this.loadData;
        for (let i=0; i < this.data.length; i++) {
            if (i < load) {
                this.data[i]._visible = true;
            }
            else {
                this.data[i]._visible = false;
            }
        }
        
    }

    scrollToBottom() {
        window.scrollTo(0, this.bottom);
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

            setTimeout(() => {
                this.scrollToBottom();
            }, 100);
        }
    }
    
}
