"use client";

import React, { useEffect, useState } from "react";
import FileResizer from "react-image-file-resizer";
import NextImage from "next/image";
import ts from "typescript";
import exifr from "exifr";
import axios from "axios";
import openai from "openai";
import ImagePopUp from "./ImagePopUp";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Props {}

interface Response {
  images: Array<{ url: string }>;
}

const FileUploader: React.FC<Props> = ({}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [year, setYear] = useState<number>(1945);
  const [base64Image, setBase64Image] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [response, setResponse] = useState<Response>({ images: [] });
  const [clipResponse, setClipResponse] = useState<Response>();
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [gifResponse, setGifResponse] = useState<any>();
  const [buffer, setBuffer] = useState<any>();
  const [imageLocation, setImageLocation] = useState<any>();
  const [PopUpOpen, setPopUpOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");

  const [responseImage, setResponseImages] = useState<string>("");
  const [originalImage, setOriginalImage] = useState<string>("");

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
        const imageLocation = await exifr.gps(file);
        if (imageLocation) {
          console.log(imageLocation.latitude, imageLocation.longitude);
          const location = await getCityAndCountry(
            imageLocation.latitude,
            imageLocation.longitude
          );
          setImageLocation(location);
        } else {
          setImageLocation("");
        }

        cropImage(file, 512, 512, (uri: string) => {
          setSelectedFile(file);
          setBase64Image(uri);
          setCroppedImage(uri);
        });

        setSelectedImage(URL.createObjectURL(file));
      } catch (err) {
        console.error("Something went wrong with the image resizer");
      }
    }
  };

  function cropImage(
    file: File,
    width: number,
    height: number,
    callback: (uri: string) => void
  ) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        let cropX, cropY, cropWidth, cropHeight;
        const aspectRatio = width / height;
        if (img.width / img.height > aspectRatio) {
          cropWidth = img.height * aspectRatio;
          cropHeight = img.height;
          cropX = (img.width - cropWidth) / 2;
          cropY = 0;
        } else {
          cropWidth = img.width;
          cropHeight = img.width / aspectRatio;
          cropX = 0;
          cropY = (img.height - cropHeight) / 2;
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            width,
            height
          );
        }

        const base64Image = canvas.toDataURL(file.type);

        // Invoke the callback function with the cropped image URI
        callback(base64Image);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function getCityAndCountry(
    latitude: number,
    longitude: number
  ): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    try {
      const response = await axios.get(url);
      const address = response.data.address;
      const country = address.country;
      const city = address.city || address.town || address.village;
      return `${country}, ${city}`;
    } catch (error) {
      console.error("Error retrieving location information:", error);
    }

    return "";
  }

  const handleBackButton = () => {
    setIsProcessed(false);
    setShowOriginal(false);
    setClipResponse(undefined);
  };

  const handleShowOriginalButton = () => {
    setShowOriginal(!showOriginal);
  };

  const handleClick = async () => {
    console.log(negativePrompt);
    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile as Blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setBase64Image(base64data as string);
    };
    try {
      /**
       * * Interrogate the image
       */
      console.log("START IMAGE INTERROGATION");
      setStatus("Interrogating image...");
      const fetchCaption = await fetch("api/interrogateImage", {
        method: "POST",
        body: JSON.stringify({ image: base64Image }),
      });
      const interrogationResponse = await fetchCaption.json();
      const clipPrompt = interrogationResponse.caption;
      setIsLoading(true);
      console.log("clip:" + clipPrompt);
      console.log("END IMAGE INTERROGATION");

      console.log(clipPrompt);

      /**
       * * Handle GPT Prompt Response
       */
      console.log("START GPT VERIFICATION");
      setStatus("veryfying prompt...");
      const fetchGPT = await fetch("api/getGPT", {
        method: "POST",
        body: JSON.stringify({
          year: year,
          promptText: clipPrompt,
        }),
      });

      console.log("GPT Request Successful");
      const gptResponse = await fetchGPT.json();
      if (gptResponse.promptText.startsWith("No")) {
        console.log(
          "Everything existed in the prompt: No need for modification"
        );
      } else {
        console.log("Prompt needs to be modified");
        console.log("The Following Things did not exist in " + year + ":");
      }
      console.log("END GPT VERIFICATION");
      console.log("This is the gpt response:");
      console.log(gptResponse.promptText);
      /**
       * * Get prompt
       */
      console.log("START PROMPT FETCH");
      setStatus("Fetching prompt...");
      const fetchPrompt = await fetch("api/getPrompt", {
        method: "POST",
        body: JSON.stringify({
          year: year,
          clipPrompt: clipPrompt,
          location: imageLocation,
        }),
      });
      const promptResponse = await fetchPrompt.json();
      console.log(promptResponse.promptText);
      console.log("END PROMPT FETCH");

      /**
       * * Remove words from gpt response from promptResponse.promptText
       */

      console.log("START GPT PROMPT MODIFICATION");
      setStatus("Modifying prompt...");
      const gptWords = gptResponse.promptText.split(/[,\s]+/);
      let modifiedPrompt = promptResponse.promptText;
      for (let i = 0; i < gptWords.length; i++) {
        const regex = new RegExp(gptWords[i], "g");
        modifiedPrompt = modifiedPrompt.replace(regex, "");
      }
      console.log("END GPT PROMPT MODIFICATION");
      
      console.log("Modified GPT Prompt Text:");
      
      /**
       * * Get negative prompt
       */
      console.log("START NEGATIVE PROMPT FETCH");
      setStatus("Fetching negative prompt...");

      const fetchNegativePrompt = await fetch("api/getNegativePrompt", {
        method: "POST",
        body: JSON.stringify({
          year: year,
          gptPrompt: gptResponse.promptText,
        }),
      });
      const negativePromptResponse = await fetchNegativePrompt.json();
      console.log(negativePromptResponse);
      console.log("END NEGATIVE PROMPT FETCH");

      /**
       * * Convert image
       */
      setStatus("Converting image...");
      console.log("START IMAGE CONVERSION");

      try {
        const fetchConvert = await fetch("api/convertImage", {
          method: "POST",
          body: JSON.stringify({
            prompt: modifiedPrompt,
            negativePrompt: negativePromptResponse,
            image: base64Image,
          }),
        });
        console.log("current negatives" + negativePrompt);
        const convertResponse = await fetchConvert.json();
        setResponseImages(`data:image/png;base64,${convertResponse.images[0]}`);
        console.log("END IMAGE CONVERSION");
        setStatus("");
        setImageLocation("");
        setIsLoading(false);
        setIsProcessed(true);
        setNegativePrompt("");
      } catch (error) {
        console.error(error);
        setImageLocation("");
        setIsLoading(false);
        setShowError(true);
      }
    } catch (error) {
      console.error(error);
    }
  };



  const handleClickGif = async () => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile as Blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setBase64Image(base64data as string);
    };

    try {
      /**
       * * Interrogate the image
       */
      console.log("START IMAGE INTERROGATION");
      setStatus("Interrogating image...");
      const fetchCaption = await fetch("api/interrogateImage", {
        method: "POST",
        body: JSON.stringify({ image: base64Image }),
      });
      const interrogationResponse = await fetchCaption.json();
      const clipPrompt = interrogationResponse.caption;
      setIsLoading(true);
      console.log("clip:" + clipPrompt);
      console.log("END IMAGE INTERROGATION");

      console.log(clipPrompt);

      let prompts = [];

      console.log("START PROMPT FETCH");
      setStatus("Fetching prompt...");

      for (let i = 1880; i <= 2020; i = i + 5) {
        const fetchPrompt = await fetch("api/getPrompt", {
          method: "POST",
          body: JSON.stringify({
            year: i,
            clipPrompt: clipPrompt,
            location: imageLocation,
          }),
        });
        const promptResponse = await fetchPrompt.json();
        prompts.push(promptResponse.promptText);
      }

      console.log("END PROMPT FETCH");
      console.log(prompts);

      setStatus("Converting image...");
      console.log("START IMAGE CONVERSION");
      let convertedImages = [];

      for (let i = 0; i < prompts.length; i++) {
        const fetchConvert = await fetch("api/convertImage", {
          method: "POST",
          body: JSON.stringify({
            prompt: prompts[i],
            image: base64Image,
          }),
        });
        const convertResponse = await fetchConvert.json();
        convertedImages.push(convertResponse.images[0]);
        setSelectedImage(convertResponse.images[0]);
      }
      console.log("END IMAGE CONVERSION");
      setStatus("");
      setIsLoading(false);
      setIsProcessed(true);
      setGifResponse(convertedImages);
      generateGif(convertedImages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(negativePrompt);
  }, [negativePrompt]);

  const generateGif = async (images: any[]) => {
    //@ts-expect-error
    const gif = new GIF({
      workers: 2,
      quality: 10,
    });
    console.log(images);

    function loadImage(uri: string) {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          gif.addFrame(img, { copy: true, delay: 200 }); // Add the image to the GIF with a delay of 200 milliseconds
          resolve();
        };
        img.onerror = reject;
        img.src = uri;
      });
    }

    try {
      for (const uri of images) {
        await loadImage("data:image/png;base64," + uri);
      }

      gif.render(); // Start rendering the GIF

      // Handle the GIF rendering completion
      gif.on("finished", function (blob: Blob | MediaSource) {
        const url = URL.createObjectURL(blob);
        setBuffer(url);
      });
    } catch (error) {
      console.error("Error creating GIF:", error);
    }
  };

  const handleResponseImageClick = () => {
    if (showOriginal) {
      setSelectedImage(croppedImage);
    } else {
      setSelectedImage(responseImage);
    }
    setPopUpOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (PopUpOpen) {
          if (selectedImage === croppedImage) {
            setSelectedImage(responseImage);
            setShowOriginal(false);
          } else {
            setSelectedImage(croppedImage);
            setShowOriginal(true);
          }
        } else {
          setShowOriginal(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [PopUpOpen, selectedImage, croppedImage, responseImage]);

  const handleImageClick = () => {
    // setPopUpOpen(true);
    setSelectedImage(croppedImage);
  };

  return (
    <div className="">
      <h1>image TimeTravel</h1>
      <h2>Upload an image to see what it would look like in the past</h2>
      {PopUpOpen ? (
        <ImagePopUp
          onClose={() => setPopUpOpen(false)}
          image={selectedImage}
          year={year}
          showOriginal={showOriginal}
        />
      ) : (
        <div></div>
      )}

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
                    onClick={handleResponseImageClick}
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
                        onClick={handleResponseImageClick}
                        src={`${buffer}`}
                        alt="cool"
                        width={512}
                        height={512}
                      />
                    ) : (
                      <div>
                        <NextImage
                          className="clickableImages"
                          onClick={handleResponseImageClick}
                          src={responseImage}
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
                  onClick={handleImageClick}
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
                      min="1880"
                      max="2013"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                    />
                  </div>

                  <div className="twoButtons">
                    <button className="startButton" onClick={handleClick}>
                      Lets Go
                    </button>
                  
                  <button className="startButton" onClick={handleClickGif}>
                    Lets Gif
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
