import { ApiCacheService } from './../../../api/api-cache.service';
import { Component, OnInit, Input } from '@angular/core';
import { ApiNlfUserService } from '../../../api/api-nlf-user.service';
import { ApiOptionsInterface } from '../../../api/api.interface';
import { ApiUserService } from '../../../api/api-user.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'nlf-resolve-user',
  templateUrl: './resolve-user.component.html',
  styleUrls: ['./resolve-user.component.css']
})
export class NlfResolveUserComponent implements OnInit {

  @Input() userid: number;
  @Input() tmpname?: string;
  @Input() link?: boolean;
  @Input() avatar?: boolean;

  dataReady = false;

  fullname = '';

  constructor(private melwinUserService: ApiNlfUserService,
    private userService: ApiUserService,
    private apiCache: ApiCacheService) { }

  ngOnInit() {
    if (!this.avatar) { this.avatar = false; }
    if (!this.link) { this.link = false; }
    // if (!this.tmpname ) { this.tmpname = ''; }

    if (this.userid < 0 && !this.tmpname) {

      this.fullname = 'Hopper ' + (-1 * this.userid);
      this.dataReady = true;

    } else if (!!this.tmpname && this.userid <= 0) {

      this.avatar = false;
      this.link = false;
      this.fullname = this.tmpname;
      this.dataReady = true;

    } else if (typeof this.userid === 'undefined') {

      this.fullname = 'Ingen personer';
      this.dataReady = true;

    } else {

      /**
       * We do need to check if the user exists locally too
       * - Resolve name from nlf-users
       * - Verify if user exists in users for linkage
       */


      const options: ApiOptionsInterface = {
        query: { projection: { fullname: 1 } }
      };

      const nlfUsers = this.apiCache.get(['resolve-user', this.userid, options.query], this.melwinUserService.getUser(this.userid, options));

      if (!this.link) { // Only check in nlf-users

        nlfUsers.subscribe(
          data => this.fullname = data.fullname,
          err => this.fullname = 'Ukjent person',
          () => this.dataReady = true
        );
      } else { // check in both and decide if link or not

        const optionsuser: ApiOptionsInterface = {
          query: { projection: { id: 1 } }
        };

        const users = this.apiCache.get(['get-user', this.userid, optionsuser.query], this.userService.getUser(this.userid, optionsuser));

        Observable.forkJoin(
          users.catch(userError => Observable.of(userError)),
          nlfUsers.catch(nlfUserError => Observable.of(nlfUserError)))
          .subscribe(

          data => {
            this.link = false;
            if (!!data[0] && typeof data[0].error === 'undefined') {
              this.link = true;
            }

            if (data[0] && typeof data[1].error === 'undefined') {
              this.fullname = data[1].fullname;
            } else if (!!data[1].status && data[1].status === 404) {
              this.fullname = 'Ukjent person';
              this.link = false;
            }
          },
          err => console.log(err),
          () => this.dataReady = true
          );
      }
    }

  }

}
