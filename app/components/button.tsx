export const getClass = ({
  color = "green",
  padding = 2,
  size = "base",
  textHov = "white",
  textCol = "black",
}: {
  color?: string;
  padding?: number;
  size?: string;
  textHov?: string;
  textCol?: string;
}) =>
  `p-${padding} border-2 border-${color}-500 bg-${color}-200 ` +
  `hover:text-${textHov} hover:bg-${color}-500 border-solid text-${size} ` +
  `rounded-lg transition-all duration-300 text-${textCol}`;

const Button: React.FC<{
  onClick?: () => void;
  color?: string;
  padding?: number;
  size?: string;
  type?: "submit" | "div" | "reset";
  children?: string;
  className?: string;
  textHov?: string;
  textCol?: string;
}> = ({
  onClick,
  color,
  padding,
  size,
  type,
  children,
  className = "",
  textHov = "white",
  textCol = "black",
}) =>
  type === "div" ? (
    <div
      className={
        getClass({ color, padding, size, textHov, textCol }) +
        " inline-block text-center " +
        className
      }
      onClick={onClick}
    >
      {children}
    </div>
  ) : (
    <button
      className={
        getClass({ color, padding, size, textHov, textCol }) + " " + className
      }
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );

export default Button;
