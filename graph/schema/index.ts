import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

const schema = glob.sync('graph/schema/**/*.gql')
    .map( f => fs.readFileSync(f, 'utf8')).join()

fs.writeFile(path.resolve(__dirname, "Schema.json"), JSON.stringify(schema), err => {
    if (err) console.log("error", err);
    process.exit();
});