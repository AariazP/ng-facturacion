import { Component } from '@angular/core';
import { environment } from 'src/app/env/env';

@Component({
  selector: 'app-cod404',
  templateUrl: './cod404.component.html',
  styleUrls: ['./cod404.component.css']
})
export class Cod404Component {
  protected imageUrl: string = environment.imageUrl;
}
