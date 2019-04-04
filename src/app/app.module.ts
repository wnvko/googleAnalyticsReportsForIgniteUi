import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
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
import { fromEventPattern } from 'rxjs';
import { DataVisualizationComponent } from './data-visualization/data-visualization.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    DataVisualizationComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AuthenticationModule,
    AppRoutingModule,
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
