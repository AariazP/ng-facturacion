import { Component, inject } from '@angular/core';
import { environment } from './env/env';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private titleService: Title = inject(Title);

  ngOnInit() {
    this.setTitle(environment.nombreNegocio);
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
