import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import * as Highcharts from 'highcharts';
import Heatmap from 'highcharts/modules/heatmap';
import Treemap from 'highcharts/modules/treemap';
import { BehaviorSubject } from 'rxjs';
import { tooltipFormatterCallback } from '../interfaces';

Treemap(Highcharts);
Heatmap(Highcharts);

@Component({
  selector: 'mm-tree-map',
  templateUrl: './tree-map.component.html',
  styleUrls: ['./tree-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeMapComponent implements OnChanges, OnDestroy {
  @Input() data: (number | Highcharts.SeriesTreemapDataOptions)[] = [];
  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() tooltipFormatter: tooltipFormatterCallback;
  @Input() title: string;
  @Input() theme: Highcharts.Options;
  @Input() minColor: string;
  @Input() maxColor: string;

  @Output() pointClicked = new EventEmitter<Highcharts.PointClickEventObject>();

  Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  chart: Highcharts.Chart;
  chartInitialized = new BehaviorSubject(false);

  SERIES_ID = 'treemap-series' as const;

  constructor() {
    this.initChartOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      if (changes.data) {
        this.updateData();
      }
      if (changes.minValue || changes.maxValue) {
        this.updateMinMaxValue();
      }
      if (changes.minColor || changes.maxColor) {
        this.updateMinMaxColor();
      }
      if (changes.theme) {
        this.applyTheme();
      }
      if (changes.tooltipFormatter) {
        this.updateTooltipFormatter();
      }
      if (changes.title) {
        this.updateTitle();
      }
      this.chart.redraw();
    }
  }

  ngOnDestroy() {
    this.chartInitialized.complete();
  }

  initChartOptions() {
    this.chartOptions = {
      chart: {
        type: 'treemap',
        plotBorderWidth: 1,
        width: null
      },
      credits: {
        enabled: false
      },
      title: null,
      colorAxis: {
        showInLegend: true,
        startOnTick: false,
        endOnTick: false
      },
      tooltip: {
        useHTML: true
      },
      plotOptions: {
        series: {
          point: {
            events: {
              click: event => this.onTileClicked(event)
            }
          }
        }
      },
      series: [
        {
          id: this.SERIES_ID,
          name: this.SERIES_ID,
          type: 'treemap',
          layoutAlgorithm: 'sliceAndDice',
          data: [],
          levels: [
            {
              level: 1,
              borderWidth: 3,
              borderColor: '#fff',
              layoutAlgorithm: 'squarified'
            }
          ]
        }
      ] as Highcharts.SeriesTreemapOptions[]
    };
  }

  applyTheme(redraw = false) {
    this.chart.update(this.theme, redraw);
  }

  updateTitle(redraw = false) {
    if (this.title) {
      this.chart.setTitle({ text: this.title }, null, redraw);
    } else {
      this.chart.setTitle(null, null, redraw);
    }
  }

  updateData(redraw = false) {
    (this.chart.get(this.SERIES_ID) as Highcharts.Series).setData(this.data as any, redraw);
  }

  updateMinMaxValue(redraw = false) {
    this.chart.update({ colorAxis: { min: this.minValue, max: this.maxValue } }, redraw);
  }

  updateMinMaxColor(redraw = false) {
    this.chart.update({ colorAxis: { minColor: this.minColor, maxColor: this.maxColor } }, redraw);
  }

  updateTooltipFormatter(redraw = false) {
    if (this.tooltipFormatter) {
      const self = this;
      this.chart.update(
        {
          tooltip: {
            formatter() {
              return self.tooltipFormatter(this.point as any);
            }
          }
        },
        redraw
      );
    }
  }

  onTileClicked(event: Highcharts.PointClickEventObject) {
    this.pointClicked.emit(event);
  }

  setChartInstance(chart: Highcharts.Chart) {
    this.chart = chart;
    this.updateData();
    this.updateMinMaxValue();
    this.updateMinMaxColor();
    this.updateTooltipFormatter();
    this.updateTitle();
    this.applyTheme();
    this.chart.redraw();
    this.chartInitialized.next(true);
  }
}
