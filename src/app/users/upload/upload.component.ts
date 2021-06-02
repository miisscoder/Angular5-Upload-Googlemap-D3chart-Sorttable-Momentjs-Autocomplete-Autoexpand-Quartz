import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { FileUploader, FileItem} from 'ng2-file-upload';
import { Location } from '@angular/common';
import { Router } from "@angular/router";
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

// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
    providers: [DataService]
})

export class UploadComponent implements OnInit {

    //basic data
    data: any = [];

    // text MS error load json
    errorMessage: string;

    //for singel upload
    single: any = {
        company: '',
        well: '',
        start: '',
        end: '',
        surfaceLat: '',
        surfaceLong: '',
        bottomholeLat: '',
        bottomholeLong: '',
        TVD: ''
    };

    //auto complete
    list: any[] = [];
    bColor = false;

    public uploader: FileUploader = new FileUploader({ url: URL });
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }

    constructor(
        private dataService: DataService,
        private _location: Location,
        private router: Router,
        private detector: ChangeDetectorRef,
        private store: Store<State>
    ) {

        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
            
        }
        
        this.uploader.onBeforeUploadItem = (fileItem: any) => {
            
        }
    }

    ngOnInit() {
        this.onload();
    }

    initData() {
        for (let i = 0; i < this.data.length; i++) {
            this.list.push(this.data[i]["well"]);
        }
    }

    autoMatch() {
        for (let i = 0; i < this.data.length; i++) {
            if (this.single["well"] === this.data[i]["well"]) {
                this.bColor = true;
                this.single["surfaceLat"] = this.data[i]["surfaceLat"];
                this.single["surfaceLong"] = this.data[i]["surfaceLong"];
                this.single["bottomholeLat"] = this.data[i]["bottomholeLat"];
                this.single["bottomholeLong"] = this.data[i]["bottomholeLong"];
                this.single["TVD"] = this.data[i]["TVD"];
            }
        }
    }

    //load data from json
    onload = (): void => {
        this.dataService.getData('assets/data/well.json').subscribe(
            data => {
                this.data = data;
            },
            error => this.errorMessage = <any>error,
            () => this.initData()
        );
    }

    //clear all
    clear() {
        this.single = {
            company: '',
            well: '',
            start: '',
            end: '',
            surfaceLat: '',
            surfaceLong: '',
            bottomholeLat: '',
            bottomholeLong: '',
            TVD: ''
        };
    }
    //cancel upload and go back
    cancel() {
        this.uploader.queue = [];
    }

    submit() {
        if (this.uploader.queue.length > 0) {
            this.uploader.uploadAll();
        }
    }
    
}
