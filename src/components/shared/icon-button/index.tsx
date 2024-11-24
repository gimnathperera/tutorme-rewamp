import { cn } from "@/lib/utils";
import { icons } from "lucide-react";
import Icon from "../icon";

interface IconButtonProps {
  icon: keyof typeof icons;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  className,
  ...rest
}) => {
  return (
    <button
      className={cn("hover:bg-lightwhite p-1 rounded-full", className)}
      {...rest}
    >
      <Icon name={icon} size={18} />
    </button>
  );
};

export default IconButton;
