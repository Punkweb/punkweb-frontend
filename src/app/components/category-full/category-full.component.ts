import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService, ApiService, SanitizeService } from '../../services';

@Component({
  'selector': 'app-category-full',
  'templateUrl': './category-full.component.html',
  'styleUrls': ['./category-full.component.scss']
})
export class CategoryFullComponent implements OnDestroy, OnInit {

  public user = null;
  public authenticated = false;
  public superuser = false;
  public subcategories = [];

  private _category = null;
  private authSub: Subscription = null;

  constructor(
    public sanitize: SanitizeService,
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
  ) { }

  public ngOnInit() {
    this.authSub = this.auth.user$.subscribe((user) => {
      this.user = user;
      this.authenticated = !!user.id;
      this.superuser = user.is_superuser;
    });
  }

  public ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  @Input()
  public get category() {
    return this._category;
  }

  public set category(value) {
    this._category = value;
    this.api.Subcategory.paged({
      parent_id: this._category.id,
    }).subscribe((subcategories) => {
      this.subcategories = subcategories;
    });
  }
}
