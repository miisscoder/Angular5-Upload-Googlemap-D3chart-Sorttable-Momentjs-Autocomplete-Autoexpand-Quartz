import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

// @ngrx
import { Store } from "@ngrx/store";

// actions
import { SignOutAction } from "../../users/users.actions";

// rxjs
import { Observable } from "rxjs/Observable";

// reducers
import {
  getAuthenticatedUser,
  State
} from "../../reducers";

// models
import { User } from "../../core/models/user";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // the authenticated user
  public user: Observable<User>;

  // check login
  loginNow: boolean;
  
  constructor(
    public router: Router,
    private store: Store<State>
  ) { }

  /**
   * @method ngOnInit
   */
  public ngOnInit() {
    // get authenticated user
    this.user = this.store.select(getAuthenticatedUser);
  }

  public keyDownFunction(event) {
      if (event.keyCode == 13) {
          this.router.navigate(['/main/result']);
      }
  }


  goto(route) {
      sessionStorage.setItem('route', route);
  }
}
