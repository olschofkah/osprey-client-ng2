
import { Component, Input, EventEmitter } from '@angular/core';
import { HotListItem } from '../hotlistitem/hot-list-item'
import { HotListItemContainer } from '../hotlistitem/hot-list-item-container'
import { HotListService } from '../service/hot-list.service'
import { Logger } from '../service/logger.service'
import { NgFor, NgIf } from '@angular/common';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'hot-list-item',
  directives: [NgFor, NgIf],
  template: require('./hot-list-item.template.html'),
  styles: [require('../../assets/bootstrap.min.css')]
})
export class HotListItemComponent {
  public item: HotListItem;
  public summaryDetail: any;

  constructor(private hotListService: HotListService, private log: Logger) {

  }

  @Input() set target(inputItem: HotListItem) {
    if (inputItem) {
      this.item = inputItem;
      this.load(inputItem.key.symbol);
    }
  }

  private load(symbol: String): void {

    this.hotListService.getSummaryDetail(symbol)
      .subscribe(
      data => {
        this.summaryDetail = data[0];
      },
      err => {
        this.log.error("An error occured fetching the summary detail. ", err);
      },
      () => this.log.info('Summary Detail load complete')
      );
  }


}
