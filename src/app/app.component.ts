import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <router-outlet></router-outlet>
  <router-outlet name="print"></router-outlet>
  `
})
export class AppComponent {

}
