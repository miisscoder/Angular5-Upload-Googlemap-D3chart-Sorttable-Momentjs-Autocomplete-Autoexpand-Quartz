// import actions
import { Actions, ActionTypes } from "./users.actions";

// import models
import { User } from "../core/models/user";

/**
 * The state.
 * @interface State
 */
export interface State {

  // boolean if user is authenticated
  authenticated: boolean;

  // error message
  error?: string;

  // true if we have attempted existing auth session
  loaded: boolean;

  // true when loading
  loading: boolean;

  // set role 1 'admin' and 2 'user'
  role: number

  // the authenticated user
  user?: User;
}

/**
 * The initial state.
 */
const initialState: State = {
  authenticated: false,
  role: 0,
  loaded: false,
  loading: false
};

/**
 * The reducer function.
 * @function reducer
 * @param {State} state Current state
 * @param {Actions} action Incoming action
 */


export function reducer(state: State = initialState, action: Actions): State {
    
  switch (action.type) {
      case ActionTypes.AUTHENTICATE:
      return Object.assign({}, state, {
        error: undefined,
        loading: true
      });

      case ActionTypes.AUTHENTICATED_ERROR:
      return Object.assign({}, state, {
          authenticated: false,
        error: action.payload.error.message,
        loaded: true
      });

      case ActionTypes.AUTHENTICATED_SUCCESS:
      return Object.assign({}, state, {
        authenticated: action.payload.authenticated,
        loaded: true,
        user: action.payload.user
      });

    case ActionTypes.AUTHENTICATE_ERROR:
    case ActionTypes.SIGN_UP_ERROR:
      return Object.assign({}, state, {
          authenticated: false,
        error: action.payload.error.message,
        loading: false
      });

    case ActionTypes.AUTHENTICATE_SUCCESS:
    case ActionTypes.SIGN_UP_SUCCESS:
      const user: User = action.payload.user;

      // verify user is not null
      if (user === null) {
        return state;
      }

      // is user member
      if (user.userId === 'user@user') {
          sessionStorage.setItem('userId', user.userId);
          sessionStorage.setItem('password', user.password);
        return Object.assign({}, state, {
          authenticated: true,
          error: undefined,
          loading: true,
          role: 1,
          user: user
        });
      }
      // is user admin
      else if (user.userId === 'admin@admin.com') {
          sessionStorage.setItem('userId', user.userId);
          sessionStorage.setItem('password', user.password);

        return Object.assign({}, state, {
          authenticated: true,
          error: undefined,
          loading: true,
          role: 2,
          user: user
        });

      }
      // is user new
      else if (user.userId){
        return Object.assign({}, state, {
          authenticated: true,
          error: undefined,
          loading: false,
          user: user
        });
      }

        

    case ActionTypes.SIGN_UP:
      return Object.assign({}, state, {
        authenticated: false,
        error: undefined,
        loading: true
      });

    case ActionTypes.SIGN_OUT_SUCCESS:
      return Object.assign({}, state, {
        authenticated: false,
        loading: false,
        role: 0,
        error: undefined,
        user: undefined
      });

    case ActionTypes.SIGN_OUT_ERROR:
      return Object.assign({}, state, {
        authenticated: true,
        user: undefined
      });

    

    default:
      return state;
  }
}

/**
 * Returns true if the user is authenticated.
 * @function isAuthenticated
 * @param {State} state
 * @returns {boolean}
 */
export const isAuthenticated = (state: State) => state.authenticated;

/**
 * Returns true if the authenticated has loaded.
 * @function isAuthenticatedLoaded
 * @param {State} state
 * @returns {boolean}
 */
export const isAuthenticatedLoaded = (state: State) => state.loaded;

/**
 * Return the users state
 * @function getAuthenticatedUser
 * @param {State} state
 * @returns {User}
 */
export const getAuthenticatedUser = (state: State) => state.user;

/**
 * Returns the authentication error.
 * @function getAuthenticationError
 * @param {State} state
 * @returns {Error}
 */
export const getAuthenticationError = (state: State) => state.error;

/**
 * Returns true if request is in progress.
 * @function isLoading
 * @param {State} state
 * @returns {boolean}
 */
export const isLoading = (state: State) => state.loading;


/**
 * Returns true if request is in progress.
 * @function isRole
 * @param {State} state
 * @returns {number}
 */
export const isRole = (state: State) => state.role;

/**
 * Returns the sign out error.
 * @function getSignOutError
 * @param {State} state
 * @returns {Error}
 */
export const getSignOutError = (state: State) => state.error;

/**
 * Returns the sign up error.
 * @function getSignUpError
 * @param {State} state
 * @returns {Error}
 */
export const getSignUpError = (state: State) => state.error;
