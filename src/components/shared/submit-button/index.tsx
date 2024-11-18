import { ButtonHTMLAttributes } from "react";
import Icon from "../icon";
import { icons } from "lucide-react";

interface ButtonTextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  startIcon?: keyof typeof icons;
  endIcon?: keyof typeof icons;
}

const SubmitButton: React.FC<ButtonTextProps> = ({
  title,
  startIcon,
  endIcon,
  ...rest
}) => {
  return (
    <button
      className="py-3 px-5 text-sm disabled:opacity-50 font-medium w-full text-center text-white rounded-lg bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:opacity-90 flex justify-center items-center gap-2"
      {...rest}
    >
      {startIcon && <Icon name={startIcon} />}
      <p>{title}</p>
      {endIcon && <Icon name={endIcon} />}
    </button>
  );
};

export default SubmitButton;
