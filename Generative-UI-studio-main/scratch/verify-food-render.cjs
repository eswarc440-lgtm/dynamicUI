async function test() {
  const prompt = `MY APPLICATION IS ABOUT SWIGY. Design and build a modern, premium food-delivery mobile and web application UI inspired by leading food-delivery platforms like Swiggy. App Name: FoodRush`;

  console.log("Generating UI for Swiggy FoodRush prompt...");
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
    const data = await res.json();
    console.log("Response Schema Title:", data.schema?.title);
    console.log("Metrics length:", data.schema?.metrics?.length);
    console.log("Layout Sections Count:", data.schema?.layout?.length);
    data.schema?.layout?.forEach((sec, idx) => {
      console.log(`Section ${idx} components:`, sec.components?.map(c => ({ type: c.type, title: c.title })));
    });
  } catch (err) {
    console.error(err);
  }
}

test();
