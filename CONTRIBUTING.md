# Contributing

Thanks for your interest in improving the ETA Flow Card! Everything happens here on
GitHub — issues for bugs and ideas, pull requests for changes.

> **Note:** This project is the **visual card only**. It does not read your heating
> system directly — it displays entities created by the
> [ETA integration](https://github.com/Tidone/homeassistant_eta_integration). Sensor
> issues belong there.

## Development setup

```bash
scripts/setup      # npm ci
scripts/develop    # rollup --watch, rebuilds dist/eta-flow-card.js on change
```

Point a Lovelace resource at the built `dist/eta-flow-card.js` (see the README's manual
install) to test your changes live in a running Home Assistant.

## Before opening a pull request

1. Fork the repo and branch off `main`.
2. Make your change and update the README/docs if behaviour changed.
3. Run `scripts/lint` (ESLint + Prettier + `tsc`) and make sure `npm run build` succeeds.
4. Open a PR describing what and why.

## Coding style

- TypeScript + [Lit](https://lit.dev/).
- Formatting is enforced by Prettier; linting by ESLint. Run `scripts/lint` to auto-fix.

## License

By contributing you agree that your contributions are licensed under the MIT License.
