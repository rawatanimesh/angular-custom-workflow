import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chart-item',
  templateUrl: './chart-item.component.html',
  styleUrls: ['./chart-item.component.scss']
})
export class ChartItemComponent implements OnInit {
  @Input() data: any;
  @Input() type = 'rcp';
  constructor() { }

  ngOnInit() {
  }

}
