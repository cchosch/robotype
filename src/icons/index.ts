import { CSSProperties, MouseEventHandler } from "react";
export * from "./copy";
export * from "./reload";

export type IconProps = {
    width?: string,
    height?: string,
    fill?: string,
    className?: string,
    onClick?: MouseEventHandler<SVGSVGElement>,
    style?: CSSProperties
};
