import React from "react";

const TextPopUp = () => {
  return (
    <div className="backdrop">
      <div className="PopUpContainer">
        <div className="popUpWrapperBackground">
          <button className="closePopUpButton">
            <span className="closeSymbol">✕</span>
          </button>

          <div className="popUpWrapper">
            <div>
              <h1>Image TimeTravel</h1>
              <h2>Created by:</h2>
              <ul className="creditsList">
                <li className="creditItem">
                  <a href="https://github.com/GoodVibezOnly" target="_blank">Alexander Gärtner</a>
                </li>
                <li className="creditItem">
                  <a href="https://github.com/s1910238061" target="_blank">Felix Rader</a>
                </li>
              </ul>

              <h2>technologies used:</h2>
              <ul className="creditsList">
                <li className="creditItem">
                  <a href="https://stability.ai/stablediffusion" target="_blank">
                    Stable Diffusion
                  </a>
                </li>
                <li className="creditItem">
                  <a href="https://github.com/AUTOMATIC1111/stable-diffusion-webui" target="_blank">
                    Automatic1111
                  </a>
                </li>
                <li className="creditItem">
                  <a href="https://github.com/lllyasviel/ControlNet" target="_blank">ControlNet</a>
                </li>
                <li className="creditItem">
                  <a href="https://civitai.com/models/4201/realistic-vision-v20" target="_blank">
                    Realistic Vision
                  </a>
                </li>
                <li className="creditItem">
                  <a href="https://openai.com/gpt-4" target="_blank">GPT4</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextPopUp;
