import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { TreeMapComponent } from './tree-map.component';

@NgModule({
  declarations: [TreeMapComponent],
  imports: [CommonModule, HighchartsChartModule],
  exports: [TreeMapComponent]
})
export class TreeMapModule {}
