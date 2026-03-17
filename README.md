# (Un)Fortune Cookie

A tiny vanilla-JS “fortune cookie” generator:

- On `index.html` you pick **Fortune** (misfortune is currently a placeholder), optionally add a **signature**, and click **Create (un)fortune cookie**.
- The app generates a **shareable link** to `open-cookie.html` by encoding the cookie data into the URL hash.
- On `open-cookie.html` you “open” the cookie:
  - **Desktop**: press **A + D together**
  - **Mobile**: use a **two-finger touch** on the cookie area
- After opening, the cookie splits and a “paper” appears showing the **message**, **timestamp**, and optional **signature**.

## Link validity

Each generated link is valid for **24 hours** from the `date` stored in the URL. After that, `open-cookie.html` redirects back home.

## Run locally

Because this uses ES modules (and imports JSON), run it from a local server instead of opening the HTML file directly.

- **VS Code**: use the “Live Server” extension and open `index.html`
- **Or** any static server (for example, `npx serve` in the project folder)

## Project structure

- `index.html`: create a cookie link
- `open-cookie.html`: open the cookie and reveal the message
- `js/pages/indexPage.js`: builds the encoded URL hash
- `js/pages/openCookiePage.js`: validates expiry and runs the open/split/message UI
- `data/fortune-cookie.json`: fortune messages
