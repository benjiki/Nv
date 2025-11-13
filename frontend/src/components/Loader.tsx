import { DotLoader } from "react-spinners";
import React from "react";

type LoaderProps = {
  color?: string;
  loading?: boolean;
};

const Loader: React.FC<LoaderProps> = ({
  color = "#6F4E37",
  loading = true,
}) => {
  return (
    <div className="sweet-loading">
      <DotLoader
        color={color}
        loading={loading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
