
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

import { BlackListSymbol } from './black-list-symbol';
import { OspreyApiService } from '../service/osprey-api.service'
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

  constructor(private apiService: OspreyApiService, private log: Logger) {
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
        this.log.error("An error occured fetching the black list. ", err);
      },
      () => this.log.info('Black List Fetch Complete')
      );

  }

  add(): void {
    this.blackList[this.blackList.length] = new BlackListSymbol(this.newSymbol.toUpperCase());
    this.newSymbol = "";
  }

  remove(symbol: BlackListSymbol): void {
    let index = this.blackList.indexOf(symbol);
    if (index > -1) {
      this.blackList.splice(index, 1);
    }
  }

  persistList() {
    this.log.info("Updating Black List ... ");
    this.apiService.persistBlackList(this.blackList);
  }

  ngAfterViewInit() {
    this.getList();
  }

}
