FROM gitpod/workspace-full:latest

USER root
# Install custom tools, runtime, etc.
RUN apt-get update && apt-get install -y \
        libgtk2.0-0 libgtk-3-0 libgbm-dev \
        libnotify-dev libgconf-2-4  libnss3 libxss1 libasound2 libxtst6 xauth xvfb \
    && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*

USER gitpod
# Apply user-specific settings
# ENV ...

# Give back control
USER root
