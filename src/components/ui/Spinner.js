import React from "react";

const Spinner = props => {
  let styleCss = props.styleCss;
  if (styleCss === undefined) {
    styleCss = "d-flex justify-content-center";
  }

  return (
    <div className={styleCss}>
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
