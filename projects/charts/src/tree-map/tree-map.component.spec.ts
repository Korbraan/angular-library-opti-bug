import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Series } from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { take } from 'rxjs/operators';
import { TreeMapComponent } from './tree-map.component';

describe('TreeMapComponent', () => {
  let component: TreeMapComponent;
  let fixture: ComponentFixture<TreeMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HighchartsChartModule],
      declarations: [TreeMapComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(async(() => {
    component.chartInitialized.pipe(take(1)).toPromise();
  }));

  it('should init chart options on instanciation', () => {
    expect(component.chartOptions).toBeDefined();
  });

  describe('Updates on changes', () => {
    it('should update title', () => {
      const chartTitle = 'This is the chart title';
      component.title = chartTitle;
      component.ngOnChanges({ title: new SimpleChange(null, component.title, false) });
      fixture.detectChanges();

      expect((component.chart.title as any).textStr).toBe(chartTitle);
    });

    it('should update data', () => {
      const points = [{ name: 'point 1', x: 42, y: 56 }];
      component.data = points;
      component.ngOnChanges({ data: new SimpleChange(null, component.data, false) });
      fixture.detectChanges();

      const series = component.chart.get(component.SERIES_ID) as Series;
      expect(series.data.length).toBe(1);
      expect(series.data[0].x).toBe(points[0].x);
      expect(series.data[0].y).toBe(points[0].y);
      expect(series.data[0].name).toBe(points[0].name);
    });

    it('should update tooltip formatter', () => {
      expect(component.chart.tooltip.options.formatter).toBeUndefined();

      component.tooltipFormatter = () => 'coucou';
      component.ngOnChanges({ tooltipFormatter: new SimpleChange(null, component.tooltipFormatter, false) });
      fixture.detectChanges();

      expect(component.chart.tooltip.options.formatter).toBeDefined();
    });

    describe('updateMinMaxValue', () => {
      it('should update min value', () => {
        expect((component.chart.options.colorAxis as any).min).toBeUndefined();

        component.minValue = 42;
        component.ngOnChanges({ minValue: new SimpleChange(null, component.minValue, false) });
        fixture.detectChanges();
        expect((component.chart.options.colorAxis as any).min).toBe(42);
      });

      it('should update max value', () => {
        expect((component.chart.options.colorAxis as any).max).toBeUndefined();

        component.maxValue = 42;
        component.ngOnChanges({ maxValue: new SimpleChange(null, component.maxValue, false) });
        fixture.detectChanges();

        expect((component.chart.options.colorAxis as any).max).toBe(42);
      });
    });

    describe('updateMinMaxColor', () => {
      it('should update min color', () => {
        expect((component.chart.options.colorAxis as any).min).toBeUndefined();

        component.minColor = 'red';
        component.ngOnChanges({ minColor: new SimpleChange(null, component.minColor, false) });
        fixture.detectChanges();
        expect((component.chart.options.colorAxis as any).minColor).toBe('red');
      });

      it('should update max color', () => {
        expect((component.chart.options.colorAxis as any).max).toBeUndefined();

        component.maxColor = 'red';
        component.ngOnChanges({ maxColor: new SimpleChange(null, component.maxColor, false) });
        fixture.detectChanges();

        expect((component.chart.options.colorAxis as any).maxColor).toBe('red');
      });
    });
  });

  it('should raise pointClicked event when a bubble is clicked', () => {
    let clickedPoint: Highcharts.PointClickEventObject;
    component.pointClicked.subscribe(point => (clickedPoint = point));
    // Add a point to the chart.
    component.data = [{ name: 'point 1', value: 42 }];
    component.ngOnChanges({ data: new SimpleChange(null, component.data, false) });
    fixture.detectChanges();
    // Trigger the point click using Highcharts internal API.
    (component.chart.series[0].data[0] as any).firePointEvent('click');
    expect(clickedPoint).toBeDefined();
  });
});
