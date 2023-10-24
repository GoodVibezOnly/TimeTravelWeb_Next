import React from "react";

interface Props {
  onClose: () => void;
}

const TextPopUp: React.FC<Props> = ({ onClose }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { target } = event;
    const isBackdrop = (target as HTMLElement).classList.contains("backdrop");
    const isCloseButton = (target as HTMLElement).classList.contains(
      "closePopUpButton"
    );

    if (isBackdrop || isCloseButton) {
      onClose();
    }
  };

  return (
    <div className="backdrop" onClick={handleClick}>
      <div className="PopUpContainer">
        <div className="popUpWrapperBackground">
          <button className="closePopUpButton" onClick={onClose}>
            <span className="closeSymbol">✕</span>
          </button>

          <div className="popUpWrapper">
            <div>
              <h1>Image TimeMachine</h1>
              <h2>Created by:</h2>
              <ul className="creditsList">
                <li className="creditItem">
                  <a href="https://github.com/GoodVibezOnly" target="_blank">
                    Alexander Gärtner
                  </a>
                </li>
                <li className="creditItem">
                  <a href="https://github.com/s1910238061" target="_blank">
                    Felix Rader
                  </a>
                </li>
              </ul>

              <h2>technologies used:</h2>
              <ul className="creditsList">
                <li className="creditItem">
                  <a
                    href="https://stability.ai/stablediffusion"
                    target="_blank"
                  >
                    Stable Diffusion
                  </a>
                </li>
                <li className="creditItem">
                  <a
                    href="https://github.com/AUTOMATIC1111/stable-diffusion-webui"
                    target="_blank"
                  >
                    Automatic1111
                  </a>
                </li>
                <li className="creditItem">
                  <a
                    href="https://github.com/lllyasviel/ControlNet"
                    target="_blank"
                  >
                    ControlNet
                  </a>
                </li>
                <li className="creditItem">
                  <a
                    href="https://civitai.com/models/4201/realistic-vision-v20"
                    target="_blank"
                  >
                    Realistic Vision
                  </a>
                </li>
                <li className="creditItem">
                  <a href="https://openai.com/gpt-4" target="_blank">
                    GPT-4
                  </a>
                </li>
                <li className="creditItem">
                  <a
                    href="https://nominatim.openstreetmap.org/ui/search.html"
                    target="_blank"
                  >
                    OpenStreetMap Nominatim
                  </a>
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
