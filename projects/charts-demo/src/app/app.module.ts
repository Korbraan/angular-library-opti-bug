import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TreeMapModule } from '../../../../dist/charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, TreeMapModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
