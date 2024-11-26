# CyberReportHubSite

This project acts as the frontend website to CyberReport Hub.

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests using Jest.

## Running Lint checker

Run `npm run lint` to test linting rules. Optionally you can run `npm run lint:fix` to fix any errors. It is expected
all lint rules pass

## Running formatter

Run `npm run format` to format all code using prettier. This is expected before all commits. A pre-commit hook has
been installed.

## Running SDK Generation

To regenerate the sdk files run `npm run generate-api -- {Location of api file}`

Replacing `{Location of API file}` with the path to `CyberReportHub-api.json` in the `rest-api` repository.
