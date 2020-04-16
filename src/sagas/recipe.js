import { call, put } from "redux-saga/effects";
import { actions } from "../reducers/recipe";
import { actions as loadingActions } from "../reducers/loading";
import { fetchAllRecipes } from "../shared/recipesApi";

export function* fetchAllRecipesStart() {
  try {
    yield loadingActions.showLoader();
    const response = yield call(fetchAllRecipes);
    yield put(actions.fetchAllRecipesSucceeded(response.data.results));
  } catch (err) {
    yield put(actions.onFetchAllRecipesFailed(err.response.data));
  } finally {
    yield loadingActions.closeLoader();
  }
}

export default {};
