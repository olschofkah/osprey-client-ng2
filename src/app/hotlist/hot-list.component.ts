
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

import { HotListItem } from '../hotlistitem/hot-list-item'
import { HotListItemComponent } from '../hotlistitem/hot-list-item.component'
import { HotListService } from '../service/hot-list.service'
import { Logger } from '../service/logger.service'
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'hot-list',
  directives: [NgFor, HotListItemComponent],
  template: require('./hot-list.template.html'),
  styles: [require('../../assets/bootstrap.min.css')],
  providers: [HotListService, Logger]
})
export class HotList {
  title = 'tha hot shit';

  constructor(private hotListService: HotListService, private log: Logger) {
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
    this.hotListService.getList()
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
        this.log.error("An error occured fetching the hot list. ", err);
      },
      () => this.log.info('Hot List Fetch Complete')
      );

  }

  ngOnInit() {
    this.getList();
  }

}
