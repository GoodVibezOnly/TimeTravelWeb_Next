"use client";

import React, { useState } from "react";
import axios from "axios";
import FileResizer from "react-image-file-resizer";

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

  /**
   * TODO: Move Colors to route handler
   */
  let colors: string[] = [
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
    "color",
    "colorized",
  ];

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

      if (year <= 1950) {
        console.log("year <= 1950");
        // remove every word in this string that is a color
        let prompt = clipResponse.data.caption;
        for (let i = 0; i < colors.length; i++) {
          const regex = new RegExp(colors[i] + "\\s*", "gi");
          prompt = prompt.replace(regex, "");
        }

        console.log(prompt);
        console.log(typeof prompt);
        clipPrompt = prompt;
        console.log(clipPrompt);
      } else {
        console.log("year > 1950");

        clipPrompt = clipResponse.data.caption;
      }

      console.log("POST request");
      setIsLoading(true);
      console.log("clip:" + clipPrompt);
      var prompt = getPrompt(clipPrompt);

      console.log(prompt);
      const payload = {
        prompt: prompt,
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

  /**
   * TODO: Move to API route and just call in this function
   */
  function getPrompt(clipPrompt: string) {
    console.log("This is the" + clipPrompt);

    if (year >= 1900 && year < 1910) {
      return (
        year.toString() +
        " photograph, " +
        clipPrompt +
        ", 1900s photograph, Lumière Autochrome plates, old, black and white photography, analogue photography, film grain,"
      );
    } else if (year >= 1910 && year < 1920) {
      return (
        year.toString() +
        " photograph, " +
        clipPrompt +
        ", 1910s photograph, Kodak No. 1 Autographic Special, black and white photography, film grain,"
      );
    } else if (year >= 1920 && year < 1930) {
      return (
        year.toString() +
        " photograph, " +
        clipPrompt +
        ", 1920s photograph, Kodak Autographic, black and white photography, film grain,"
      );
    } else if (year >= 1930 && year < 1940) {
      return (
        year.toString() +
        " photograph, " +
        clipPrompt +
        ", 1930s photograph, Kodak Kodachrome film, sepia photography, analogue photography, film grain, "
      );
    } else if (year >= 1940 && year < 1950) {
      return (
        year.toString() +
        " photograph, " +
        clipPrompt +
        ", 1940s photograph, Kodak Tri-X, analogue photography, film grain,"
      );
    } else if (year >= 1950 && year < 1960) {
      return (
        year.toString() +
        " photograph, " +
        clipPrompt +
        ", 1950s photograph, Kodak Ektachrome film, analogue photography, film grain,"
      );
    } else if (year >= 1960 && year < 1970) {
      return (
        year.toString() +
        " photograph, " +
        clipPrompt +
        ", 1960s photograph, Kodak Kodachrome film, analogue photography, film grain,"
      );
    } else if (year >= 1970 && year < 1980) {
      return (
        year.toString() +
        " photograph, " +
        clipPrompt +
        ", 1970s photograph, Fujifilm Velvia film, analogue photography, film grain,"
      );
    } else if (year >= 1980 && year < 1990) {
      return (
        year.toString() +
        " photograph, " +
        clipPrompt +
        ", 1980s photograph, Kodak Ektachrome film, analogue photography, film grain,"
      );
    } else if (year >= 1990 && year < 2000) {
      return (
        year.toString() +
        " photograph, " +
        clipPrompt +
        ", 1990s photograph, Fujifilm Superia film, analogue photography, film grain,"
      );
    } else if (year >= 2000 && year < 2005) {
      return (
        year.toString() +
        " photograph, " +
        clipPrompt +
        ", early 2000s photograph, color photograph, Kodak Portra film, analogue photography, film grain,"
      );
    } else if (year >= 2005 && year < 2010) {
      return (
        "Photograph taken in " +
        year.toString() +
        " modern color photograph,  " +
        clipPrompt +
        ", mid 2000s photograph, color photograph, Canon EOS 40D, Nikon digital photography,"
      );
    } else if (year >= 2010 && year < 2020) {
      return (
        "Photograph taken in " +
        year.toString() +
        ", color photograph,  " +
        clipPrompt +
        ", 2010s photograph, DSLR, Canon EOS, beautiful, Flickr,"
      );
    } else if (year >= 2020) {
      return (
        year.toString() +
        "modern photograph,  " +
        clipPrompt +
        " 2020s photograph, smartphone, iPhone, Samsung Galaxy, Google Pixel, computational photography, AI, 4K,"
      );
    } else {
      return (
        year.toString() +
        " photograph,  " +
        clipPrompt +
        ", photograph, professional, art"
      );
    }
  }

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
                  <img src={croppedImage} alt="Uploaded file preview" />
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
                  <img
                    className="clickableImages"
                    onClick={handleShowOriginalButton}
                    src={croppedImage}
                    alt="The original uplaod."
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
                    <img
                      className="clickableImages"
                      onClick={handleShowOriginalButton}
                      src={`data:image/png;base64,${response.images[0]}`}
                      alt="cool"
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
                <img src={croppedImage} alt="Uploaded file preview" />
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
