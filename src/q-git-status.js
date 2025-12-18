import { html } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";

export default async function ({ user, weight = 1 }) {
  const id = "q-git-status";
  const title = "Check Git Status";
  const answer = "git status";

  const question = html`
    <div class="mb-3">
      <p>
        Which Git command displays the state of the working directory 
        and the staging area?
      </p>
      <label for="${id}" class="form-label">Command:</label>
      <input class="form-control" id="${id}" name="${id}" />
    </div>
  `;

  return { id, title, weight, question, answer };
}
