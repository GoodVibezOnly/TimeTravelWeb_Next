@echo off

set PYTHON=
set GIT=
set VENV_DIR=
set COMMANDLINE_ARGS= --xformers --autolaunch --medvram --api --cors-allow-origins=http://127.0.0.1:7860 --cors-allow-origins=http://localhost:3000
git pull
call webui.bat



