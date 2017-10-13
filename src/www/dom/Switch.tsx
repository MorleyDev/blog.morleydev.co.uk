import * as React from "react";
import { Switch as RouterSwitch } from "react-router";
import { connect } from "react-redux";

const _Switch = ({ location, children }: { location: any; children: any }) => <RouterSwitch location={location}>{children}</RouterSwitch>;

export const Switch = connect(({ location }: { location: any }) => ({ location }))(_Switch);
