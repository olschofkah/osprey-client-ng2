
import { Component} from '@angular/core';


import { OspreyApiService } from '../service/osprey-api.service'
import { Logger } from '../service/logger.service'
import { ClientAlertService } from '../service/client-alert.service'
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Component({
  moduleId: __filename,
  selector: 'model-screens',
  template: require('./model-screens.template.html'),
  styles: [require('../../assets/bootstrap.min.css'), require('../../assets/osprey.css')],
  providers: [OspreyApiService, Logger]
})
export class ModelScreens {
  title = 'Models';

  private models: any;
  private error: string = null;

  constructor(private apiService: OspreyApiService, private log: Logger, private clientAlertService: ClientAlertService) {
  }

  getModelList() {
    this.apiService.getModelScreens()
      .subscribe(
      data => {
        if (data) {
          this.models = JSON.stringify(data, null, 1);
        }
      },
      err => {
        this.clientAlertService.alertError("An error occured fetching the models. " + err);
      },
      () => this.log.info('Model Screen List Fetch Complete')
      );
  }

  persist() {
    this.apiService.persistModelScreens(this.models)
      .then((response) => {
        this.clientAlertService.alertMsg('Models Saved ... ');
      })
      .catch((err) => {
        this.clientAlertService.alertError('Models Failed to save due to ' + err);
      });
  }

  ngAfterViewInit() {
    this.getModelList();
  }

}
