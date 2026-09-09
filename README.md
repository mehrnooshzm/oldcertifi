# Certificate Generation Platform (Certi4U)

Built with:

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Local Development](#local-development)
- [Build and Production](#build-and-production)

## Project Structure

```
.
├── client/            # React frontend (Vite + Tailwind CSS)
├── server/            # Express backend
├── package.json       # Root scripts for running and building the app
├── package-lock.json
├── .gitignore
└── README.md
```

## Installation

### 1. Clone the repository

```
git clone https://github.com/priakhina/certificate-generation-platform.git
cd certificate-generation-platform
```

### 2. Install dependencies

Make sure you have [Node.js](https://nodejs.org/en) installed. Run the following command from the root folder:

```
npm run install-all
```

This runs:

- `npm install` for root
- `npm install` inside `/client`
- `npm install` inside `/server`

## Local Development

Run **frontend & backend** together from the root folder:

```
npm run dev
```

This uses **concurrently** to start both servers:

- `npm run dev --prefix client` → starts Vite dev server
- `npm run dev --prefix server` → starts Express server

Frontend is available at:

```
http://localhost:5173
```

Backend is available at:

```
http://localhost:3000
```

## Build and Production

### 1. Build the frontend from root:

```
npm run build
```

### 2. Start production server from root:

```
npm start
```

In production, **the Express app serves the built React app** from `/client/dist`. The app is accessible on your server URL, e.g.:

```
http://localhost:3000
```
"# oldcertifi" 
