import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule } from '@angular/http';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// @ngrx
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule, RouterStateSerializer } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";

import { RouterEffects } from "./effects/router";
import { CustomRouterStateSerializer } from './shared/utils';

import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { AgmCoreModule } from '@agm/core';
import { NouisliderModule } from 'ng2-nouislider';
import { FileUploadModule } from 'ng2-file-upload';


// pages Authenticated
import { SignInComponent } from "./users/sign-in/sign-in.component";
import { LearnMoreComponent } from "./users/learn-more/learn-more.component";
import { ListComponent } from './users/list/list.component';
import { MapComponent } from './users/map/map.component';
import { ChartComponent } from './users/chart/chart.component';
import { UploadComponent } from './users/upload/upload.component';
import { CompanyComponent } from './users/company/company.component';
import { Company2Component } from './users/company-2/company-2.component';
import { CalendarComponent } from './users/calendar/calendar.component';
import { SearchResultComponent } from './users/search-result/search-result.component';

//components
import { SortTableComponent } from './component/sort-table/sort-table.component';
import { CheckboxTableComponent } from './component/checkbox-table/checkbox-table.component';
import { AddContactComponent } from './component/add-contact/add-contact.component';
import { CalendarTableComponent } from './component/calendar-table/calendar-table.component';



import { FilterPipe } from './shared/filter/';
import { HeaderComponent } from './shared/header/header.component';
import { SideComponent } from './shared/side/side.component';
import { FiltersComponent } from './shared/filters/filters.component';


// routing
import { AppRoutingModule } from "./app-routing.module";

// components
import { AppComponent } from "./app.component";

// effects
import { UserEffects } from "./users/users.effects";

// guards
import { AuthenticatedGuard} from "./shared/authenticated.guard";

// reducers
import { metaReducers, reducers } from "./reducers";

// services
import { UserService } from "./core/services/user.service";
import { DataService } from './core/services/data.service';


import 'hammerjs';

@NgModule({
    declarations: [
        AppComponent,
        FilterPipe,
        HeaderComponent,
        SideComponent,
        FiltersComponent,
        SignInComponent,
        LearnMoreComponent,
        ListComponent,
        MapComponent,
        ChartComponent,
        SortTableComponent,
        CheckboxTableComponent,
        UploadComponent,
        CompanyComponent,
        Company2Component,
        AddContactComponent,
        CalendarComponent,
        CalendarTableComponent,
        SearchResultComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot(),
        AppRoutingModule,
        ReactiveFormsModule,
        EffectsModule.forRoot([
            RouterEffects,
            UserEffects
        ]),
        StoreModule.forRoot(reducers, { metaReducers }),
        StoreRouterConnectingModule.forRoot({
            /*
              They stateKey defines the name of the state used by the router-store reducer.
              This matches the key defined in the map of reducers
            */
            stateKey: 'router',
        }),
        InfiniteScrollModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        Ng2AutoCompleteModule,
        FileUploadModule,
        NouisliderModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDdkWbNVCwVBbZ_dmrBawVuS2nxMT960AU'
        })
    ],
    providers: [
        DataService,
        AuthenticatedGuard,
        UserService,
        { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
    ],
    entryComponents: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
