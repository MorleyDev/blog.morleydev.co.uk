import { StateController } from "./state/controller.ts";
import { IAppState } from "./state/model.ts";
import { IStateStore } from "./state/store.ts";
import { getContext } from "./context.ts";

export function createControllers(): [IStateStore<IAppState>, any[]] {
	const context = getContext();

	const stateController = new StateController(context);

	return [stateController.getState(), [stateController]];
}
