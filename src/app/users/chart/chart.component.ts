import { Component, OnInit,  HostListener, OnDestroy } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import * as d3 from 'd3';
import * as _ from 'lodash';
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
import { Go } from '../../actions/router';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    providers: [DataService]
})

export class ChartComponent implements OnInit, OnDestroy {

    // user profile
    data: any = [];

    //private chart: AmChart;

    dataChart: any = [];
    showChartt: boolean = true;

    //filtered data
    filtered: any = [];

    // text MS error load json
    errorMessage: string;

    event: MouseEvent;
    clientX = 0;
    clientY = 0;

    constructor(
        private dataService: DataService,
        private store: Store<State>
    ) { }

    ngOnInit() {
        console.log(sessionStorage.getItem('userId'));
        if (sessionStorage.getItem('userId') === 'null'
            || !sessionStorage.getItem('userId')) {
            this.store.dispatch(new Go({
                path: ['/sign-in']
            }));
        }
        sessionStorage.setItem('route', '/main/dashboard/chart');
        this.timeDomainStart = d3.timeDay.offset(new Date(), -3);
        this.timeDomainEnd = d3.timeHour.offset(new Date(), +3);
        this.onload();
    }
    ngOnDestroy() {
        d3.select('.info-box').remove();
    }

    @HostListener('click', ['$event.target'])
    onClickBtn(event) {
        var html = d3.select(event).html();
        if (html) {
            d3.select('#t').remove();
            d3.selectAll('rect')
                .attr('stroke', '#cccccc')
                .attr('stroke-width', '0');
        }
    }

    onApply(filteredData) {
        d3.select('.chartsvg').remove();
        for (let i = 0; i < filteredData.length; i++) {
            filteredData[i].start = new Date(filteredData[i].start);
            filteredData[i].end = new Date(filteredData[i].end);
        }

        this.gantt(filteredData);
    }


    initData(data) {
        this.initMockData();
        for (let i = 0; i < data.length; i++) {
            data[i].start = new Date(data[i].start);
            data[i].end = new Date(data[i].end);
        }
        this.gantt(data);
    }

    initMockData() {
        for (let i = 0; i < this.data.length; i++) {
            let now = new Date(Date.now());
            let start = now;
            let end = now;
            moment(now).add(this.data[i].in, 'days').format('MM/DD/YY');
            this.data[i].start = moment(now).add(this.data[i].in, 'days').format('MM/DD/YY');
            this.data[i].end = moment(end).add(this.data[i].in + this.data[i].duration, 'days').format('MM/DD/YY');
        }
    }
    
    onload = (): void => {
        this.dataService.getData('assets/data/dashboard.json').subscribe(
            data => {
                this.data = data;
            },
            error => this.errorMessage = <any>error,
            () => this.initData(this.data)
        );
    }

    goto(route) {
        sessionStorage.setItem('route', '/main/dashboard/' + route);
    }

    FIT_TIME_DOMAIN_MODE = 'fit';
    FIXED_TIME_DOMAIN_MODE = 'fixed';

    margin = {
        top: 40,
        right: 40,
        bottom: 20,
        left: 250
    };
    selector = '.chartbox';
    timeDomainStart;
    timeDomainEnd;
    timeDomainMode = this.FIT_TIME_DOMAIN_MODE; // fixed or fit
    taskTypes = [];
    yrange = [];
    times = [];
    xrange = [];
    taskStatus = [];
    height = document.body.clientHeight - this.margin.top - this.margin.bottom - 5;
    width = document.body.clientWidth - 30 - 50;
    tickFormat = '%m/%d/%Y';

    x = d3.scaleTime().domain([this.timeDomainStart, this.timeDomainEnd])
        .range([0, this.width]);
    y = d3.scaleLinear().domain([0, this.height * 1 / 4, this.height * 2 / 4,
        this.height * 3 / 4, this.height]).range(this.taskTypes);
    xAxis = d3.axisTop().scale(this.x).tickFormat(d3.timeFormat(this.tickFormat))
        .tickSize(0).tickPadding(30);
    yAxis = d3.axisLeft().scale(this.y).tickSize(0)
        .tickFormat(function (d) {
            return d + 'MMMM';
        });

    keyFunction = function (d) { return d.start + d.well + d.end; };

    initYrange(data) {
        this.taskTypes = _.map(data, 'well');
        for (let i = 0; i < this.taskTypes.length; i++) {
            this.yrange.push(30 * i);
        }
    }

    initXrange(data) {
        let now = new Date(Date.now());
        this.times = _.map(data, 'end');
        let timessort = this.times.length > 1 ? _.sortBy(this.times, function (a, b) {
            return (new Date(a)) > (new Date(b));
        }) : this.times;

        this.xrange = [];

        this.xrange.push(moment(now).format('M/D/Y'));
        let t = (new Date(timessort[timessort.length - 1])).getTime() - Date.now();
        let i = 0;
        while (++i < 11) {
            let tt = new Date(now.getTime() + i * t / 10);
            var format = moment(tt).format('M/D/Y');
            this.xrange.push(format);
        }
    }

