const getClass = ({
  color = "green",
  padding = 2,
  size = "base",
}: {
  color?: string;
  padding?: number;
  size?: string;
}) =>
  `p-${padding} border-2 border-${color}-500 bg-${color}-200 ` +
  `hover:text-white hover:bg-${color}-500 border-solid text-${size} ` +
  "rounded-lg transition-all duration-300";

const Button: React.FC<{
  onClick?: () => void;
  color?: string;
  padding?: number;
  size?: string;
  type?: "submit" | "div" | "reset";
  children?: string;
}> = ({ onClick, color, padding, size, type, children }) =>
  type === "div" ? (
    <div
      className={getClass({ color, padding, size }) + " inline-block"}
      onClick={onClick}
    >
      {children}
    </div>
  ) : (
    <button
      className={getClass({ color, padding, size })}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );

export default Button;