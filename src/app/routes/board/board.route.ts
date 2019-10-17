import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService, SanitizeService } from '../../services';

@Component({
  selector: 'app-route-board',
  templateUrl: './board.route.html',
  styleUrls: ['./board.route.scss']
})
export class BoardComponent implements OnDestroy, OnInit {

  public categories = [];
  public categoriesLoaded = false;

  public onlineUsers = [];

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Board',
      link: null,
    }
  ];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private sanitize: SanitizeService,
  ) { }

  public ngOnInit() {
    this.getCategories().then((categories: any) => {
      this.categories = categories.map((c) => {
        c.subcategories = [];
        c.subcategoriesLoaded = false;
        return c;
      });
      this.categories.forEach((c) => {
        this.getSubcategories(c).then((subcategories: any) => {
          c.subcategories = subcategories.map((subc) => {
            subc.description_clean = this.sanitize.cleanHtml(subc._description_rendered);
            return subc;
          });
        });
      });
    });
    this.getOnlineUsers().then((onlineUsers: any) => {
      this.onlineUsers = onlineUsers;
    });
  }

  public ngOnDestroy() { }

  public getCategories() {
    this.categoriesLoaded = false;
    let promise = new Promise((resolve, reject) => {
      let categoriesSub = this.api.BoardCategories.list().subscribe(
        (categories) => {
          this.categoriesLoaded = true;
          resolve(categories);
        },
        (err) => {
          reject(err);
        },
        () => {
          categoriesSub.unsubscribe();
        },
      );
    });
    return promise;
  }

  public getSubcategories(parent) {
    parent.subcategoriesLoaded = false;
    let promise = new Promise((resolve, reject) => {
      let subcategoriesSub = this.api.BoardSubcategories.list({
        parent_id: parent.id,
      }).subscribe(
        (subcategories) => {
          parent.subcategoriesLoaded = true;
          resolve(subcategories);
        },
        (err) => {
          reject(err);
        },
        () => {
          subcategoriesSub.unsubscribe();
        },
      );
    });
    return promise;
  }

  public getOnlineUsers() {
    let promise = new Promise((resolve, reject) => {
      let onlineUsersSub = this.api.BoardProfiles.listRoute('get', 'online', {}, {}).subscribe(
        (onlineUsers) => {
          resolve(onlineUsers);
        },
        (err) => {
          reject(err);
        },
        () => {
          onlineUsersSub.unsubscribe();
        },
      );
    });
    return promise;
  }

  public sanitized(str) {
    return this.sanitize.cleanHtml(str);
  }
}
