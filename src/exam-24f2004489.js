import { displayQuestions } from "./utils/display.js";

export async function questions(user, elementMap) {
  const results = [
    ...(await import("./q-docker-run.js").then(m => [m.default({ user })])),
    ...(await import("./q-python-install.js").then(m => [m.default({ user })])),
    ...(await import("./q-git-status.js").then(m => [m.default({ user })])),
    ...(await import("./q-js-console.js").then(m => [m.default({ user })])),
    ...(await import("./q-sql-select.js").then(m => [m.default({ user })])),
  ];

  displayQuestions(results, elementMap);

  return Object.fromEntries(
    results.map(({ id, ...rest }) => [id, rest])
  );
}
