import { getPlatformProxy } from 'wrangler';

async function run() {
  console.log("Running proxy test...");
  try {
    const proxy = await getPlatformProxy({
      environment: undefined,
      persist: undefined,
      remoteBindings: true,
    });
    
    console.log("Proxy D1 binding keys:", Object.keys(proxy.env));
    const d1 = proxy.env.D1;
    if (!d1) {
      console.log("D1 binding not found in proxy env!");
      return;
    }
    
    // Execute a test query
    const res = await d1.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
    console.log("D1 tables through proxy:", res.results);
  } catch (err) {
    console.error("Error during proxy test:", err);
  }
}

run();
