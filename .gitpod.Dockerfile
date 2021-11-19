FROM gitpod/workspace-full-vnc

# ref: https://community.gitpod.io/t/gitpod-and-cypress-disagree-on-cache
ENV CYPRESS_CACHE_FOLDER=/workspace/.cypress-cache

USER root
# Install custom tools, runtime, etc.

# Install Cypress dependencies.
RUN apt-get update \
 && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
   libgtk2.0-0 \
   libgtk-3-0 \
   libnotify-dev \
   libgconf-2-4 \
   libnss3 \
   libxss1 \
   libasound2 \
   libxtst6 \
   xauth \
   xvfb \
 && sudo rm -rf /var/lib/apt/lists/* \

USER gitpod
# Apply user-specific settings
# ENV ...

# Give back control
USER root
