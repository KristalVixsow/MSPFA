// This script automatically generates API request validation schemas based on the default export type of any TS file under `pages/api` (given the file has no TS errors).
// This is awful. But that's okay because it's funny. Oh, and also useful.

import { createGenerator } from 'ts-json-schema-generator';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import c from 'ansi-colors';

const run = (command: string) => new Promise(resolve => {
	exec(command).once('exit', resolve);
});

/** All `.ts` files to generate validators for. */
const sourcePaths: string[] = [];
/** All old `.validate.ts` files to be deleted. */
const validatorPaths: string[] = [];

const walk = (dir: string) => {
	for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
		const direntPath = path.join(dir, dirent.name);
		if (dirent.isDirectory()) {
			walk(direntPath);
		} else if (direntPath.endsWith('.ts')) {
			if (direntPath.endsWith('.validate.ts')) {
				validatorPaths.push(direntPath);
			} else {
				sourcePaths.push(direntPath);
			}
		}
	}
};

walk(path.normalize('pages/api'));

for (const validatorPath of validatorPaths) {
	fs.unlinkSync(validatorPath);
}

const getMetadata = (
	/** The TS file to generate a validator for. */
	sourcePath: string
) => {
	const sourcePathNoExtension = sourcePath.slice(0, -3);
	const sourcePathModule = sourcePathNoExtension.split(path.sep).join('/');
	const outputPath = `${sourcePathNoExtension}.validate.ts`;
	const inputPath = ['', ...sourcePath.split(path.sep)].join('__');

	return { sourcePathModule, outputPath, inputPath };
};

const initializeValidator = async (
	/** The TS file to generate a validator for. */
	sourcePath: string
) => {
	const { sourcePathModule, outputPath, inputPath } = getMetadata(sourcePath);

	await fs.createFile(outputPath);
	// This is necessary so validator imports don't throw errors and prevent TS compilation.
	await fs.writeFile(
		outputPath,
		'export default {} as any;'
	);

	await fs.createFile(inputPath);
	await fs.writeFile(
		inputPath,
		`import type Handler from '${sourcePathModule}';\n\nexport type Request = NonNullable<typeof Handler['Request']>;`
	);
};

const generateValidator = async (
	/** The TS file to generate a validator for. */
	sourcePath: string,
	index: number
) => {
	const { sourcePathModule, outputPath, inputPath } = getMetadata(sourcePath);

	console.log(`${c.gray(sourcePathModule)} ${c.blue('Generating...')} ${c.gray(`(${index}/${sourcePaths.length})`)}`);

	try {
		const schemaString = JSON.stringify(
			createGenerator({
				path: inputPath,
				tsconfig: 'tsconfig.json',
				additionalProperties: true
			}).createSchema('Request'),
			null,
			'\t'
		);
		await fs.writeFile(
			outputPath,
			`// This file is automatically generated by \`scripts/generate-validators\`. Do not edit directly.\n\nimport { createValidator } from 'modules/server/api';\n\nexport default createValidator(${schemaString});`
		);

		console.log(`${c.gray(sourcePathModule)} ${c.green('Success!')}`);
	} catch (error) {
		console.log(`${c.gray(sourcePathModule)} ${c.red('Error:')}`);
		console.error(error);

		await fs.unlink(outputPath);
	}

	fs.unlink(inputPath);
};

const finishValidator = async (
	/** The TS file to generate a validator for. */
	sourcePath: string
) => {
	const { outputPath } = getMetadata(sourcePath);

	await run(`npx eslint --fix ${outputPath}`);
};

(async () => {
	// Initialize validators in parallel.
	console.log(c.blue('Initializing...'));
	await Promise.all(sourcePaths.map(initializeValidator));

	// Generate validators in series.
	for (let i = 0; i < sourcePaths.length; i++) {
		await generateValidator(sourcePaths[i], i);
	}

	// Finish validators in parallel.
	console.log(c.blue('Finishing...'));
	await Promise.all(sourcePaths.map(finishValidator));

	console.log(c.green('Done!'));
	process.exit();
})();