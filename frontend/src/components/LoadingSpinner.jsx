import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size = "medium" }) => {
  const sizes = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8"
  };

  return (
    <Loader2 className={`animate-spin ${sizes[size]}`} />
  );
};

export default LoadingSpinner;