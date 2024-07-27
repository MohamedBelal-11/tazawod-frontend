const Checker: React.FC<{
  checked?: boolean;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
  id: string;
  label: string;
  type: "checkbox" | "radio";
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
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
}) => {
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
