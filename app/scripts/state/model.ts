import * as authentication from "../authentication/models.ts";
import * as authorisation from "../authorisation/models.ts";
import * as network from "../network/models.ts";
import * as blog from "../blog/models.ts";

export interface IAppState {
	authentication: authentication.IAuthenticationState;
	authorisation: authorisation.IAuthorisationState;
	network: network.INetworkState;
	blog: blog.IBlogState;
	navigation: string | null;
}

export function create(): IAppState {
	return {
		authentication: authentication.create(),
		authorisation: authorisation.create(),
		network: network.create(),
		blog: blog.create(),
		navigation: null
	};
}
