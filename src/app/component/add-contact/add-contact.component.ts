import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { FileUploader } from 'ng2-file-upload';


// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';


@Component({
    selector: 'app-add-contact',
    templateUrl: './add-contact.component.html',
    styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnChanges {

    //show or not
    @Input() bFilter: boolean;
    @Output() onClose = new EventEmitter();
    @Output() onSubmit = new EventEmitter();
    
    orders = {
        current: "Select",
        options: [1, 2, 3, 4, 5, 6, 7, 8]
    };
    states = {
        current: "Select",
        options: ["state-1", "state-2", "state-3", "state-4"]
    };
    

    //all contacts content
    contact: any = {
        order: '',
        no:'',
        name: '',
        email: '',
        phone: '',
        city: '',
        state: ''
    };

    // text MS error load json
    errorMessage: string;

    constructor(
    ) { }

    public uploader: FileUploader = new FileUploader({ url: URL });
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }

    /**
     * @method ngOnChange
     */
    public ngOnChanges() {
    }

    close() {
        this.bFilter = false;
        this.contact = {
            order: '',
            no: '',
            name: '',
            email: '',
            phone: '',
            city: '',
            state: ''
        };
        this.onClose.emit(null);
    }

    submit() {
        this.contact["order"] = URL + this.uploader.queue[0].file.name;
        if (this.orders.current != "Select") {
            this.contact["order"] = this.orders.current;
        }
        if (this.states.current != "Select") {
            this.contact["state"] = this.states.current;
        }
        this.onSubmit.emit(this.contact);
        this.bFilter = false;
    }
}