    initTimeDomain(data) {
        if (this.timeDomainMode === this.FIT_TIME_DOMAIN_MODE) {
            if (data === undefined || data.length < 1) {
                this.timeDomainStart = moment(new Date()).add(-3, 'days');
                this.timeDomainEnd = moment(new Date()).add(+3, 'days');
                return;
            }
            data.sort(function (a, b) { return b.end - a.end; });
            this.timeDomainEnd = data[0].end;
            data.sort(function (a, b) { return a.start - b.start; });
            this.timeDomainStart = new Date(Date.now());
        }
    };

    initAxis() {
        var _th = this;
        this.x = d3.scaleTime()
            .domain([this.timeDomainStart,
                this.timeDomainEnd])
            .range([0, this.width - 300]).clamp(true);
        this.y = d3.scaleOrdinal()
            .domain(this.taskTypes)
            .range(this.yrange);
        this.xAxis = d3.axisTop()
            .scale(this.x)
            .tickFormat(d3.timeFormat(this.tickFormat))
            .ticks(10).tickSize(0).tickPadding(15);
        this.yAxis = d3.axisLeft()
            .scale(this.y)
            .tickSize(0);
    };

    initTablebg(chartData) {
        let titles = d3.select('.titles');

        //clear
        d3.select('.bg').selectAll('.td').select('div').remove();
        d3.select('.bg-table')
            .selectAll('.tr').remove();
        d3.select('.titles').selectAll('.titlebox').remove();

        //x axis
        let i = 0;
        let xbg = d3.select('.bg');
        do {
            xbg.select('.td-' + i)
                .append('div')
                .text(this.xrange[i])
                .attr('style', 'position:absolute;left:-10px;top:12px;');
        } while (++i < 11);

        for (let i = 0; i < chartData.length; ++i) {
            let tr = d3.select('.bg-table')
                .append('div')
                .attr('class', 'tr flex start');
            let loop = 0;
            while (loop++ < 11) {
                if (loop === 1) {
                    tr.append('div')
                        .attr('class', 'x');
                }
                else {
                    tr.append('div')
                        .attr('class', 'td');
                }
            }

            //y axis
            var titlebox = titles.append('div')
                .attr('class', 'titlebox flex space-between center');
            titlebox.append('div')
                .attr('class', 'well')
                .text(chartData[i].well);
            var numImg = titlebox.append('div')
                .attr('class', 'numImg');
            var today = new Date(Date.now());
            var start = new Date(chartData[i].start);
            var inn = chartData[i].in;
            if (inn < 0) {
                numImg.append('img').attr('src', 'assets/img/marker-started.png');
            }
            else if (inn >= 0 && inn <= 7) {
                numImg.append('img').attr('src', 'assets/img/marker-orange.png');
                numImg.append('div').attr('class', 'num').text(inn);
            }
            else if (inn >= 8 && inn <= 30) {
                numImg.append('img').attr('src', 'assets/img/marker-yellow.png');
                numImg.append('div').attr('class', 'num').text(inn);
            }
            else if (inn >= 31 && inn <= 60) {
                numImg.append('img').attr('src', 'assets/img/marker-purple.png');
                numImg.append('div').attr('class', 'num').text(inn);
            }
            else if (inn > 60) {
                numImg.append('img').attr('src', 'assets/img/marker-blue.png');
                numImg.append('div').attr('class', 'num').text(inn);
            }
        }
    }
    

