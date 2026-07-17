import { getLlama } from "node-llama-cpp";
import path from "path";
import fs from "fs";

const globalAny: any = global;

export async function getLocalLlamaContext() {
  const modelPath = path.join(process.cwd(), "models", "phi3.gguf");
  
  if (!fs.existsSync(modelPath)) {
    throw new Error("Modelul AI nu a fost gasit. Te rog sa rulezi `npm run download-model` in terminal.");
  }

  if (!globalAny.llamaInstance) {
    globalAny.llamaInstance = await getLlama();
  }

  if (!globalAny.modelInstance) {
    globalAny.modelInstance = await globalAny.llamaInstance.loadModel({ modelPath });
  }

  if (!globalAny.contextInstance) {
    globalAny.contextInstance = await globalAny.modelInstance.createContext({
      sequences: 1
    });
  }
  
  return globalAny.contextInstance;
}
