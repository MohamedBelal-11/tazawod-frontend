"use client";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  InputHTMLAttributes,
  useState,
} from "react";
import { EyeIcon } from "@heroicons/react/24/solid";
import { EyeSlashIcon } from "@heroicons/react/24/solid";

interface PasswordInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  divclassname?: string;
  divStyle?: React.CSSProperties;
}

const PasswordInput = (props: PasswordInputProps) => {
  const [hidden, setHidden] = useState(true);

  return (
    <div className={props.divclassname} style={props.divStyle}>
      <div
        className={"absolute w-mi h-min p-2 rounded-full hover:bg-gray-200"}
        style={{
          transition: "0.3s",
          top: "50%",
          translate: "0 -50%",
          zIndex: "1",
          right: props.dir === "ltr" ? "10px" : undefined,
          left: props.dir !== "ltr" ? "10px" : undefined,
        }}
        onClick={() => {
          setHidden(!hidden);
        }}
      >
        {hidden ? <EyeIcon width={20} /> : <EyeSlashIcon width={20} />}
      </div>
      <input {...props} type={hidden ? "password" : "text"} />
    </div>
  );
};

export default PasswordInput;
