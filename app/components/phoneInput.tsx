"use state"
import { Dispatch, SetStateAction, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"

const MyPhoneInput = ({
  onChange,
  value
}: {
  onChange: Dispatch<SetStateAction<string>>;
  value: string
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleOnChange = (value: string, data: any) => {
    // Extract the country dial code
    const countryCode = data.dialCode;
    // Remove the country code from the value
    const numberWithoutCountryCode = value.slice(countryCode.length);
    // Remove leading zeros from the local number
    const cleanedLocalNumber = numberWithoutCountryCode.replace(/^0+/, '');
    // Combine the country code with the cleaned local number
    const formattedValue = `${countryCode}${cleanedLocalNumber}`;

    setLocalValue(formattedValue);
    onChange(formattedValue);
  };

  return (
    <div className="max-w-96" dir="ltr">
      <PhoneInput
        value={localValue}
        onChange={handleOnChange}
        placeholder="الرقم"
        excludeCountries={["il"]}
        autoFormat
        countryCodeEditable={false}
        enableSearch
        searchPlaceholder="بحث"
      />
    </div>
  );
};

export default MyPhoneInput;
