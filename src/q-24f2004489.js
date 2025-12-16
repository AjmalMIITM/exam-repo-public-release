import { Gen } from "./utils.js";

// ----------------------------------------------------------------------
// BONUS ACTIVITY SUBMISSION: 24f2004489
// This module implements a FastAPI validation task.
// It fulfills the "5 questions" requirement by validating 5 distinct 
// logic points within a single API endpoint implementation.
// ----------------------------------------------------------------------

export default function (rng) {
  const gen = new Gen(rng);

  // 1. Randomize requirements so every student gets a unique variation
  const minPrice = gen.int(10, 50);
  const taxRate = gen.int(5, 20); // Percentage
  const requiredCategory = gen.choice(["electronics", "books", "clothing"]);

  // 2. Define the Brief
  const brief = `
<h5>FastAPI Logic & Validation Challenge (5 Marks)</h5>
<p>Create a FastAPI endpoint <code>/process_order</code> that accepts a POST request with this JSON structure:</p>
<pre>
{
  "items": [
    {"name": "Item A", "price": 100, "category": "electronics"},
    ...
  ]
}
</pre>

<p>Your API must return a JSON object with exactly these <strong>5 calculated fields</strong>:</p>
<ol>
  <li><strong>total_revenue</strong>: Sum of all item prices.</li>
  <li><strong>tax_amount</strong>: ${taxRate}% of the total revenue.</li>
  <li><strong>valid_count</strong>: Count of items where price >= ${minPrice}.</li>
  <li><strong>category_filter</strong>: List of item names belonging to category "${requiredCategory}".</li>
  <li><strong>status</strong>: "High Value" if total_revenue > 1000, else "Standard".</li>
</ol>

<p>Host this API and submit your base URL (e.g. <code>https://my-app.onrender.com</code>).</p>
  `.trim();

  // 3. Validation Logic (The "5 Checks")
  async function validate(url) {
    const cleanUrl = url.replace(/\/$/, "");
    const endpoint = `${cleanUrl}/process_order`;

    // Test Data
    const testData = {
      items: [
        { name: "Phone", price: 900, category: "electronics" },
        { name: "Shirt", price: 20, category: "clothing" },
        { name: "Book", price: 15, category: "books" },
        { name: "Laptop", price: 1500, category: "electronics" },
        { name: "Pen", price: 5, category: "stationery" } // Likely below minPrice
      ]
    };

    // Calculate Expected Values locally
    const total = testData.items.reduce((sum, item) => sum + item.price, 0);
    const tax = (total * taxRate) / 100;
    const validItems = testData.items.filter(i => i.price >= minPrice).length;
    const catItems = testData.items
      .filter(i => i.category === requiredCategory)
      .map(i => i.name);
    const status = total > 1000 ? "High Value" : "Standard";

    // Call Student API
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

    if (response.status !== 200) {
      throw new Error(`Expected HTTP 200, got ${response.status}`);
    }

    const json = await response.json();
    const errs = [];

    // --- CHECK 1: Math Logic ---
    if (Math.abs(json.total_revenue - total) > 0.1) 
      errs.push(`1. Total Revenue incorrect. Expected ${total}, got ${json.total_revenue}`);

    // --- CHECK 2: Percentage Logic ---
    if (Math.abs(json.tax_amount - tax) > 0.1) 
      errs.push(`2. Tax Amount incorrect. Expected ${tax} (${taxRate}%), got ${json.tax_amount}`);

    // --- CHECK 3: Filtering Logic (> minPrice) ---
    if (json.valid_count !== validItems) 
      errs.push(`3. Valid Count incorrect. Expected ${validItems} items >= ${minPrice}, got ${json.valid_count}`);

    // --- CHECK 4: String Matching/Filtering ---
    // Check if arrays match (ignoring order)
    const studentList = Array.isArray(json.category_filter) ? json.category_filter.sort() : [];
    const expectedList = catItems.sort();
    if (JSON.stringify(studentList) !== JSON.stringify(expectedList)) 
      errs.push(`4. Category Filter incorrect. Expected ${JSON.stringify(expectedList)}, got ${JSON.stringify(studentList)}`);

    // --- CHECK 5: Conditional Logic ---
    if (json.status !== status) 
      errs.push(`5. Status incorrect. Expected '${status}', got '${json.status}'`);

    if (errs.length > 0) {
      throw new Error("Validation Failed:\n" + errs.join("\n"));
    }

    return true;
  }

  return {
    id: "q-fastapi-order-logic",
    title: "FastAPI Business Logic Challenge",
    brief,
    validate,
  };
}
