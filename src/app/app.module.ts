import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import {
  IgxButtonModule,
  IgxDatePickerModule,
  IgxHierarchicalGridModule,
  IgxSelectModule,
  IgxTabsModule
} from 'igniteui-angular';
import { IgxItemLegendModule} from 'igniteui-angular-charts/ES5/igx-item-legend-module';
import { IgxPieChartModule} from 'igniteui-angular-charts/ES5/igx-pie-chart-module';


import { GoogleApiService } from './services/google-api.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    IgxButtonModule,
    IgxDatePickerModule,
    IgxHierarchicalGridModule,
    IgxItemLegendModule,
    IgxPieChartModule,
    IgxSelectModule,
    IgxTabsModule
  ],
  providers: [GoogleApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
