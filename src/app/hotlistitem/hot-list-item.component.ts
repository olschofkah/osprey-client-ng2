
import { Component, Input, EventEmitter } from '@angular/core';
import { HotListItem } from '../hotlistitem/hot-list-item'
import { OspreyApiService } from '../service/osprey-api.service'
import { ClientAlertService } from '../service/client-alert.service'
import { Logger } from '../service/logger.service'
import { NgFor, NgIf } from '@angular/common';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'hot-list-item',
  directives: [NgFor, NgIf],
  template: require('./hot-list-item.template.html'),
  styles: [require('../../assets/bootstrap.min.css'), require('../../assets/osprey.css')]
})
export class HotListItemComponent {
  public item: HotListItem;
  public summaryDetail: any;

  constructor(private apiService: OspreyApiService, private log: Logger, private clientAlertService: ClientAlertService) {

  }

  @Input() set target(inputItem: HotListItem) {
    if (inputItem) {
      this.item = inputItem;
      this.load(inputItem.key.symbol);
    }
  }

  private load(symbol: String): void {

    this.apiService.getStockSummaryDetail(symbol)
      .subscribe(
      data => {
        this.summaryDetail = data[0];
        this.summaryDetail.companyname = this.summaryDetail.companyname.replace('&apos;','\'').replace('&amp;','&');

      },
      err => {
        this.clientAlertService.alertError('An error occured fetching the summary detail.' + err);
      },
      () => this.log.info('Summary Detail load complete')
      );
  }

}
