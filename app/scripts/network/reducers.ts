import { declareReducer } from "../declare.ts";
import { NetworkStatus } from "./models.ts";
import * as actions from "./actions.ts";

// todo: Unit Tests
export const onNetworkConnectionAcquired = declareReducer<any>(
	actions.NETWORK_CONNECTION_ACQUIRED,
	(prevState) => {
		const nextState = Object.assign({ }, prevState);
		nextState.network.status = NetworkStatus.Connected;
		return nextState;
	}
);

// todo: Unit Tests
export const onNetworkConnectionLost = declareReducer<any>(
	actions.NETWORK_CONNECTION_LOST,
	(prevState) => {
		const nextState = Object.assign({ }, prevState);
		nextState.network.status = NetworkStatus.Disconnected;
		return nextState;
	}
);
