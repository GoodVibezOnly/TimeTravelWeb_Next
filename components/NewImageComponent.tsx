import React, { useState } from "react";
import axios from "axios";

interface Response {
  images: Array<{ url: string }>;
  parameters: Record<string, unknown>;
  info: string;
}

const apiUrl = "http://127.0.0.1:7860";

const NewImageComponent: React.FC = () => {
  const [response, setResponse] = useState<Response>({
    images: [],
    parameters: {},
    info: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    console.log("POST request");
    setIsLoading(true);
    const payload = {
      prompt:
        "cute kitten, spring, golden hour, bokeh, adorable, film grain, fluffy, furry, film grain, analogue photography, art, beautiful, majestic, cute face, detailed face, detailed eyes",
      negatives:
        "oversaturated, overprocessed, unnatural, distorted, ugly, blurry, dark, depressing, sad, scary, horror, nightmare, nightmare fuel, creepy, creepy crawlies, creepy pasta, watermark, render",
      steps: 35,
      height: 512,
      width: 512,
      sampler_index: "Euler a",
      restoreFaces: "true",
    };
    try {
      const response = await axios.post<Response>(
        `${apiUrl}/sdapi/v1/txt2img`,
        payload
      );
      setResponse(response.data);
      console.log("POST request successful");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Generate Image</button>
      {isLoading ? (
        <div className="loading">
          <div className="loadingAnimation">
            <div>⏳</div>
          </div>
        </div>
      ) : response.images.length > 0 ? (
        <img src={`data:image/png;base64,${response.images[0]}`} alt="" />
      ) : (
        <div className="upload"></div>
      )}
    </div>
  );
};

export default NewImageComponent;
