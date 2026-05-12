import React from "react";

declare module "@material-tailwind/react" {
  interface GenericProps {
    placeholder?: any;
    onPointerEnterCapture?: any;
    onPointerLeaveCapture?: any;
    onResize?: any;
    onResizeCapture?: any;
  }

  export interface CardProps extends GenericProps, React.HTMLAttributes<HTMLDivElement> {
    variant?: "filled" | "gradient";
    color?: any;
    shadow?: boolean;
  }
  export interface CardHeaderProps extends GenericProps, React.HTMLAttributes<HTMLDivElement> {
    variant?: "filled" | "gradient";
    color?: any;
    floated?: boolean;
    shadow?: boolean;
  }
  export interface CardBodyProps extends GenericProps, React.HTMLAttributes<HTMLDivElement> {}
  export interface CardFooterProps extends GenericProps, React.HTMLAttributes<HTMLDivElement> {}
  
  export interface TypographyProps extends GenericProps, React.HTMLAttributes<HTMLElement> {
    variant?: any;
    color?: any;
    as?: any;
  }
  
  export interface ButtonProps extends GenericProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: any;
    size?: any;
    color?: any;
    fullWidth?: boolean;
    ripple?: boolean;
  }
  
  export interface IconButtonProps extends GenericProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: any;
    size?: any;
    color?: any;
    ripple?: boolean;
  }

  export interface InputProps extends GenericProps, React.InputHTMLAttributes<HTMLInputElement> {
    variant?: any;
    size?: any;
    color?: any;
    label?: string;
    error?: boolean;
    success?: boolean;
    icon?: React.ReactNode;
  }
}
