import { declareWatcher } from "../declare.ts";
import { NetworkStatus } from "./models.ts";
import * as actions from "./actions.ts";

export const initialiseNetworkWatcher = declareWatcher((state, context) => context.network
	.connectionStatus()
	.debounceTime(5000)
	.distinctUntilChanged()
	.map((status: NetworkStatus) => {
		switch (status) {
			case NetworkStatus.Connected:
				return { action: actions.NETWORK_CONNECTION_ACQUIRED, data: null };
			case NetworkStatus.Disconnected:
				return { action: actions.NETWORK_CONNECTION_LOST, data: null };
			default:
				return null;
		}
	})
);
