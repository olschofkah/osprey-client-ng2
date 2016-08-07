
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

import { HotListItem } from '../hotlistitem/hot-list-item';
import { HotListItemComponent } from '../hotlistitem/hot-list-item.component';
import { SecurityCommentSymbol } from '../securitycomment/symbol/security-comment-symbol.component';
import { OspreyApiService } from '../service/osprey-api.service';
import { ClientAlertService } from '../service/client-alert.service';
import { Logger } from '../service/logger.service';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Component({
  moduleId: __filename,
  selector: 'hotlist',
  directives: [NgFor, HotListItemComponent, SecurityCommentSymbol],
  template: require('./hot-list.template.html'),
  styles: [require('../../assets/bootstrap.min.css'), require('../../assets/osprey.css')],
  providers: [OspreyApiService, Logger]
})
export class HotList {
  title = 'tha hot shit';

  constructor(private apiService: OspreyApiService, private log: Logger, private clientAlertService: ClientAlertService) {
  }

  private maxDate: string = new Date().toISOString().substr(0, 10);
  private loadDate: string = this.maxDate;

  public MANUAL_MODEL_NAME: string = 'Manual Watch';
  private newSymbol: string;

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
    this.apiService.getHotList()
      .subscribe(
      data => {
        if (data != null) {
          this.loadData(data);
          
          // Find the date of the load
          for (let i = 0; i < data.length; ++i) {
            if (data[i].namedScreenSets[0] !== this.MANUAL_MODEL_NAME) {
              this.loadDate = new Date(data[i].reportDate).toISOString().substr(0, 10);
              break;
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

  loadHistorical() {

    this.hotListItems = {};
    this.hotListItemsArray.splice(0, this.hotListItemsArray.length);

    this.apiService.getHotListForDate(this.loadDate)
      .subscribe(
      data => {
        if (data != null) {
          this.loadData(data);
        }
      },
      err => {
        this.clientAlertService.alertError('An error occured fetching the historical hot list. ' + err);
      },
      () => this.log.info('Hot List Fetch Complete')
      );

  }

  loadData(data: any): void {

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
  }

  addSymbol() {
    let key: any = { symbol: this.newSymbol, cusip: '' };

    let newItem: HotListItem = new HotListItem(
      key,
      [this.MANUAL_MODEL_NAME],
      [],
      this.MANUAL_MODEL_NAME,
      false,
      false,
      new Date(1970, 0, 1)
    );

    if (!this.hotListItems[this.MANUAL_MODEL_NAME]) {
      this.hotListItems[this.MANUAL_MODEL_NAME] = [];
      this.hotListItemsArray.unshift(this.hotListItems[this.MANUAL_MODEL_NAME]);
    }

    this.hotListItems[this.MANUAL_MODEL_NAME].push(newItem);
    this.apiService.insertHotListItem(newItem)
      .then((response) => {
        this.clientAlertService.alertMsg('Hot List Item Saved ... ');
      })
      .catch((err) => {
        this.clientAlertService.alertError('An error occured saving the hot list ' + err);
      });

    this.newSymbol = null;
  }

  deleteSelectedItem() {
    if (this.selectedItem) {

      for (let i = 0; i < this.hotListItemsArray.length; i++) {
        let innerArray: any[] = this.hotListItemsArray[i];
        for (let ii = 0; ii < innerArray.length; ii++) {
          if (innerArray[ii].key.symbol == this.selectedItem.key.symbol) {
            innerArray.splice(ii, 1);
            break;
          }
        }
      }

      this.selectedItem.deleted = true;
      this.selectedItem.selected = false;
      this.apiService.deleteHotListItem(this.selectedItem);
      this.selectedItem = null;

    }
  }

  ngAfterViewInit() {
    this.getList();
  }

}
