# Realtime chat app frontend

Realtime chat app based on WebSocket backend

Backend repo: [Github repo](https://github.com/anhtumai/realtime-chat-app-backend)

## Usage

Requirement:

- Node package manager: Yarn or Npm

### Install dependencies

```bash
yarn install
```

### Run on localhost

```bash
# default value for REACT_APP_WS_URL is "ws://localhost:8080"
REACT_APP_WS_URL="wss://example.com" yarn run start
```

### Build

```bash
yarn run build

# then

npx serve -s build
```
