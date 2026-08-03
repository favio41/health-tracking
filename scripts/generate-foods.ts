import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Food } from '../src/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface CoFIDEntry {
	ID?: string;
	'Food Code': string;
	'Food Name': string;
	'Protein (g)': string;
	'Fat (g)': string;
	'Carbohydrate (g)': string;
	'Energy (kcal) (kcal)': string;
	'Starch (g)': string;
	'Total sugars (g)': string;
	[key: string]: unknown;
}

interface USDAEntry {
	ID: string;
	Description: string;
	Calories: string;
	Protein: string;
	TotalFat: string;
	Carbohydrate: string;
	Sugar: string;
	[key: string]: unknown;
}

interface CustomEntry {
	id: string;
	name: string;
	calories: string;
	protein: string;
	fat: string;
	carbs: string;
	sugar: string;
}

const safeParseFloat = (value: string) => parseFloat(value) || 0;
const coFIDData: CoFIDEntry[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/UK-coFID.json'), 'utf-8'));
const usdaData: USDAEntry[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/USDA.json'), 'utf-8'));

let customData: CustomEntry[] = [];
const customPath = path.join(__dirname, '../data/custom.json');
if (fs.existsSync(customPath)) {
	customData = JSON.parse(fs.readFileSync(customPath, 'utf-8'));
}

// Assert UK-coFID structure
assert(Array.isArray(coFIDData), 'UK-coFID data should be an array');
assert(coFIDData.length > 0, 'UK-coFID data should not be empty');
assert('Food Code' in coFIDData[0], "First UK-coFID entry should have 'Food Code' field");
assert('Food Name' in coFIDData[0], "First UK-coFID entry should have 'Food Name' field");
assert('Energy (kcal) (kcal)' in coFIDData[0], "First UK-coFID entry should have 'Energy (kcal) (kcal)' field");

// Assert USDA structure
assert(Array.isArray(usdaData), 'USDA data should be an array');
assert(usdaData.length > 0, 'USDA data should not be empty');
assert('ID' in usdaData[0], "First USDA entry should have 'ID' field");
assert('Description' in usdaData[0], "First USDA entry should have 'Description' field");
assert('Calories' in usdaData[0], "First USDA entry should have 'Calories' field");

console.log('✓ Data loaded successfully');
console.log(`  UK-coFID: ${coFIDData.length} foods`);
console.log(`  USDA: ${usdaData.length} foods`);
console.log(`  Custom: ${customData.length} foods`);

const outputPath = '/tmp/foods.json';
const writer = fs.createWriteStream(outputPath);

writer.write(`[\n`);
let count = 0;

// Write UK-coFID foods
for (const entry of coFIDData) {
	if (!entry['Food Code']) continue;

	const food: Food = {
		source: 'uk-coFID',
		id: entry['Food Code'],
		name: entry['Food Name'],
		calories: safeParseFloat(entry['Energy (kcal) (kcal)']),
		protein: safeParseFloat(entry['Protein (g)']),
		fat: safeParseFloat(entry['Fat (g)']),
		carbs: safeParseFloat(entry['Carbohydrate (g)']),
		sugar: safeParseFloat(entry['Total sugars (g)']) || undefined,
	};
	writer.write(`${count !== 0 ? ',' : ''}${JSON.stringify(food)}\n`);
	count++;
}

// Write USDA foods
for (const entry of usdaData) {
	const food: Food = {
		source: 'USDA',
		id: entry.ID,
		name: entry.Description,
		calories: safeParseFloat(entry.Calories),
		protein: safeParseFloat(entry.Protein),
		fat: safeParseFloat(entry.TotalFat),
		carbs: safeParseFloat(entry.Carbohydrate),
		sugar: safeParseFloat(entry.Sugar) || undefined,
	};
	writer.write(`,${JSON.stringify(food)}\n`);
	count++;
}

// Write custom foods
for (const entry of customData) {
	const food: Food = {
		source: 'custom',
		id: entry.id,
		name: entry.name,
		calories: safeParseFloat(entry.calories),
		protein: safeParseFloat(entry.protein),
		fat: safeParseFloat(entry.fat),
		carbs: safeParseFloat(entry.carbs),
		sugar: safeParseFloat(entry.sugar),
	};
	writer.write(`,${JSON.stringify(food)}\n`);
	count++;
}

writer.write(`]\n`);
writer.end();

writer.on('finish', () => {
	console.log(`Wrote ${count} foods`);
});

writer.on('error', (err) => {
	console.error(`✗ Error writing to ${outputPath}:`, err);
	process.exit(1);
});

assert(count === 9947, 'Something wrong with the number of entries');