    onMouseenter(event) {
        var today = new Date(Date.now());
        var start = new Date(event.start);
        var end = new Date(event.end);
        var inn = event.in;
        var duration = Math.floor((end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24);
        var progress = Math.floor(Math.abs(inn) * 100 / duration) + '%';



        var coords = d3.event;
        
        
        console.log(coords);
        let vHeight = d3.select('body').style('height');
        vHeight = vHeight.substr(0, vHeight.length - 2);
        let vWidth = d3.select('body').style('width');
        vWidth = vWidth.substr(0, vWidth.length - 2);

        d3.select('#t').remove();

        d3.selectAll('rect')
            .attr('stroke', '#cccccc')
            .attr('stroke-width', '0');

        d3.select(this)
            .attr('stroke', '#cccccc')
            .attr('stroke-width', '1.5');

        var box = d3.select('body')
            .append('div')
            .attr('class', 'info-box chart-info')
            .attr('id', 't')
            .style('left', (coords.x + 300 <= vWidth ? coords.x : vWidth - 300) + 'px')
            .style('top', (coords.y + 370 <= vHeight ? coords.y : vHeight - 370) + 'px');
        // Create an id for text so we can select it later for removing on mouseout
            

        var title = box.append('h1')
            .attr('class', 'info-title')
            .text(event.well);  

        var subtitle = box.append('h3')
            .attr('class', 'info-subtitle');

        var progressBar = box.append('div')
            .attr('class', 'progress-bar')
            .append('div')
            .attr('class', 'progress')
            .attr('style', 'width:0' + progress);

        var infoProgress = box.append('div')
            .attr('class', 'info-progress');

        var item = box.append('div')
            .attr('class', 'flex start middle info-item');
        item.append('div')
            .attr('class', 'title')
            .text('Operator:');
        item.append('h3')
            .text(event.operator);
        item = box.append('div')
            .attr('class', 'flex start middle info-item');
        item.append('div')
            .attr('class', 'title')
            .text('API:');
        item.append('h3')
            .text(event.API);
        item = box.append('div')
            .attr('class', 'flex start middle info-item');
        item.append('div')
            .attr('class', 'title')
            .text('Sheduled Frac Start:');
        item.append('h3')
            .text(moment(event.start).format('MM/DD/YYYY'));
        item = box.append('div')
            .attr('class', 'flex start middle info-item');
        item.append('div')
            .attr('class', 'title')
            .text('Sheduled Frac End:');
        item.append('h3')
            .text(moment(event.end).format('MM/DD/YYYY'));
        item = box.append('div')
            .attr('class', 'flex start middle info-item');
        item.append('div')
            .attr('class', 'title')
            .text('Surface Lat:');
        item.append('h3')
            .text(event.surface.lat);
        item = box.append('div')
            .attr('class', 'flex start middle info-item');
        item.append('div')
            .attr('class', 'title')
            .text('Surface Long:');
        item.append('h3')
            .text(event.surface.lng);
        item = box.append('div')
            .attr('class', 'flex start middle info-item');
        item.append('div')
            .attr('class', 'title')
            .text('Bottomhole Lat:');
        item.append('h3')
            .text(event.bottom.lat);
        item = box.append('div')
            .attr('class', 'flex start middle info-item');
        item.append('div')
            .attr('class', 'title')
            .text('Bottomhole Long:');
        item.append('h3')
            .text(event.bottom.lng);
        item = box.append('div')
            .attr('class', 'flex start middle info-item');
        item.append('div')
            .attr('class', 'title')
            .text('TVD:');
        item.append('h3')
            .text(event.TVD);

        if (inn < 0) {
            subtitle.text('Operating')
                .attr('style', 'color:#14afa4;');
            let now = new Date(Date.now());
            let width = (now.getTime() - event.start.getTime()) * 100 / (event.end.getTime() - event.start.getTime());

            box.select('progress-bar')
                .select('progress')
                .attr('style', 'background-color:#00a99d;')
                .attr('style', 'width:' + width + '%;');

        } else {
            subtitle
                .text('Starting in ' + inn + ' days')
                .attr('style', 'color:#ff6600;');
        }
    }

    gantt(data) {
        let chartData = [];
        if (data.length > 1) {
            chartData = _.filter(data, function (o) {
                return o.end > new Date(Date.now());
            });
        } else {
            chartData = data;
        }
        this.initYrange(chartData);
        this.initXrange(chartData);
        this.initTimeDomain(chartData);
        this.initAxis();
        this.initTablebg(chartData);
        

        var _th = this;

        var svg = d3.select(this.selector)
            .append('svg')
            .attr('class', 'chartsvg')
            .attr('width', this.width)
            .attr('height', 30 * chartData.length + this.margin.top)
            .append('g')
            .attr('class', 'gantt-chart')
            .attr('width', this.width - 600)
            .attr('height', 30 * chartData.length + this.margin.top)
            .attr('transform', 'translate(' + this.margin.left + ', ' +
            this.margin.top + ')');

        svg.selectAll('.chart')
            .data(chartData, this.keyFunction)
            .enter()
            .append('rect')
            .style('cursor', 'pointer')
            .attr('rx', 6)
            .attr('ry', 6)
            .attr('class', function (d) {
                if (d.in < 0) {
                    return 'bar green';
                }
                else if (d.in >= 0 && d.in <= 7) {
                    return 'bar red';
                }
                else if (d.in >= 8 && d.in <= 30) {
                    return 'bar orange';
                }
                else if (d.in >= 31 && d.in <= 60) {
                    return 'bar purple';
                }
                else if (d.in > 60) {
                    return 'bar blue';
                }
            })
            .attr('x', 0)
            .attr('y', 8)
            .attr('transform', function (d) {
                return 'translate(' + _th.x(d.start) + ',' + _th.y(d.well) + ')';
            })
            .attr('height', '12')
            .attr('width', function (d) {
                return Math.max(1, (_th.x(d.end) - _th.x(d.start)));
            })
            .on('click', _th.onMouseenter);
        
        return this.gantt;

    };

}

