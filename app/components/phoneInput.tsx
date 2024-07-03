import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { PhoneInputProps } from "react-phone-input-2";

const PhoneInputComponent: React.FC<PhoneInputProps> = (
  props: PhoneInputProps
) => {
  return <PhoneInput {...props} countryCodeEditable={false} />;
};

export default PhoneInputComponent;
