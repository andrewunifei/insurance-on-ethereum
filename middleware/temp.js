import fs from 'node:fs/promises';
import path from 'path';

try {
    const pathToFile = path.resolve('rules/computation.js');
    const readSource = await fs.readFile(pathToFile);
    const source = readSource.toString('hex');
    console.log(source);
  } catch (err) {
    console.log(err);
}