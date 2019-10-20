import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService, SanitizeService } from '../../../services';

@Component({
  selector: 'app-route-subcategory',
  templateUrl: './subcategory.route.html',
  styleUrls: ['./subcategory.route.scss']
})
export class BoardSubcategoryComponent implements OnDestroy, OnInit {

  public moment = moment;

  public subcategoryId = null;
  public subcategory = null;
  public subcategoryLoaded = false;
  public threads = [];

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Board',
      link: '/board',
    },
    {
      text: 'Subcategory',
      link: null,
    }
  ];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public sanitize: SanitizeService,
  ) { }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.subcategoryId = params.id;
      this.getSubcategory(this.subcategoryId).then((subcategory) => {
        this.subcategory = subcategory;
        this.breadcrumbs[2].text = this.subcategory.name;
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
    this.subcategoryLoaded = false;
    let promise = new Promise((resolve, reject) => {
      let subcategorySub = this.api.BoardSubcategories.read(id).subscribe(
        (subcategory) => {
          this.subcategoryLoaded = true;
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
      let threadsSub = this.api.BoardThreads.list({
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
