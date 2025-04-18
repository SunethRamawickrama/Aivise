import { LoaderIcon } from "lucide-react";

const Loader = () => {
  return (
    <div className="h-96 flex items-center justify-center">
      <LoaderIcon className="size-6 animate-spin" />
    </div>
  );
};

export default Loader;
