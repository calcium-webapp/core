# Etapa 1: Instalar Node.js y Yarn
FROM buildpack-deps:bullseye AS node-stage

# Instalar Node.js y Yarn
RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

ENV NODE_VERSION=21.7.3

RUN ARCH= && dpkgArch="$(dpkg --print-architecture)" \
  && case "${dpkgArch##*-}" in \
    amd64) ARCH='x64';; \
    ppc64el) ARCH='ppc64le';; \
    s390x) ARCH='s390x';; \
    arm64) ARCH='arm64';; \
    armhf) ARCH='armv7l';; \
    i386) ARCH='x86';; \
    *) echo "unsupported architecture"; exit 1 ;; \
  esac \
  # Instalar Node.js desde el código fuente
  && curl -fsSL https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH.tar.xz | tar -xJ -C /usr/local --strip-components=1 --no-same-owner \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Etapa 2: Imagen final con Debian y Docker
FROM debian:bullseye-20240423

# Directorio de trabajo
WORKDIR /usr/my-workspace

# Instalar paquetes necesarios
RUN apt-get update && apt-get install -y ca-certificates curl gnupg

# Agregar la clave GPG de Docker
RUN install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Agregar el repositorio de Docker
RUN echo \
    "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" > /etc/apt/sources.list.d/docker.list

# Instalar Docker Engine
RUN apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Copiar binarios de Node.js y Yarn desde la etapa anterior
COPY --from=node-stage /usr/local/bin/node /usr/local/bin/node
COPY --from=node-stage /usr/local/bin/npm /usr/local/bin/npm
COPY --from=node-stage /usr/local/bin/npx /usr/local/bin/npx

# Instalar Yarn
ENV YARN_VERSION=1.22.19
RUN set -ex \
  && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
  && ln -s /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
  && ln -s /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
  && rm yarn-v$YARN_VERSION.tar.gz

# LINEA ESENCIAL NI LO BORREN O LES PEGO
RUN echo 'export PS1="\[\e[32m\]codespace\[\e[m\]➜ \[\e[36m\]\w\[\e[m\]\\$ "' >> /root/.bashrc

# Comando para iniciar el contenedor con Bash
CMD ["bash"]
