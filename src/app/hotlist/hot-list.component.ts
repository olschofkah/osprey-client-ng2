
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

import { HotListItem } from '../hotlistitem/hot-list-item';
import { HotListItemComponent } from '../hotlistitem/hot-list-item.component';
import { OspreyApiService } from '../service/osprey-api.service';
import { ClientAlertService } from '../service/client-alert.service';
import { Logger } from '../service/logger.service';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Component({
  moduleId: __filename,
  selector: 'hotlist',
  directives: [NgFor, HotListItemComponent],
  template: require('./hot-list.template.html'),
  styles: [require('../../assets/bootstrap.min.css'), require('../../assets/osprey.css')],
  providers: [OspreyApiService, Logger]
})
export class HotList {
  title = 'tha hot shit';

  constructor(private hotListService: OspreyApiService, private log: Logger, private clientAlertService: ClientAlertService) {
  }

  hotListItemsArray: any[] = [];
  hotListItems: { [id: string]: HotListItem[] } = {};
  selectedItem: HotListItem;

  onSelect(item: HotListItem) {

    if (this.selectedItem === item) {
      this.selectedItem = null;
      item.selected = false;
    } else {
      this.selectedItem = item;
      item.selected = !item.selected;
    }
  }

  getList() {
    this.hotListService.getHotList()
      .subscribe(
      data => {
        for (let i = 0; i < data.length; ++i) {
          for (let j = 0; j < data[i].namedScreenSets.length; ++j) {
            if (data[i].namedScreenSets[j]) {
              let screen = data[i].namedScreenSets[j];
              if (!this.hotListItems[screen]) {
                this.hotListItems[screen] = [];
                this.hotListItemsArray.push(this.hotListItems[screen]);
              }
              data[i].groupedScreen = screen;
              this.hotListItems[screen].push(data[i]);
            }
          }
        }
      },
      err => {
        this.clientAlertService.alertError('An error occured fetching the hot list. ' + err);
      },
      () => this.log.info('Hot List Fetch Complete')
      );

  }

  ngAfterViewInit() {
    this.getList();
  }

}
