import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { sortBy, reverse, forEach, some, filter} from 'lodash';

@Component({
    selector: 'app-checkbox-table',
    templateUrl: './checkbox-table.component.html',
    styleUrls: ['./checkbox-table.component.scss']
})
export class CheckboxTableComponent implements OnChanges {
    @Input() data = []; // table data
    loadData: number = 14;
    sumData: number = 0;
    bCheckAll = false;
    bottom = document.body.scrollHeight;
    sort: any = {
        by: 'start',
        dir: 'asc'
    }; // table sort criteria
    // table configuration
    options: any = {
        type: 'list',
        columns: [
            { title: '', sortable: false, key: 'checkbox', visiable: true, width: '4%' },
            { title: 'Contact Order', sortable: false, key: 'order', visiable: true, width: '10%' },
            { title: 'Name', sortable: false, key: 'name', visiable: true, width: '15%' },
            { title: 'Role', sortable: true, key: 'role', visiable: true, width: '16%' },
            { title: 'Email', sortable: false, key: 'email', visiable: true, width: '20%', style: { 'color': '#0066cc' } },
            { title: 'Phone', sortable: false, key: 'phone', visiable: true, width: '10%' },
            { title: 'Location', sortable: false, key: 'location', visiable: true, width: '12%' },
            { title: '', sortable: false, key: 'btns', visiable: true, width: '13%' },

        ]
    };

    constructor() { }

    /**
     * @method ngOnInit
     */
    public ngOnChanges() {
        this.sumData = this.data.length;
        let load = this.loadData;
        for (let i = 0; i < this.data.length; i++) {
            if (i < load) {
                this.data[i]._visible = true;
            }
            else {
                this.data[i]._visible = false;
            }
            this.data[i]._checked = false;
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

    checkAll() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i]._checked = this.bCheckAll;
        }
    }

}
