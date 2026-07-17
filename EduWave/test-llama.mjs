import { getLlama } from "node-llama-cpp";

async function run() {
  console.log("Loading llama...");
  const llama = await getLlama();
  console.log("Llama loaded successfully!");
}

run().catch(console.error);
