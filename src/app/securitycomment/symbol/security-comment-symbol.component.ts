
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

import { SecurityComment } from '../security-comment';
import { OspreyApiService } from '../../service/osprey-api.service';
import { ClientAlertService } from '../../service/client-alert.service';
import { Logger } from '../../service/logger.service'
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Component({
  moduleId: __filename,
  selector: 'security-comment-symbol',
  directives: [NgFor],
  template: require('./security-comment-symbol.template.html'),
  styles: [require('../../../assets/bootstrap.min.css'), require('../../../assets/osprey.css')],
  providers: [OspreyApiService, Logger]
})
export class SecurityCommentSymbol {
  title = 'Notes';

  private symbol: string;
  private comments: SecurityComment[] = [];
  private newComment: string;

  constructor(private apiService: OspreyApiService, private log: Logger, private clientAlertService: ClientAlertService) {
  }

  @Input() set target(symbol: string) {
    console.log(symbol);
    if (symbol) {
      this.symbol = symbol;
      this.getList();
    } else {
      this.comments = [];
      this.newComment = null;
    }
  }

  getList() {
    this.apiService.getSecurityCommentsForSymbol(this.symbol)
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
    if (this.newComment) {
      let comment: SecurityComment = new SecurityComment();
      comment.symbol = this.symbol;
      comment.comment = this.newComment;

      this.comments[this.comments.length] = comment;
      this.newComment = "";
      this.persist(comment);
    } else {
      this.clientAlertService.alertError('Must specify a comment');
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
        this.clientAlertService.alertMsg('Security Comment Saved ... ');
      })
      .catch((err) => {
        this.clientAlertService.alertError('Security Comment Failed to save due to ' + err);
      });
  }

  ngAfterViewInit() {
    this.getList();
  }

}
