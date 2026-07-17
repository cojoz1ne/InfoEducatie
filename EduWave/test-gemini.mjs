const key = "AIzaSyAy6AaoFvPMaZ0SB6mp1MJ5G_QQqn3I2rU";

async function test(url, modelName) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Hello" }] }]
      })
    });
    console.log(`TEST ${modelName}:`, res.status);
    if (!res.ok) {
      console.log(await res.text());
    } else {
      const data = await res.json();
      console.log("SUCCESS!", JSON.stringify(data).substring(0, 200));
    }
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await test(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, "gemini-2.5-flash");
}

run();
