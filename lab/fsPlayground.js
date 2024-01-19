const path = require('node:path')
const fs = require('fs').promises;

(async () => {
    let testing = ''
    
    try {
        testing = await fs.readFile(path.resolve(__dirname, 'testing.txt'))
    }
    catch(e) {
        if(e.code === 'ENOENT') {
            const fileToWrite = path.resolve(__dirname, 'testings.txt')
            await fs.writeFile(fileToWrite, testing)
        }
        else {
            throw new Error(e)
        }
    }

    if(testing.length === 0){
        console.log('testing.txt empty... Creating a new test.')
        testing = 'My test!\n'
    }

    const fileToWrite = path.resolve(__dirname, 'testings.txt')
    await fs.writeFile(fileToWrite, testing)
})()
