import React from "react";

function NoDataMessage({ message }) {
  return (
    <div className="text-center w-full p-4 bg-grey/50 rounded-full mt-4">
      <p>{message}</p>
    </div>
  );
}

export default NoDataMessage;
