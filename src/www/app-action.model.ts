import { BlogLoadedSummaryAction, BlogLoadSummariesAction } from "./blog/summary/index";

export type AppAction = BlogLoadSummariesAction | BlogLoadedSummaryAction;
