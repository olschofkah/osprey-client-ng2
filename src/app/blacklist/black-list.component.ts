
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

import { BlackListSymbol } from './black-list-symbol';
import { OspreyApiService } from '../service/osprey-api.service';
import { ClientAlertService } from '../service/client-alert.service';
import { Logger } from '../service/logger.service'
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Component({
  moduleId: __filename,
  selector: 'blacklist',
  directives: [NgFor],
  template: require('./black-list.template.html'),
  styles: [require('../../assets/bootstrap.min.css'), require('../../assets/osprey.css')],
  providers: [OspreyApiService, Logger]
})
export class BlackList {
  title = 'Black List';

  private blackList: BlackListSymbol[] = [];
  private newSymbol: string;

  constructor(private apiService: OspreyApiService, private log: Logger, private clientAlertService: ClientAlertService) {
  }

  getList() {
    this.apiService.getBlackList()
      .subscribe(
      data => {
        if (data && data.length != 0) {
          this.blackList = data;
        }
      },
      err => {
        this.clientAlertService.alertError("An error occured fetching the black list. " + err);
      },
      () => this.log.info('Black List Fetch Complete')
      );

  }

  add(): void {
    this.blackList[this.blackList.length] = new BlackListSymbol(this.newSymbol.toUpperCase());
    this.newSymbol = "";
    this.persistList();
  }

  remove(symbol: BlackListSymbol): void {
    let index = this.blackList.indexOf(symbol);
    if (index > -1) {
      this.blackList.splice(index, 1);
      this.persistList();
    }
  }

  persistList() {
    this.apiService.persistBlackList(this.blackList)
      .then((response) => {
        this.clientAlertService.alertMsg('Black List Saved ... ');
      })
      .catch((err) => {
        this.clientAlertService.alertError('Black List Failed to save due to ' + err);
      });
  }

  ngAfterViewInit() {
    this.getList();
  }

}
