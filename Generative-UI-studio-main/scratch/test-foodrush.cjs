async function testFoodRush() {
  const prompt = `Design and build a modern, premium food-delivery mobile and web application UI inspired by leading food-delivery platforms like Swiggy, but with a completely original brand identity, layout, and visual design. App Name: FoodRush`;

  console.log("Testing API with FoodRush prompt...");
  try {
    const res = await fetch("http://localhost:3001/api/generate-ui", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        action: "generate",
        model: "Gemini 2.5 Flash"
      })
    });
    console.log("Status:", res.status);
    const data = await res.json();
    if (data.schema) {
      console.log("Schema Title:", data.schema.title);
      console.log("Category:", data.schema.category);
      console.log("Metrics:", data.schema.metrics?.map(m => m.label));
      console.log("Layout Sections:", data.schema.layout?.length);
      console.log("Section 0 components:", data.schema.layout?.[0]?.components?.map(c => c.type));
      console.log("Section 1 components:", data.schema.layout?.[1]?.components?.map(c => ({ type: c.type, title: c.title })));
    } else {
      console.log("Response data:", data);
    }
  } catch (err) {
    console.error("Test error:", err);
  }
}

testFoodRush();
