
import { Component, Input } from '@angular/core';
import { HotListItem } from './hot-list-item';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'hot-list-item',
  directives: [NgFor, NgIf],
  template: require('./hot-list-item.template.html'),
  styles: [require('../../assets/bootstrap.min.css')]
})
export class HotListItemComponent {

  @Input()
  item: HotListItem;
}
