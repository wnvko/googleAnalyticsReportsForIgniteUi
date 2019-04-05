import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  IgxAvatarModule,
  IgxButtonModule,
  IgxCalendarModule,
  IgxCardModule,
  IgxDatePickerModule,
  IgxGridModule,
  IgxNavbarModule,
  IgxTabsModule
} from 'igniteui-angular';
import { IgxPieChartModule} from 'igniteui-angular-charts/ES5/igx-pie-chart-module';

import { AuthenticationModule } from './authentication/authentication.module';
import { AuthService } from './authentication/services/auth.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataService } from './services/data.service';
import { HomeComponent } from './home/home.component';
import { DataVisualizationComponent } from './data-visualization/data-visualization.component';
import { EventsVisualizationComponent } from './events-visualization/events-visualization.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    DataVisualizationComponent,
    EventsVisualizationComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AuthenticationModule,
    AppRoutingModule,
    IgxAvatarModule,
    IgxButtonModule,
    IgxCalendarModule,
    IgxCardModule,
    IgxDatePickerModule,
    IgxGridModule,
    IgxNavbarModule,
    IgxPieChartModule,
    IgxTabsModule
  ],
  providers: [ AuthService, DataService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
