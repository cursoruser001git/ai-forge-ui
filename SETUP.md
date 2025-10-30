# Project Setup

This document provides instructions on how to set up and run the project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) (optional)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repository.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd your-repository
    ```

3.  **Install dependencies:**

    You can use either `npm` or `bun` to install the project dependencies.

    **Using npm:**

    ```bash
    npm install
    ```

    **Using bun:**

    ```bash
    bun install
    ```

## Development Server

To start the development server, run one of the following commands:

**Using npm:**

```bash
npm run dev
```

**Using bun:**

```bash
bun run dev
```

This will start the development server, and you can view the application in your browser at `http://localhost:5173`.

## Building for Production

To create a production build of the application, run:

**Using npm:**

```bash
npm run build
```

**Using bun:**

```bash
bun run build
```

This will create a `dist` folder with the optimized production build.

## Linting

To check the code for any linting errors, run:

**Using npm:**

```bash
npm run lint
```

**Using bun:**

```bash
bun run lint
```
