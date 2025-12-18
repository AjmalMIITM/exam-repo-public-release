import { html } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";

export default async function ({ user, weight = 1 }) {
  const id = "q-python-install";
  const title = "Install Python Package";
  const answer = "pip install pandas";

  const question = html`
    <div class="mb-3">
      <p>
        What command allows you to install the <strong>pandas</strong> library 
        using the standard Python package installer?
      </p>
      <label for="${id}" class="form-label">Command:</label>
      <input class="form-control" id="${id}" name="${id}" />
    </div>
  `;

  return { id, title, weight, question, answer };
}
