FROM gitpod/workspace-full

USER root
# Install custom tools, runtime, etc.
RUN sudo apt-get update \
    && sudo apt-get install -y \
        libgtk2.0-0 libgtk-3-0 libgbm-dev \
        libnotify-dev libgconf-2-4  libnss3 libxss1 libasound2 libxtst6 xauth xvfb \
    && sudo rm -rf /var/lib/apt/lists/*

USER gitpod
# Apply user-specific settings
# ENV ...
run npm install
