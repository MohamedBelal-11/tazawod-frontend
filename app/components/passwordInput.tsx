"use client";
import {
  DetailedHTMLProps,
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
  titled?: "arabic" | "english";
}

const PasswordInput = (props: PasswordInputProps) => {
  const [hidden, setHidden] = useState(true);

  return (
    <div className={props.divclassname} style={props.divStyle}>
      <div
        className={"absolute w-min h-min p-2 rounded-full hover:bg-gray-200"}
        style={{
          transition: "0.3s",
          top: "50%",
          translate: "0 -50%",
          zIndex: "1",
          insetInlineEnd: "10px",
        }}
        onClick={() => {
          setHidden(!hidden);
        }}
      >
        {hidden ? <EyeIcon width={20} /> : <EyeSlashIcon width={20} />}
      </div>
      <input
        {...props}
        dir="ltr"
        type={hidden ? "password" : "text"}
        pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
        title={
          props.titled === "arabic"
            ? "يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل، " +
              "وتحتوي على حرف واحد على الأقل، ورقم واحد، وحرف خاص واحد"
            : props.titled === "english"
            ? "Password must be at least 8 characters long and " +
              "include at least one letter, one number, and one special character"
            : undefined
        }
      />
    </div>
  );
};

export default PasswordInput;
