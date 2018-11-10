import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { ApiService, AuthService, SanitizeService } from '../../../services';

@Component({
  selector: 'app-route-board-subcategory',
  templateUrl: './subcategory.route.html',
  styleUrls: ['./subcategory.route.scss']
})
export class BoardSubcategoryComponent implements OnDestroy, OnInit {

  public moment = moment;

  public breadcrumbs = [
    {
      text: 'Forum',
      link: '/'
    },
    {
      text: '',
      link: null
    }
  ];
  public subcategoryId = null;
  public subcategory = null;
  public threads = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
    public sanitize: SanitizeService,
  ) { }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.subcategoryId = params.id;
      this.getSubcategory(this.subcategoryId).then((subcategory) => {
        this.subcategory = subcategory;
        this.breadcrumbs[1].text = this.subcategory.name;
        console.log(this.subcategory);
      }).catch((err) => {
        this.router.navigate(['/error']);
      });
      this.getThreads(this.subcategoryId).then((threads: any) => {
        this.threads = threads;
        console.log(this.threads);
      }).catch((err) => {
        // Error message about not being able to get posts
      });
    });
  }

  public ngOnDestroy() { }

  public getSubcategory(id) {
    let promise = new Promise((resolve, reject) => {
      let subcategorySub = this.api.Subcategory.read(this.subcategoryId).subscribe(
        (subcategory) => {
          resolve(subcategory);
        },
        (err) => {
          reject(err);
        },
        () => {
          subcategorySub.unsubscribe();
        }
      );
    });
    return promise;
  }

  public getThreads(subcategoryId) {
    let promise = new Promise((resolve, reject) => {
      let threadsSub = this.api.Thread.list({
        subcategory_id: subcategoryId
      }).subscribe(
        (threads) => {
          resolve(threads);
        },
        (err) => {
          reject(err);
        },
        () => {
          threadsSub.unsubscribe();
        }
      );
    });
    return promise;
  }
}
