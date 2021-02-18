#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs";
import path from "path";

const [, , arg] = process.argv;

if (arg !== "generate") process.exit();

// Set environment for development...
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const ENV_FILE_TYPE_DEC_CON = `
  declare namespace NodeJS {
    export interface ProcessEnv {
      // Replace...
    }
  }
`;

const envFilePath = path.join(process.cwd(), ".env");
isFileExist(
	envFilePath,
	"📜  Please specify a '.env' file in the root of your project..."
)
	.then(() => {
		fs.watch(envFilePath, (event, fileName) => {
			if (event === "change" && fileName) {
				init();
			}
		});
	})
	.catch(console.error);

async function init(): Promise<void> {
	try {
		const envFileContent = await readDotEnvFileContent();
		const extractedData = await extractEnvVariables(envFileContent);
		const generatedTypes = await generateTypesForDotEnvFile(extractedData);
		await writeToFile(generatedTypes);
	} catch (err) {
		return Promise.reject(err);
	}
}

async function isFileExist(
	filePath: string,
	errMessage?: string
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		fs.stat(filePath, (err, stats) => {
			if (err) return reject(chalk.red(errMessage || "File not found!"));
			return resolve(stats.isFile());
		});
	});
}

async function readDotEnvFileContent(filePath?: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fs.readFile(
			filePath || path.join(process.cwd(), ".env"),
			{ encoding: "utf-8" },
			(err, data) => {
				if (err) return reject(err.message);
				return resolve(data);
			}
		);
	});
}

async function extractEnvVariables(content: string): Promise<string[]> {
	return new Promise((resolve) => {
		return resolve(content.split("\n").map((item) => item.split("=")[0]));
	});
}

async function generateTypesForDotEnvFile(
	dotEnvFileData: string[]
): Promise<string> {
	return new Promise((resolve) => {
		return resolve(
			ENV_FILE_TYPE_DEC_CON.replace(
				"// Replace...",
				dotEnvFileData.map((item) => `${item}: string;\n`).join("")
			)
		);
	});
}

async function writeToFile(content: string): Promise<void> {
	const writeToTypesDir = async (pathStr?: string): Promise<void> => {
		const pathToCreate = pathStr
			? path.join(pathStr, "types")
			: path.join(process.cwd(), "types");
		fs.stat(pathToCreate, (err, stats) => {
			if (err || !stats.isDirectory()) {
				fs.mkdir(pathToCreate, (err) => {
					if (err) return Promise.reject(err.message);
				});
			}
			fs.writeFile(
				path.join(pathToCreate, "types.d.ts"),
				content,
				{ encoding: "utf-8" },
				(err) => {
					if (err) return Promise.reject(err.message);
					console.log(chalk.green("📜  'Env variables' types generated!"));
				}
			);
			return Promise.resolve();
		});
	};

	return new Promise((resolve, reject) => {
		fs.stat(path.join(process.cwd(), "src"), (err, stats) => {
			if (err) return reject(err.message);
			if (stats.isDirectory()) writeToTypesDir(path.join(process.cwd(), "src"));
			else writeToTypesDir();
			return resolve();
		});
	});
}
