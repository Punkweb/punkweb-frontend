import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { ApiService, AuthService, SanitizeService } from '../../../services';

@Component({
  selector: 'app-route-board-thread',
  templateUrl: './thread.route.html',
  styleUrls: ['./thread.route.scss']
})
export class BoardThreadComponent implements OnDestroy, OnInit {

  public moment = moment;

  public breadcrumbs = [
    {
      text: 'Forum',
      link: '/'
    },
    {
      text: '',
      link: '#'
    },
    {
      text: '',
      link: null
    }
  ];
  public threadId = null;
  public thread = null;
  public posts = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
    public sanitize: SanitizeService,
  ) { }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.threadId = params.id;
      this.getThread(this.threadId).then((thread) => {
        this.thread = thread;
        this.breadcrumbs[1].text = 'TODO';
        this.breadcrumbs[2].text = this.thread.title;
        console.log(this.thread);
      }).catch((err) => {
        this.router.navigate(['/error']);
      });
      // this.getThreads(this.subcategoryId).then((threads: any) => {
      //   this.threads = threads;
      //   console.log(this.threads);
      // }).catch((err) => {
      //   // Error message about not being able to get posts
      // });
    });
  }

  public ngOnDestroy() { }

  public getThread(id) {
    let promise = new Promise((resolve, reject) => {
      let threadSub = this.api.Thread.read(this.threadId).subscribe(
        (thread) => {
          resolve(thread);
        },
        (err) => {
          reject(err);
        },
        () => {
          threadSub.unsubscribe();
        }
      );
    });
    return promise;
  }

  // public getThreads(subcategoryId) {
  //   let promise = new Promise((resolve, reject) => {
  //     let threadsSub = this.api.Thread.list({
  //       subcategory_id: subcategoryId
  //     }).subscribe(
  //       (threads) => {
  //         resolve(threads);
  //       },
  //       (err) => {
  //         reject(err);
  //       },
  //       () => {
  //         threadsSub.unsubscribe();
  //       }
  //     );
  //   });
  //   return promise;
  // }
}
