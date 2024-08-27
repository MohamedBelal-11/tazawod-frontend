import { Field, Label, Switch } from "@headlessui/react";

const Checker: React.FC<{
  checked?: boolean;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
  id: string;
  label: string;
  type: "checkbox" | "radio" | "switch";
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  setChecked?(checked: boolean): void;
}> = ({
  className = "",
  style,
  id,
  label,
  type,
  value,
  onChange,
  checked,
  disabled,
  setChecked
}) => {
  if (type == "switch") {
  return (
    <Field className="flex justify-between items-center p-2 last:mb-3 first:pt-0">
      <Label htmlFor={id}>{label}</Label>
      <Switch
      dir="ltr"
        id={id}
        checked={checked}
        onChange={setChecked}
        value={value}
        disabled={disabled}
        className="group inline-flex h-6 min-w-11 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-green-600"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
      </Switch>
    </Field>
  )

  }
  return (
    <div className={"flex gap-2 " + className} style={style}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        id={id}
        checked={checked}
        disabled={disabled}
      />
    </div>
  );
};

export default Checker;
