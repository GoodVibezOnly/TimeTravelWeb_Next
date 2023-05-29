"use client";

import React, { useState } from "react";
import FileResizer from "react-image-file-resizer";
import NextImage from "next/image";
import {
  IResponseImage,
  IRespone,
  IinterrogateRequest,
  IinterrogateResponse,
  IgetPromptResponse,
  IconvertRequest,
  IgetPromptRequest,
} from "@/helpers/interfaces";
import { generateGif } from "@/helpers/generateGif";

interface Props {}

const FileUploader: React.FC<Props> = ({}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [year, setYear] = useState<number>(1945);
  const [base64Image, setBase64Image] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [response, setResponse] = useState<IResponseImage>();
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [buffer, setBuffer] = useState<any>();

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
  };

  const handleShowOriginalButton = () => {
    setShowOriginal(!showOriginal);
  };

  const startHandleClick = () => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile as Blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setBase64Image(base64data as string);
    };
  };

  const interrogateImage = async () => {
    console.log("START IMAGE INTERROGATION");
    setStatus("Interrogating image...");
    let clipPrompt = "";

    const request: IinterrogateRequest = {
      image: base64Image,
    };

    try {
      const fetchCaption = await fetch("api/interrogateImage", {
        method: "POST",
        body: JSON.stringify({ image: base64Image }),
      });
      const interrogationResponse =
        (await fetchCaption.json()) as IinterrogateResponse;
      clipPrompt = interrogationResponse.caption;
      setIsLoading(true);
      console.log("clip:" + clipPrompt);
      console.log("END IMAGE INTERROGATION");
    } catch (error) {
      console.error(error);
      clipPrompt = "ERROR";
    }

    return clipPrompt;
  };

  const handleClick = async () => {
    startHandleClick();

    const clipPrompt = await interrogateImage();
    if (clipPrompt === "ERROR") {
      setIsLoading(false);
      setShowError(true);
      return;
    }
    console.log(clipPrompt);

    const getPromptRequest: IgetPromptRequest = {
      year: year,
      clipPrompt: clipPrompt,
    };

    try {
      /**
       * * Get prompt
       */
      console.log("START PROMPT FETCH");
      setStatus("Fetching prompt...");
      const fetchPrompt = await fetch("api/getPrompt", {
        method: "POST",
        body: JSON.stringify(getPromptRequest),
      });
      const promptResponse = (await fetchPrompt.json()) as IgetPromptResponse;
      console.log(promptResponse.prompt);
      console.log("END PROMPT FETCH");

      /**
       * * Convert image
       */
      setStatus("Converting image...");
      console.log("START IMAGE CONVERSION");

      const convertRequest: IconvertRequest = {
        prompt: promptResponse.prompt,
        image: base64Image,
      };

      try {
        const fetchConvert = await fetch("api/convertImage", {
          method: "POST",
          body: JSON.stringify(convertRequest),
        });
        const convertResponse = (await fetchConvert.json()) as IRespone;
        setResponse(convertResponse.images[0]);
        console.log("END IMAGE CONVERSION");
        setStatus("");

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

  const handleClickGif = async () => {
    startHandleClick();

    const clipPrompt = await interrogateImage();
    if (clipPrompt === "ERROR") {
      setIsLoading(false);
      setShowError(true);
      return;
    }
    console.log(clipPrompt);

    try {
      let prompts = [];

      console.log("START PROMPT FETCH");
      setStatus("Fetching prompt...");

      for (let i = 1900; i <= 2020; i = i + 5) {
        const getPromptRequest: IgetPromptRequest = {
          year: i,
          clipPrompt: clipPrompt,
        };

        const fetchPrompt = await fetch("api/getPrompt", {
          method: "POST",
          body: JSON.stringify(getPromptRequest),
        });
        const promptResponse = (await fetchPrompt.json()) as IgetPromptResponse;
        prompts.push(promptResponse.prompt);
      }

      console.log("END PROMPT FETCH");
      console.log(prompts);

      setStatus("Converting image...");
      console.log("START IMAGE CONVERSION");
      let convertedImages: Array<IResponseImage> = [];

      for (let i = 0; i < prompts.length; i++) {
        const convertRequest: IconvertRequest = {
          prompt: prompts[i],
          image: base64Image,
        };
        const fetchConvert = await fetch("api/convertImage", {
          method: "POST",
          body: JSON.stringify(convertRequest),
        });
        const convertResponse = (await fetchConvert.json()) as IRespone;
        convertedImages.push(convertResponse.images[0]);
      }
      console.log("END IMAGE CONVERSION");

      setStatus("GENERATING GIF");
      const url = generateGif(convertedImages);
      setStatus("FINISHED GIF");

      if (url === null) {
        alert("Something went wrong while generating the gif.");
        return;
      }

      setIsLoading(false);
      setIsProcessed(true);
      setStatus("");
      setBuffer(url);
    } catch (error) {
      console.error(error);
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
                  <NextImage
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
              {status !== "" && (
                <div>
                  <h3 className="text-red-500">{status}</h3>
                </div>
              )}
            </div>
          ) : isProcessed ? (
            <div>
              {showOriginal ? (
                <div>
                  {/* TODO: Open popup with image in fullscreen */}
                  <NextImage
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
                    {buffer ? (
                      <NextImage
                        className="clickableImages"
                        onClick={handleShowOriginalButton}
                        src={`${buffer}`}
                        alt="cool"
                        width={512}
                        height={512}
                      />
                    ) : (
                      <div>
                        <NextImage
                          className="clickableImages"
                          onClick={handleShowOriginalButton}
                          src={`data:image/png;base64,${response?.url}`}
                          alt="cool"
                          width={512}
                          height={512}
                        />
                        <h1> {year}</h1>
                      </div>
                    )}
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
                <NextImage
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
                  <button className="startButton" onClick={handleClickGif}>
                    Lets Gif
                  </button>
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
