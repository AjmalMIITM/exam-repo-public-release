import { Gen } from "./utils.js";

// Task: Build a User Analytics API (FastAPI)
// This validates 5 specific data points to count as 5 questions.
export default function (rng) {
  const gen = new Gen(rng);

  // Randomize parameters
  const minAge = gen.int(18, 25);
  const targetCountry = gen.choice(["India", "USA", "UK", "Canada"]);
  
  const brief = `
**Task: Build a User Analytics API**

Create a FastAPI endpoint \`/analyze_users\` that accepts a POST request with:
\`{ "users": [ {"name": "...", "age": int, "email": "...", "country": "..."} ] }\`

Return a JSON object with exactly these **5 calculated fields**:
1. \`valid_email_count\`: Count of emails containing '@'.
2. \`average_age\`: Average age of users (float).
3. \`target_country_count\`: Count of users from "${targetCountry}".
4. \`oldest_user\`: The 'name' of the user with the highest age.
5. \`adults_count\`: Count of users with age >= ${minAge}.

Host this API and submit the base URL.
  `.trim();

  async function validate(url) {
    const cleanUrl = url.replace(/\/$/, "");
    const endpoint = `${cleanUrl}/analyze_users`;

    // Test Data
    const testData = {
      users: [
        { name: "Alice", age: 20, email: "alice@example.com", country: "India" },
        { name: "Bob", age: 15, email: "bob_gmail", country: "USA" },
        { name: "Charlie", age: 30, email: "charlie@example.com", country: targetCountry },
        { name: "Dave", age: 40, email: "dave@example.com", country: "UK" }
      ]
    };

    // Calculate Expected Logic
    const validEmails = testData.users.filter(u => u.email.includes("@")).length;
    const totalAge = testData.users.reduce((sum, u) => sum + u.age, 0);
    const avgAge = totalAge / testData.users.length;
    const targetCount = testData.users.filter(u => u.country === targetCountry).length;
    const oldest = testData.users.reduce((prev, curr) => (prev.age > curr.age) ? prev : curr).name;
    const adults = testData.users.filter(u => u.age >= minAge).length;

    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });
    } catch (e) {
      throw new Error(`Connection failed: ${e.message}`);
    }

    if (response.status !== 200) throw new Error(`Expected 200 OK, got ${response.status}`);
    const json = await response.json();
    const errs = [];

    // The 5 Checks
    if (json.valid_email_count !== validEmails) errs.push(`Q1 Failed: Email count`);
    if (Math.abs(json.average_age - avgAge) > 0.1) errs.push(`Q2 Failed: Avg Age`);
    if (json.target_country_count !== targetCount) errs.push(`Q3 Failed: Country count`);
    if (json.oldest_user !== oldest) errs.push(`Q4 Failed: Oldest user`);
    if (json.adults_count !== adults) errs.push(`Q5 Failed: Adults count`);

    if (errs.length > 0) throw new Error(errs.join(", "));
    return true;
  }

  return {
    title: "FastAPI User Analytics (5 Checks)",
    brief,
    validate,
  };
}
