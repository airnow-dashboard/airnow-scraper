# airnow-scraper

## Overview

A simple scraper for downloading air quality data of US embassies and consulates from [AirNow Department of State](https://www.airnow.gov/international/us-embassies-and-consulates) (AirNow DOS) in bulk.

## Structure

- `dist/` - compiled JS
- `output/` - output folder, store downloaded CSV

## How to Use

Requires node.js 16 and TypeScript.

```bash
yarn start
```

Alternatively, you can build it into a docker image and create a container with mounted volume. Make sure the folder to be binded (`source`) exists.

```bash
docker build . -t airnow-scraper && \
docker run --rm --mount type=bind,source="$(pwd)"/output,target=/app/output airnow-scraper
```
