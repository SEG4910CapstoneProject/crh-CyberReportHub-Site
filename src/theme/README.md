# CyberReportHub Theming

## How to define a theme

1. Copy the template in `/theme-utils/_theme-template.scss` into your own file `_your-theme/scss`.
2. Replace all placeholders that are surrounded in triangle brackets (`<COLOR>`) with your desired values.
3. In the globals styles scss file (Inside `<root>/src/styles.scss`) include the theme using the theme generator in the html tag so that all children has access to the styles

```scss
@use 'theme/your-theme' as base-theme;
@use 'theme/theme-utils/theme-generator' as theme-generator;

// Adds theme over html element
html {
  @include theme-generator.setup-theme(base-theme.$theme);
}
```

## Available CSS Variables

The below are all the css variables available to use during styling of components and the pages. You can use them using normal css syntax (`var(--crh-<VARIABLE NAME>)`)

### Base Font Size

- `--crh-base-size` (just a number)
- `--crh-base-font-size` (is a px size)

### Colors

#### Primary

- `--crh-primary-color`
- `--crh-primary-contrast-color`

#### Background

- `--crh-background-color`
- `--crh-background-contrast-color`

#### Accent links

- `--crh-primary-highlight-color`
- `--crh-primary-highlight-contrast-color`

#### Base text color

- `--crh-base-text-color`
- `--crh-base-text-contrast-color`

#### Light background color

- `--crh-light-background-color`
- `--crh-light-background-contrast-color`

#### Light background color

- `--crh-light-background-color`
- `--crh-light-background-contrast-color`

#### Divider color

- `--crh-divider-color`
- `--crh-divider-contrast-color`

#### Success color

- `--crh-success-color`
- `--crh-success-contrast-color`

#### Warning color

- `--crh-warning-color`
- `--crh-warning-contrast-color`

#### Error Color

- `--crh-error-color`
- `--crh-error-contrast-color`

### Typography

#### Heading 0

- `--crh-heading-0-family`
- `--crh-heading-0-weight`
- `--crh-heading-0-size`

#### Heading 1

- `--crh-heading-1-family`
- `--crh-heading-1-weight`
- `--crh-heading-1-size`

#### Heading 2

- `--crh-heading-2-family`
- `--crh-heading-2-weight`
- `--crh-heading-2-size`

#### Heading 3

- `--crh-heading-3-family`
- `--crh-heading-3-weight`
- `--crh-heading-3-size`

#### Paragraph

- `--crh-paragraph-family`
- `--crh-paragraph-weight`
- `--crh-paragraph-size`

#### Paragraph Emphasized

- `--crh-paragraph-emphasized-family`
- `--crh-paragraph-emphasized-weight`
- `--crh-paragraph-emphasized-size`

#### Chip

- `--crh-chip-family`
- `--crh-chip-weight`
- `--crh-chip-size`
