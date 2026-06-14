import type { InputHTMLAttributes } from "react";

type AppInputProps = InputHTMLAttributes<HTMLInputElement>;

export function AppInput({ className = "", ...props }: AppInputProps) {
  return <input {...props} className={`os-input ${className}`.trim()} />;
}

