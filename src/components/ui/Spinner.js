import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const Spinner = props => {
  return (
    <CircularProgress className={props.className} style={props.style}>
      <span className="sr-only">Loading...</span>
    </CircularProgress>
  );
};

Spinner.defaultProps = {
  style: { alignSelf: "center", marginBottom: "18px" }
};

export default Spinner;
