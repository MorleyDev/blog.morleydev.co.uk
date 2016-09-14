import * as React from "react";

export interface INetworkIndicatorProps {
	connected: boolean;
}

export function NetworkIndicator(props: INetworkIndicatorProps): JSX.Element {
	return !props.connected && <span className="network-indicator text-danger" title="Network connection lost">
		<i className="fa fa-wifi" aria-hidden="hidden"></i>
	</span>;
}
