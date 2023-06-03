# Hackbox Server

## Description

⚠️ This project is still in development. ⚠️

This is the server for the Hackbox project. Looking for the client? [Click here](https://github.com/HackboxGames/HackboxClient)
## Installation

### Docker Compose

```yml
version: "3.9"
services:
  hackbox:
    image: hackbox:latest
    container_name: hackbox
    ports:
      - 4444:4444
    volumes: 
      - /local/path/to/bundles:/bundles
      - /local/path/to/mods:/mods
```