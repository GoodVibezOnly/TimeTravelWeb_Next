"use client";

import React, { useState } from "react";
import axios from "axios";
import FileResizer from "react-image-file-resizer";
import Image from "next/image";

interface Props {}

interface Response {
  images: Array<{ url: string }>;
}

interface ClipResponse {
  caption: string;
}

const apiUrl = "http://127.0.0.1:7860";

const FileUploader: React.FC<Props> = ({}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [year, setYear] = useState<number>(1945);
  const [base64Image, setBase64Image] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [response, setResponse] = useState<Response>({ images: [] });
  const [clipResponse, setClipResponse] = useState<Response>();
  var [clipPrompt, setClipPrompt] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsProcessed(false);
    if (event.target.files) {
      const file = event.target.files[0];
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        alert("Only PNG and JPEG files are allowed");
        return;
      }

      // Check file size (max 50MB)
      if (file.size > 50000000) {
        alert("File size is too big");
        return;
      }
      try {
        FileResizer.imageFileResizer(
          file,
          512,
          512,
          file.type.split("/")[1],
          100,
          0,
          (uri) => {
            setSelectedFile(file);
            setBase64Image(uri as string);
            setCroppedImage(uri as string);
          },
          "base64"
        );
      } catch (err) {
        console.error("something went wrong with the image resizer");
      }
    }
  };

  const handleBackButton = () => {
    setIsProcessed(false);
    setShowOriginal(false);
    setClipResponse(undefined);
    setClipPrompt("");
  };

  const handleShowOriginalButton = () => {
    setShowOriginal(!showOriginal);
  };

  const handleClick = async () => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile as Blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setBase64Image(base64data as string);
    };

    const payloadInterrogate = {
      image: base64Image,
      model: "clip",
    };

    try {
      const clipResponse = await axios.post<ClipResponse>(
        `${apiUrl}/sdapi/v1/interrogate`,
        payloadInterrogate
      );

      clipPrompt = clipResponse.data.caption;
      console.log("POST request");
      setIsLoading(true);
      console.log("clip:" + clipPrompt);

      const fetchPrompt = await fetch("api/getPrompt", {
        method: "POST",
        body: JSON.stringify({ year: year, clipPrompt: clipPrompt }),
      });
      const promptResponse = await fetchPrompt.json();

      console.log(promptResponse.promptText);
      const payload = {
        prompt: promptResponse.promptText,
        negatives:
          "painting, render, distorted face, Overexposed, render, lowquality, deformed bodys, text, distorted face, picture frame, oversaturated, overexposed, underexposed, painting, distorted, writing, border, multiple images, blurry, watermark, unrealistic, lowresolution, lowquality, lowcontrast, pixelated, noisy, unnatural, artefact, moiré, motion blur, compression artefacts",
        steps: 35,
        height: 512,
        width: 512,
        sampler_index: "Euler a",
        restoreFaces: "true",
        alwayson_scripts: {
          controlnet: {
            args: [
              {
                input_image: base64Image,
                module: "canny",
                model: "control_v11p_sd15_canny [d14c016b]",
                weight: 0.7,
                lowvram: false,
                // "guessmode": false,
              },
            ],
          },
        },
      };
      try {
        const response = await axios.post<Response>(
          `${apiUrl}/sdapi/v1/txt2img`,
          payload
        );
        setResponse(response.data);
        console.log("POST request successful");
        setIsLoading(false);
        setIsProcessed(true);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setShowError(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setSelectedFile(null);
    }
  };

  return (
    <div className="">
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileSelect}
      />
      {selectedFile !== null ? (
        <div>
          {isLoading ? (
            <div>
              <div className="centerContainer">
                <div className="upload">
                  <Image
                    src={croppedImage}
                    alt="Uploaded file preview"
                    width={512}
                    height={512}
                  />
                </div>
                <div className="loading">
                  <div className="loadingAnimation">⏳</div>
                </div>
              </div>
              <div className="text">
                <h2>
                  your image is being processed.<p>This may take a while!</p>{" "}
                </h2>
              </div>
            </div>
          ) : isProcessed ? (
            <div>
              {showOriginal ? (
                <div>
                  {/* TODO: Open popup with image in fullscreen */}
                  <Image
                    className="clickableImages"
                    onClick={handleShowOriginalButton}
                    src={croppedImage}
                    alt="The original uplaod."
                    width={512}
                    height={512}
                  />
                  <h1>original image</h1>
                  <button onClick={handleShowOriginalButton}>
                    show {year}
                  </button>
                  <button onClick={handleBackButton}>back</button>
                </div>
              ) : (
                <div>
                  <div>
                    <Image
                      className="clickableImages"
                      onClick={handleShowOriginalButton}
                      src={`data:image/png;base64,${response.images[0]}`}
                      alt="cool"
                      width={512}
                      height={512}
                    />
                    <h1>{year}</h1>
                    <button onClick={handleShowOriginalButton}>
                      show original
                    </button>
                    <button onClick={handleBackButton}>back</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div>
                <Image
                  src={croppedImage}
                  alt="Uploaded file preview"
                  width={512}
                  height={512}
                />
              </div>

              {showError ? (
                <div>
                  <h2 className="h2Error">
                    <p className="h1Error">Oops! </p>{" "}
                    <p> Something went wrong on our server.</p>{" "}
                    <p>We apologize for the inconvenience. </p>Please try again
                    later.
                  </h2>
                </div>
              ) : (
                <div>
                  <h2>Select year</h2>
                  <h1>{year}</h1>
                  <div>
                    <input
                      type="range"
                      className="RangeInputField"
                      min="1900"
                      max="2013"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <button className="startButton" onClick={handleClick}>
                      Lets Go
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="centerContainer">
          <div className="upload">Please Upload an Image</div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
