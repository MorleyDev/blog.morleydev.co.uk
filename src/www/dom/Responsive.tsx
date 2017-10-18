import * as React from "react";
import Responsive from "react-responsive";

export const IfDesktop = ({ children }: { children: any }) => <Responsive minWidth={992} children={children} />;
export const IfTablet = ({ children }: { children: any }) => <Responsive minWidth={768} maxWidth={992} children={children} />;
export const IfMobile = ({ children }: { children: any }) => <Responsive maxWidth={768} children={children} />;
export const IfDefault = ({ children }: { children: any }) => <Responsive minWidth={768} children={children} />;

export const IfTabletOrLarger = ({ children }: { children: any }) => <Responsive minWidth={768} children={children} />;
export const IfTabletOrSmaller = ({ children }: { children: any }) => <Responsive maxWidth={992} children={children} />;
