# Nuxt Explaination Template

This is a basic template for a Nuxt project. 
The directories are set up in the Nuxt 4 method (`/app` folder at root contains client side files and directories.)

This does not cover all aspects of Nuxt, but can be used as a reference for key concepts.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Branches

In the `main` branch you will find example files and READMEs in each of the common directories and files.

In the `bare-template` branch you will find the empty file structure with the examples and READMEs removed. Please note, i've kept Pinia installed as it is the officially recommended store management system.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:


### Note! 

Be aware that you have to run `prepare`, `dev` or `build` in order to let Nuxt generate the types.

If you create a composable without having the dev server running, TypeScript will throw an error, such as `Cannot find name 'useBar'`.

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
