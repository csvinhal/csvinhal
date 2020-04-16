import Amplify from "aws-amplify";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import App from "./App";
import { StateProvider } from "./context/StateContext";
import "./index.scss";
import { initialState, reducer } from "./reducers/stateContext";
import toastReducer from "./reducers/toast";
import loadingReducer from "./reducers/loading";
import recipeReducer from "./reducers/recipe";
import * as serviceWorker from "./serviceWorker";
import watchAuth from "./sagas";

Amplify.configure({
  Auth: {
    mandatorySignId: true,
    region: process.env.REACT_APP_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN,
      scope: process.env.REACT_APP_COGNITO_SCOPE,
      redirectSignIn: process.env.REACT_APP_COGNITO_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.REACT_APP_COGNITO_REDIRECT_SIGN_OUT,
      responseType: process.env.REACT_APP_COGNITO_RESPONSE_TYPE,
    },
  },
});

const rootReducer = combineReducers({
  toast: toastReducer,
  loader: loadingReducer,
  recipe: recipeReducer,
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(watchAuth);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
