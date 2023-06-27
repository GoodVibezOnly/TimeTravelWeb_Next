# AI Time machine using stable diffusion
This project was created as part of the Interactive Media course at the FH Hagenberg.
This project is a React, NextJS based frontend that interact with stable diffusion to create "past" versions of images

A cool car       |  AI generated past version of a cool car
:-------------------------:|:-------------------------:
![bestof_car](https://github.com/GoodVibezOnly/TimeTravelWeb_Next/assets/61803371/57f89862-3d5f-498e-b462-39912ceb2c65) | ![bestof_carOld](https://github.com/GoodVibezOnly/TimeTravelWeb_Next/assets/61803371/5637d654-a419-49bd-b6f8-aa132a98eea4)

# Local Installation

## Prerequisites
- NVIDIA GPU with at least 6GB VRAM

1. Install [Automatic1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui) 
2. Install the [ControlNet Extension](https://github.com/Mikubill/sd-webui-controlnet)
3. Download the [Canny Model](https://huggingface.co/lllyasviel/ControlNet-v1-1/tree/main) (`control_v11p_sd15_canny.pth`) for Controlnet
4. Download a [Stable Diffusion Model](https://civitai.com/models/4201/realistic-vision-v20) (e.g., `realistic-vision-v20`), or use the [Base 1.5 model]([https://civitai.com/models/4055/stable-diffusion-v15-base](https://huggingface.co/runwayml/stable-diffusion-v1-5)) as an alternative
5. Set the `PYTHON`, `GIT`, `VENV_DIR` and `COMMANDLINE_ARGS` commandline arguments (e.g., in the `webui-user.bat` file) within the *stable-diffusion-webui* folder generated when installing Automatic1111
   
   ```batch
   @echo off
   set PYTHON=
   set GIT=
   set VENV_DIR=
   set COMMANDLINE_ARGS= --xformers --autolaunch --medvram --api --cors-allow-origins=http://127.0.0.1:7860 --cors-allow-origins=http://localhost:3000
   git pull
   call webui.bat
   ```
6. Start the webui-user.bat to start automatic1111
7. Go into the settings -> Interrogate Options and check the following settings: 
   - `CLIP: skip inquire categories`
     - `artists` 
     - `flavours` 
     - `mediums` 
     - `movements`

8. Reboot the application and enjoy!

# Time Machine WebUI

## How to Get the Time Machine WebUI Working

### Step 1: Get the code
Get the newest build from the [TimeTravelWeb_Next](https://github.com/GoodVibezOnly/TimeTravelWeb_Next) repository.

### Step 2: Open the folder with VS Code
Open the folder containing the code using Visual Studio Code or any other code editor of your choice.

### Step 3: Install required packages
In the VS Code terminal, run the following command to install all the required packages using yarn (Note: yarn needs to be installed for this to work):
    ```
    yarn
    ```
### Step 4: Configure environment variables
Create a new file inside the project called ".env.local". Open the file and add the following environment variables:
- `STABLE_DIFF_URL`: The public link you obtained in Step 6 of the FH installation, or for local installations it is "http://127.0.0.1:7860".
- `OPENAI_API_KEY`: The API key required for GPT prompt verification. You can get your API key from [OpenAI API Keys](https://platform.openai.com/account/api-keys).

### Step 5: Start the development server
In the VS Code terminal, run the following command to start the development server:
    ```
    yarn dev
    ```
This will start the server and the Time Machine WebUI will be accessible at [http://localhost:3000/](http://localhost:3000/).

### Additional Information
Inside the "getGPT" folder, you can find the `route.ts` file where you can switch between different GPT versions:
- To use GPT-4, set `model: "gpt-4"`.
- To use GPT-3.5 Turbo, set `model: "gpt-3.5-turbo"`.

Note that GPT-4 is more expensive and may require access to the closed beta.

# How to Get the Stable Diffusion Server Running on the Render Node at the FH Hagenberg
**Note: You must be in the FH Hagenberg Wifi network!**

Follow these steps to set up and run the stable Diffusion Server.

## Prerequisites
- FH Hagenberg Network access

## Installation Steps

1. Open Terminal.
2. SSH into the server by running the following command:
   ```shell
   ssh textgame@10.21.3.217 
3. Enter the password when prompted.
4. Change the directory to stable-diffusion-webui by running the following command:
    ```shell
    cd stable-diffusion-webui
5. Start a new TMUX session by running the following command:
    ```shell
    tmux new
6. Run the webui.sh script by executing the following command:
    ```shell
    ./webui.sh
    It will take some time for the process to complete.
Once the setup is complete, a public URL will be displayed in the terminal under the message "Running on public URL: https://...".


## Shutting Down the Sessions
After you're done using the server, please shut down the session by following these steps:
```shell
tmux kill-server
```



