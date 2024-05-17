# Code-Chat-2024

## Table of Contents

- [Code-Chat-2024](#code-chat-2024)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Requirements](#requirements)
  - [Installation](#installation)
    - [Postman](#postman)
  - [Running](#running)
    - [Web](#web)
      - [Shell](#shell)
      - [VSCode](#vscode)
    - [API](#api)
      - [Shell](#shell-1)
      - [VSCode](#vscode-1)

## Overview

ArniaxLigaAC Labs Fullstack Chatbot

Uses [`devcontainers`](https://code.visualstudio.com/docs/devcontainers/containers).

Advantages:

1. Consistent Environments: DevContainers ensure that every developer on a team is working with the same environment. This eliminates the "works on my machine" problem and makes onboarding new team members easier.
2. Isolation: DevContainers isolate your development environment from your local machine. This means you can work on multiple projects with different dependencies without conflicts.
3. Version Control: Since the configuration for a DevContainer is stored in a file, it can be version controlled. This means that changes to the development environment can be tracked and rolled back if necessary.
4. Integration with VS Code: DevContainers are deeply integrated with VS Code. This means you can use VS Code's features, like IntelliSense and debugging, inside the container.
5. Flexibility: DevContainers can be configured to use any Docker image. This means you can use any tools or languages that can be run in a Docker container, giving you a lot of flexibility in setting up your development environment.

## Requirements

- [Docker](https://docs.docker.com/engine/install/)
- [VSCode](https://code.visualstudio.com/download)
- VSCode Extension DevContainers (ms-vscode-remote.remote-containers)

  - Windows: Docker Desktop 2.0+ on Windows 10 Pro/Enterprise. Windows 10 Home (2004+) requires Docker Desktop 2.2+ and the WSL2 back-end. (Docker Toolbox is not supported.)
  - macOS: Docker Desktop 2.0+.
  - Linux: Docker CE/EE 18.06+ and Docker Compose 1.21+. (The Ubuntu snap package is not supported.)

## Installation

To install the necessary dependencies, run the following command:

```shell
yarn install
```

To enter DevContainer environment:

1. `(⌘/CTRL + SHIFT + P)`
2. `Dev Containers: Open Folder in Container`

### Postman

Postman collection has been attached to this repo [here](./docs/postman)

Import the collection and environment to facilitate development by calling API through an efficient and reproduceable flow.

## Running

### Web

To start the client application, run the following command:

#### Shell

```shell
yarn workspace @code-chat-2024/client dev
```

#### VSCode

1. `(⌘/CTRL + SHIFT + P)`
2. Task: Run Task
3. `Client Dev`

### API

To start the API application, run the following command:

#### Shell

```shell
yarn workspace @code-chat-2024/api dev
```

#### VSCode

1. `(⌘/CTRL + SHIFT + P)`
2. Task: Run Task
3. `API Dev`



1. Infrastructure as a Service IaaS
2. Platform as a Service PaaS
3. Software as a Service SaaS