// import @ngrx
import {
    ActionReducer,
    ActionReducerMap,
    createSelector,
    createFeatureSelector,
    combineReducers,
    MetaReducer
  } from "@ngrx/store";

  // reselect
  import { compose } from "@ngrx/core/compose";
  import { RouterReducerState, routerReducer } from "@ngrx/router-store";
  import { RouterStateUrl } from "../shared/utils";

  import * as fromRouter from '@ngrx/router-store';
  
  // import environment
  import { environment } from "../../environments/environment";
  

  import * as users from "../users/users.reducers";

  /**
   * As mentioned, we treat each reducer like a table in a database. This means
   * our top level state interface is just a map of keys to inner state types.
   */
  export interface State {
    routerReducer: RouterReducerState<RouterStateUrl>;
    users: users.State;
  }
  
  /**
   * Our state is composed of a map of action reducer functions.
   * These reducer functions are called with each dispatched action
   * and the current or initial state and return a new immutable state.
   */
  export const reducers: ActionReducerMap<State> = {
    routerReducer: routerReducer,
    users: users.reducer
  };  
  
  // log all actions
  export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return function(state: State, action: any): State {
      
      return reducer(state, action);
    };
  }
  
  /**
   * By default, @ngrx/store uses combineReducers with the reducer map to compose
   * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
   * that will be composed to form the root meta-reducer.
   */
  export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger]
  : [];

/**********************************************************
 * Users Reducers
 *********************************************************/

/**
 * Returns the user state.
 * @function getUserState
 * @param {State} state Top level state.
 * @return {State}
 */
export const
    getUsersState = (state: State) => state.users;




/**
 * Returns the authenticated user
 * @function getAuthenticatedUser
 * @param {State} state
 * @param {any} props
 * @return {User}
 */
export const getAuthenticatedUser = createSelector(getUsersState, users.getAuthenticatedUser);

/**
 * Returns the authentication error.
 * @function getAuthenticationError
 * @param {State} state
 * @param {any} props
 * @return {Error}
 */
export const getAuthenticationError = createSelector(getUsersState, users.getAuthenticationError);


/**
 * Returns true if the user is authenticated
 * @function isAuthenticated
 * @param {State} state
 * @param {any} props
 * @return {boolean}
 */
export const isAuthenticated = createSelector(getUsersState, users.isAuthenticated);

/**
 * Returns true if the user is authenticated
 * @function isAuthenticated
 * @param {State} state
 * @param {any} props
 * @return {boolean}
 */
export const isAuthenticatedLoaded = createSelector(getUsersState, users.isAuthenticatedLoaded);

/**
 * Returns true if the authentication request is loading.
 * @function isAuthenticationLoading
 * @param {State} state
 * @param {any} props
 * @return {boolean}
 */
export const isAuthenticationLoading = createSelector(getUsersState, users.isLoading);


/**
 * set login role.
 * @function isGetRole
 * @param {State} state
 * @param {any} props
 * @return {boolean}
 */
export const isGetRole= createSelector(getUsersState, users.isRole);

/**
 * Returns the sign out error.
 * @function getSignOutError
 * @param {State} state
 * @param {any} props
 * @return {Error}
 */
export const getSignOutError = createSelector(getUsersState, users.getSignOutError);

/**
 * Returns the sign up error.
 * @function getSignUpError
 * @param {State} state
 * @param {any} props
 * @return {Error}
 */
export const getSignUpError = createSelector(getUsersState, users.getSignUpError);
