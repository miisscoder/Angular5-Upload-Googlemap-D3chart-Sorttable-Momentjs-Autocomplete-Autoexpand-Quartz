import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";



// components Authenticated
import { SignInComponent } from "./users/sign-in/sign-in.component";
import { LearnMoreComponent } from './users/learn-more/learn-more.component';
import { ListComponent } from './users/list/list.component';
import { MapComponent } from './users/map/map.component';
import { ChartComponent } from './users/chart/chart.component';
import { UploadComponent } from './users/upload/upload.component';
import { CompanyComponent } from './users/company/company.component';
import { Company2Component } from './users/company-2/company-2.component';
import { CalendarComponent } from './users/calendar/calendar.component';
import { SearchResultComponent } from './users/search-result/search-result.component';

// routes
const routes: Routes = [
    {
        path: 'main/dashboard/map',
        component: MapComponent
    },
    {
        path: 'main/dashboard/list',
        component: ListComponent
    },
    {
        path: 'main/dashboard/chart',
        component: ChartComponent
    },
    {
        path: 'main/calendar',
        component: CalendarComponent
    },
    {
        path: 'main/upload',
        component: UploadComponent
    },
    {
        path: 'main/result',
        component: SearchResultComponent
    },
    {
        path: 'main/company',
        component: CompanyComponent
    },
    {
        path: 'main/company2',
        component: Company2Component
    },
    {
        path: "sign-in",
        component: SignInComponent
    },
    {
        path: "learn-more",
        component: LearnMoreComponent
    },
    {
        path: "**",
        redirectTo: "/sign-in"
    }
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule { }
