export enum AuthorisationRole {
	None,
	User,
	Admin
}

export interface IAuthorisationState {
	role: AuthorisationRole;
}

export function create(): IAuthorisationState {
	return {
		role: AuthorisationRole.None
	};
}
