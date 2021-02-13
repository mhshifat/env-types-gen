import fs from "fs";
import path from "path";

// Set environment for development...
process.env.NODE_ENV = process.env.NODE_ENV || "development";

(() => {
	// Don't execute code when in production...
	if (process.env.NODE_ENV === "production") return;

	// Show error if .env file doesn't exist...
	const isEnvFileExist = fs.existsSync(path.join(process.cwd(), ".env"));
	if (!isEnvFileExist)
		throw new Error(
			"📜 Please specify a '.env' file in the root of your project..."
		);

	// Watch for file changes in '.env' file...
	watchDotEnvFile()
		.then((envVariables) => {
			// Check to see if there is a 'src' directory...
			// If so save env variable to a "env.d.ts" file...
			// Else save to current working directory...
			const isSrcDirExist = fs.existsSync(path.join(process.cwd(), "src"));
			if (isSrcDirExist)
				generateTypesForDotEnv(path.join(process.cwd(), "src"), envVariables);
			else generateTypesForDotEnv(process.cwd(), envVariables);
		})
		.catch((err: Error) => {
			throw new Error(err.message);
		});
})();

async function watchDotEnvFile(): Promise<string[]> {
	const envVariables: string[] = [];

	return new Promise((resolve, reject) => {
		const envFilePath = path.join(process.cwd(), ".env");
		fs.watch(envFilePath, (evt, filename) => {
			if (filename && evt === "change") {
				fs.readFile(envFilePath, "utf8", (err, data) => {
					if (err) return reject(err.message);
					// Extract env variables from data...
					const dataArray = data.split("\n");
					for (const line of dataArray) {
						envVariables.push(line.split("=")[0].replace(/["']/g, ""));
					}
					return resolve(envVariables);
				});
			}
		});
	});
}

function generateTypesForDotEnv(directoryPath: string, envVariables: string[]) {
	fs.mkdirSync(path.join(directoryPath, "types"), { recursive: true });
	fs.writeFile(
		path.join(directoryPath, "types", "env.d.ts"),
		writeToEnvFile(envVariables),
		(err) => {
			if (err) throw new Error(err.message);
			console.log("📜 'Env variables' types generated!");
		}
	);
}

function writeToEnvFile(variables: string[]) {
	const content = `
    declare namespace NodeJS {
      export interface ProcessEnv {
        // Replace...
      }
    }
  `;

	return content.replace(
		"// Replace...",
		variables.map((key) => `${key}: string;\n`).join("")
	);
}
