import { Component, OnInit, ViewChildren, ElementRef, QueryList, HostListener} from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { MouseEvent as AGMMouseEvent } from '@agm/core';
import { max, sortBy } from 'lodash';
import * as moment from 'moment';
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
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [DataService]
})

export class MapComponent implements OnInit {

    data: any = [];
    filtered: any = [];

    // text MS error load json
    errorMessage: string;

    //markers
    markers: marker[] = [];

    // google maps zoom level
    zoom: number = 5;

    // initial center position for the map
    lat: number = 40;
    lng: number = -98;
    styles = [
        {
            elementType: 'geometry',
            stylers: [{ color: '#f0f0ef' }]
        },
        {
            elementType: 'labels',
            stylers: [{ color: '#666666' }]
        },
        {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#ffffff' }]
        },
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#ccd2d3' }]
        },
        {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#ccd2d3' }]
        }];

    mapShow = true;

    //schedule list
    operating = 0;
    operatingRate = '';
    seven = 0;
    sevenRate = '';
    thirty = 0;
    thirtyRate = '';
    sixty = 0;
    sixtyRate = '';
    sixtyPlus = 0;
    sixtyPlusRate = '';

    infoShow = true;

    @ViewChildren('info', { read: ElementRef }) infoChildren: QueryList<ElementRef>;

    constructor(
        private dataService: DataService,
        private store: Store<State>
    ) { }


    goto(route) {
        sessionStorage.setItem('route', '/main/dashboard/' + route);
    }

    ngOnInit() {
        
        if (sessionStorage.getItem('userId') === 'null'
           || !sessionStorage.getItem('userId') ){
            this.store.dispatch(new Go({
                path: ["/sign-in"]
            }));
        }
        sessionStorage.setItem('route', '/main/dashboard/map');

        this.onload();
    }

  


    onload = (): void => {
        this.dataService.getData('assets/data/dashboard.json').subscribe(
            data => {
                this.data = data;
            },
            error => this.errorMessage = <any>error,
            () => this.initData()
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
    //init data
    initData() {
        //mock data
        this.initMockData();
        this.dealMapData(this.data);
    }

    dealMapData(data) {
        this.markers = [];
        for (let i = 0; i < data.length; ++i) {
            let today = new Date(Date.now());
            let start = new Date(data[i].start);
            let end = new Date(data[i].end);
            let labelOptions = {
                color: '#ffffff',
                fontSize: '11px',
                text: '',
            }
            labelOptions.text = data[i].in;
            let item: marker = {
                well: '',
                label: labelOptions,
                draggable: false,
                operator: '',
                start: '',
                end: '',
                duration: 0,
                API: '',
                surfaceLat: 0,
                surfaceLng: 0,
                bottomLat: 0,
                bottomLng: 0,
                TVD: "",
                in: 0,
                status: "",
                progress: "",
                info: "",
                color: "",
                iconUrl: "",
                radius: 0
            };
            item.draggable = false;
            item.well = data[i].well;
            item.operator = data[i].operator;
            item.start = data[i].start;
            item.end = data[i].end;
            item.duration = data[i].duration;
            item.API = data[i].API;
            item.surfaceLat = data[i].surface.lat;
            item.surfaceLng = data[i].surface.lng;
            item.bottomLat = data[i].bottom.lat;
            item.bottomLng = data[i].bottom.lng;
            item.TVD = data[i].TVD;
            item.radius = data[i].radius;
            item.in = data[i].in;
            
            if (item.in < 0) {
                this.operating++;
                item.label.text = " ";
                item.status = "Operating";
                item.progress = Math.floor(Math.abs(item.in) * 100 / item.duration) + "%";
                item.info = item.duration < 2 ? (item.progress +
                    " Completed - " + Math.abs(item.in) + "/" + item.duration + " day") :
                    (item.progress +
                        " Completed - " + Math.abs(item.in) + "/" + item.duration + " days");
                item.color = "#14afa4";
                item.iconUrl = "assets/img/marker-started.png";
            }
            else {
                item.label.text = String(item.in);
                item.status = item.in < 2 ? "Starting in " + item.in + " day" :
                    "Starting in " + item.in + " days";
                item.progress = "0";
                item.info = item.duration < 2 ? ("Not Started - 0/" + item.duration + " day") :
                    ("Not Started - 0/" + item.duration + " days");
                if (item.in >= 0 && item.in <= 7) {
                    this.seven++;
                    item.color = "#ff6600";
                    item.iconUrl = "assets/img/marker-orange.png";
                }
                else if (item.in >= 8 && item.in <= 30) {
                    this.thirty++;
                    item.color = "#ffae00";
                    item.iconUrl = "assets/img/marker-yellow.png";
                }
                else if (item.in >= 31 && item.in <= 60) {
                    this.sixty++;
                    item.color = "#8197f2";
                    item.iconUrl = "assets/img/marker-purple.png";
                }
                else if (item.in > 60) {
                    this.sixtyPlus++;
                    item.color = "#6ec2f7";
                    item.iconUrl = "assets/img/marker-blue.png";
                }                                                                                                                 
            }
            this.markers.push(item);
        }
        let maxx = max([this.operating, this.seven, this.thirty, this.sixty, this.sixtyPlus]);
        this.operatingRate = (this.operating * 100 / maxx) + "%";
        this.sevenRate = (this.seven * 100 / maxx) + "%";
        this.thirtyRate = (this.thirty * 100 / maxx) + "%";
        this.sixtyRate = (this.sixty * 100 / maxx) + "%";
        this.sixtyPlusRate = (this.sixtyPlus * 100 / maxx) + "%";
    }

    onApply(filteredData) {
        this.filtered = sortBy(filteredData, ['well'])
        this.dealMapData(this.filtered);
        this.reshowMap();
    }

    reshowMap() {
        this.mapShow = true;
        setTimeout(function () {
            this.mapShow = false;
        }, 3000);
    }


    mouseOverMarker(i: number) {
        if (this.markers[i].in < 0) {
            this.markers[i].iconUrl = "assets/img/marker-started-hover.png";
        }
        else if (this.markers[i].in >= 0 && this.markers[i].in <= 7) {
            this.markers[i].iconUrl = "assets/img/marker-orange-hover.png";
        }
        else if (this.markers[i].in >= 8 && this.markers[i].in <= 30) {
            this.markers[i].iconUrl = "assets/img/marker-yellow-hover.png";
        }
        else if (this.markers[i].in >= 31 && this.markers[i].in <= 60) {
            this.markers[i].iconUrl = "assets/img/marker-purple-hover.png";
        }
        else if (this.markers[i].in > 60) {
            this.markers[i].iconUrl = "assets/img/marker-blue-hover.png";
        }
    }

    mouseOutMarker(i: number) {
        if (this.markers[i].in < 0) {
            this.markers[i].iconUrl = "assets/img/marker-started.png";
        }
        else if (this.markers[i].in >= 0 && this.markers[i].in <= 7) {
            this.markers[i].iconUrl = "assets/img/marker-orange.png";
        }
        else if (this.markers[i].in >= 8 && this.markers[i].in <= 30) {
            this.markers[i].iconUrl = "assets/img/marker-yellow.png";
        }
        else if (this.markers[i].in >= 31 && this.markers[i].in <= 60) {
            this.markers[i].iconUrl = "assets/img/marker-purple.png";
        }
        else if (this.markers[i].in > 60) {
            this.markers[i].iconUrl = "assets/img/marker-blue.png";
        }
    }
}

// just an interface for type safety.
interface marker {
    well: string;
    label?: any;
    draggable: boolean;
    operator: string;
    start: string;
    end: string;
    duration: number;
    API: string;
    surfaceLat: number;
    surfaceLng: number;
    bottomLat: number;
    bottomLng: number;
    TVD: string;
    in: number;
    status: string;
    progress: string;
    info: string;
    color: string;
    iconUrl: string;
    radius: number;
};
