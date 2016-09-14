import { declareReducer } from "../declare.ts";
import * as actions from "./actions.ts";
import * as assign from "../util/assign.ts";

export const onNavigateTo = declareReducer(actions.NAVIGATE_TO, (state, url) => assign.deep(state, { navigation: url }));
