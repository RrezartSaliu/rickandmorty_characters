# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Dependencies + running the application

After cloning the repository install the dependencies with the command:

`npm install`

then run the application with: 

`npm run dev`

access it from a browser with the given url:

>http://localhost:5173/

# Tech stack

- Reactjs + Vite
- TypeScript
- Apollo Client
- GraphQL
- i18next
- ChakraUI

# Features

- Fetches data with apollo client from rick and morty grapqhl api
- Displays the data with on scroll pagination
- Sorts data by name and origin
- Filters data by character species
- Language switching (English, German)
