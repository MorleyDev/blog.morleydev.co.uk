export enum NetworkStatus {
	Connected,
	Disconnected
}

export interface INetworkState {
	status: NetworkStatus;
}

export function create(): INetworkState {
	return {
		status: NetworkStatus.Connected
	};
}
