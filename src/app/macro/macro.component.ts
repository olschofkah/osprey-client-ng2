
import { Component } from '@angular/core';

import { ClientAlertService } from '../service/client-alert.service';
import { Logger } from '../service/logger.service'
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Component({
    moduleId: __filename,
    selector: 'macro',
    template: require('./macro.template.html'),
    styles: [require('../../assets/bootstrap.min.css'), require('../../assets/osprey.css')],
    providers: [Logger]
})
// http://www.investing.com/webmaster-tools/live-commodities
export class MacroComponent {
    title = 'Macro Economics, Commodities, and Indexs';

    constructor(private log: Logger, private clientAlertService: ClientAlertService) {
    }

}
