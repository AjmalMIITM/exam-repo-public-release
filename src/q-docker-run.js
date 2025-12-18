import { html } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";

export default async function ({ user, weight = 1 }) {
  const id = "q-docker-run";
  const title = "Docker Run Command";
  const answer = "docker run hello-world";

  const question = html`
    <div class="mb-3">
      <p>
        Which Docker command is used to <strong>start a container</strong> 
        from the image named <code>hello-world</code>?
      </p>
      <label for="${id}" class="form-label">Command:</label>
      <input class="form-control" id="${id}" name="${id}" />
    </div>
  `;

  return { id, title, weight, question, answer };
}
