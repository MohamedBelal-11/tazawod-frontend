declare module 'react-phone-input-2' {
  import * as React from 'react';

  interface PhoneInputProps {
    value?: string;
    country?: string;
    onlyCountries?: string[];
    preferredCountries?: string[];
    excludeCountries?: string[];
    placeholder?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    onChange?: (value: string, data: object, event: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => void;
    isValid?: (inputNumber: string, country: object, formattedValue: string) => boolean | string;
    containerClass?: string;
    inputClass?: string;
    buttonClass?: string;
    dropdownClass?: string;
    autoFormat?: boolean;
    disabled?: boolean;
    disableDropdown?: boolean;
    disableCountryCode?: boolean;
    enableLongNumbers?: boolean;
    countryCodeEditable?: boolean;
    regions?: string | string[];
  }

  const PhoneInput: React.FC<PhoneInputProps>;

  export default PhoneInput;
}