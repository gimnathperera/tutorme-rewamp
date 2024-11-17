import { icons, LucideProps } from "lucide-react";

interface IconProps extends Omit<LucideProps, "size"> {
  name: keyof typeof icons;
  size?: number | string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, color, size, className }) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return null; // Handle gracefully when the icon name is invalid
  }

  return <LucideIcon color={color} size={size} className={className} />;
};

export default Icon;
