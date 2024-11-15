import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const contract = process.env.CONTRACT;
    const version = process.env.VERSION;

    if (!contract || !version) {
        throw new Error("Please provide CONTRACT and VERSION in .env");
    }

    const versionsPath = path.join(__dirname, '../../versions.json');
    const versions = JSON.parse(fs.readFileSync(versionsPath, 'utf8'));

    if (!versions.contracts[contract]) {
        throw new Error(`Contract ${contract} not found in versions.json`);
    }

    versions.contracts[contract] = version;
    fs.writeFileSync(versionsPath, JSON.stringify(versions, null, 2));
    console.log(`Updated ${contract} version to ${version}`);
}

main()
    .catch(console.error);
