const { generateDynamicDomainSchema } = require('../src/utils/schemaSynthesizer');

const prompt = `Design and build a modern, premium food-delivery mobile and web application UI inspired by leading food-delivery platforms like Swiggy, but with a completely original brand identity, layout, and visual design. App Name: FoodRush. Payment methods: UPI, Credit/Debit Card, Net Banking, Cash on Delivery, Wallet.`;

console.log("Testing exact prompt matching...");
// We test if p.includes('wallet') matches crypto or foodrush now
const p = prompt.toLowerCase();
console.log("Includes food?", p.includes('food'));
console.log("Includes wallet?", p.includes('wallet'));

// Let's verify what schema is returned:
const fs = require('fs');
// Read schemaSynthesizer.ts content to verify item 0 structure
const content = fs.readFileSync('src/utils/schemaSynthesizer.ts', 'utf8');
console.log("FoodRush section exists in file?", content.includes("FoodRush • Gourmet Food & Express Delivery"));
