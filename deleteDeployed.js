import fs from "node:fs/promises";
import path from "node:path";

try {
    const directory = "deployed";

    for (const file of await fs.readdir(directory)) {
    await fs.unlink(path.join(directory, file));
    }

    console.log('✅ [LOCAL] Files in Deployed deleted successfully!');
} catch(e) {
    console.log(`❌ [LOCAL] Failed to delete files in Deployed. Reason: ${e}`);
}
