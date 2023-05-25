import React, { useState } from "react";

const UnloadCheckpointButton: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const sendPostRequest = async () => {
    const url = "http://127.0.0.1:7860";
    try {
      const response = await fetch(`${url}/sdapi/v1/unload-checkpoint`, {
        method: "POST",
      });

      if (response.ok) {
        console.log("POST request successful");
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred while unloading checkpoint.");
    }
  };

  return (
    <>
      <button
        className="text-white font-semibold bg-slate-700"
        onClick={sendPostRequest}
      >
        Unload Checkpoint
      </button>
      {errorMessage && <p>{errorMessage}</p>}
    </>
  );
};

export default UnloadCheckpointButton;
