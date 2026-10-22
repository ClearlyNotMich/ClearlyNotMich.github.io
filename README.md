# Michal Kozdon — portfolio website

Static portfolio pages for [clearlynotmich.github.io](https://clearlynotmich.github.io/).
The site uses HTML, JavaScript and a committed Tailwind-generated stylesheet.
GitHub Pages serves `main` from the repository root; no server-side application
or GitHub Actions build is required.

## Site files

- `index.html` and `pages/`: portfolio content.
- `components/navbar.html`: shared navigation, loaded by `js/load-navbar.js`.
- `js/main.js`: reveal/skill animations and the Projects media gallery.
- `css/input.css`: Tailwind directives and custom styles.
- `css/output.css`: generated CSS that must remain committed for Pages.
- `assets/`: existing images and demonstration videos.

Paths assume a user-site root, `https://clearlynotmich.github.io/`, rather than a
repository subdirectory. Navigation has a Home fallback if its request fails.
Google Fonts and the externally hosted CV remain external links/dependencies.

## Local checks

With Node.js 20 or newer, run the dependency-free checks:

```sh
npm run verify
```

The tests use Node's built-in test runner and a small simulated DOM. They cover
pages without a gallery, gallery navigation, and successful/failed navigation
loading. They make no network requests and do not play media. These checks do not
replace visual or browser accessibility testing.

For a local preview, serve the repository through HTTP instead of opening an HTML
file directly, because the shared navigation uses `fetch`:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8000/`. Stop the local server when finished.

## Rebuild the stylesheet

The lockfile preserves Tailwind CSS **3.4.17** and its dependency versions.
`node_modules/` is local build output and is not tracked. A fresh checkout needs
an npm dependency installation before rebuilding CSS:

```sh
npm ci --ignore-scripts
npm run build:css
npm run verify
```

Dependency installation contacts the package registry; the CSS build itself uses
the local compiler. Review and commit `css/output.css` whenever HTML classes,
`tailwind.config.js`, or `css/input.css` change. Hosting the existing committed
site does not require installing Node dependencies.

## Migration and provenance

This repository originated as `ObviouslyNotMich/ObviouslyNotMich.github.io` and
moves to `ClearlyNotMich/ClearlyNotMich.github.io`. Original commits, attribution,
media and project history are retained. Dependency files are removed only from
the current tracked tree, without rewriting their historical copies. The old
account's Pages repository is handled separately as a redirect to the new site.

The existing Tailwind MIT notice in the generated stylesheet is preserved.
Dependency licenses remain their own; this cleanup adds no blanket license for
the website, third-party material or media. Existing third-party notices and
external resource references retain their context.
