
import { Component } from '@angular/core';
import { ClientAlertService } from '../service/client-alert.service'
import { Logger } from '../service/logger.service'
import { NgFor, NgIf } from '@angular/common';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'client-alert',
  directives: [NgFor, NgIf],
  template: require('./client-alert.template.html'),
  styles: [require('../../assets/bootstrap.min.css'), require('../../assets/osprey.css')]
})
export class ClientAlertComponent {

  constructor(private clientAlertService: ClientAlertService) {

  }

}
