# Welcome to your Lovable project

## Project info

## Setup

Clone the repository and install dependencies:

```sh
git clone <YOUR_GIT_URL>
cd agentic-orchestration-hub
npm install
```

To start the development server:

```sh
npm run dev
```

Run the test suite and linter before committing:

```sh
npm run lint
npm test
```

## Development tasks

For a list of planned improvements and open tasks, see [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md).
Agents can pick one of these tasks and submit a PR. Remember to run `npm test` before committing.


**URL**: https://lovable.dev/projects/7198daf8-e103-4509-a8ea-a2d988812a1c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7198daf8-e103-4509-a8ea-a2d988812a1c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Development workflow

Run the following commands when working on the project:

```sh
# install dependencies
npm install

# start the dev server
npm run dev

# check formatting and lint rules
npm run lint

# run the test suite
npm test -- --run
```

The Supabase credentials used in development are stored in
`src/integrations/supabase/client.ts`. If you fork this repo or use your own
Supabase project, update those values accordingly.

## Contributing

1. Pick an open item from [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md).
2. Create a pull request with your changes.
3. Ensure `npm test` passes before submitting.
4. Include a short summary of what was changed.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7198daf8-e103-4509-a8ea-a2d988812a1c) and click on Share -> Publish.

## Contributing

1. Fork the repository and create a new branch for your feature.
2. Run `npm install` if you haven't already.
3. Implement your changes and add tests where appropriate.
4. Run `npm run lint` and `npm test` to ensure everything passes.
5. Open a pull request describing your changes.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
