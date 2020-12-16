import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartItemComponent } from './component/chart-item/chart-item.component';
import { ChartComponent } from './component/chart/chart.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChartItemComponent,
    ChartComponent
  ],
  exports: [
    ChartItemComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class ChartExtenderModule { }
