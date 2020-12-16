import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartExtenderModule } from '../chart-extender/chart-extender.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartExtenderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
