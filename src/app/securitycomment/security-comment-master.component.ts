
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

import { SecurityComment } from './security-comment';
import { OspreyApiService } from '../service/osprey-api.service';
import { ClientAlertService } from '../service/client-alert.service';
import { Logger } from '../service/logger.service'
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Component({
  moduleId: __filename,
  selector: 'security-comment-master',
  directives: [NgFor],
  template: require('./security-comment-master.template.html'),
  styles: [require('../../assets/bootstrap.min.css'), require('../../assets/osprey.css')],
  providers: [OspreyApiService, Logger]
})
export class SecurityCommentMaster {
  title = 'Notes';

  private comments: SecurityComment[] = [];
  private newSymbol: string;
  private newComment: string;

  constructor(private apiService: OspreyApiService, private log: Logger, private clientAlertService: ClientAlertService) {
  }

  getList() {
    this.apiService.getSecurityComments()
      .subscribe(
      data => {
        if (data && data.length != 0) {
          this.comments = data;
        }
      },
      err => {
        this.clientAlertService.alertError("An error occured fetching the security comments. " + err);
      },
      () => this.log.info('Black List Fetch Complete')
      );

  }

  add(): void {
    if (this.newSymbol && this.newComment) {
      let comment: SecurityComment = new SecurityComment();
      comment.symbol = this.newSymbol.toUpperCase();
      comment.comment = this.newComment;

      this.comments.unshift(comment);
      this.newSymbol = "";
      this.newComment = "";
      this.persist(comment);
    } else {
      this.clientAlertService.alertError('Must specify a symbol & comment');
    }
  }

  remove(comment: SecurityComment): void {
    let index = this.comments.indexOf(comment);
    if (index > -1) {
      this.comments.splice(index, 1);
      this.deleteComment(comment);
    }
  }

  persist(comment: SecurityComment) {
    this.apiService.insertSecurityComment(comment)
      .then((response) => {
        this.clientAlertService.alertMsg('Security Comment Saved ... ');
      })
      .catch((err) => {
        this.clientAlertService.alertError('Security Comment Failed to save due to ' + err);
      });
  }

  deleteComment(comment: SecurityComment) {
    this.apiService.deleteSecurityComment(comment)
      .then((response) => {
        this.clientAlertService.alertMsg('Security Comment Deleted ... ');
      })
      .catch((err) => {
        this.clientAlertService.alertError('Security Comment Failed to delete due to ' + err);
      });
  }

  ngAfterViewInit() {
    this.getList();
  }

}
