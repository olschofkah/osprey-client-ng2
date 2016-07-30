
import { Component} from '@angular/core';


import { OspreyApiService } from '../service/osprey-api.service'
import { Logger } from '../service/logger.service'
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

  constructor(private apiService: OspreyApiService, private log: Logger) {
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
        this.log.error("An error occured fetching the black list. ", err);
      },
      () => this.log.info('Model Screen List Fetch Complete')
      );

  }

  persist() {
    this.log.info("Updating models ... ");
    this.apiService.persistModelScreens(this.models);
  }

  ngAfterViewInit() {
    this.getModelList();
  }

}
