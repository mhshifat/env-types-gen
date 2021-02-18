#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var _a = process.argv, arg = _a[2];
if (arg !== "generate")
    process.exit();
// Set environment for development...
process.env.NODE_ENV = process.env.NODE_ENV || "development";
var ENV_FILE_TYPE_DEC_CON = "\n  declare namespace NodeJS {\n    export interface ProcessEnv {\n      // Replace...\n    }\n  }\n";
var envFilePath = path_1.default.join(process.cwd(), ".env");
isFileExist(envFilePath, "📜  Please specify a '.env' file in the root of your project...")
    .then(function () {
    fs_1.default.watch(envFilePath, function (event, fileName) {
        if (event === "change" && fileName) {
            init();
        }
    });
})
    .catch(console.error);
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var envFileContent, extractedData, generatedTypes, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, readDotEnvFileContent()];
                case 1:
                    envFileContent = _a.sent();
                    return [4 /*yield*/, extractEnvVariables(envFileContent)];
                case 2:
                    extractedData = _a.sent();
                    return [4 /*yield*/, generateTypesForDotEnvFile(extractedData)];
                case 3:
                    generatedTypes = _a.sent();
                    return [4 /*yield*/, writeToFile(generatedTypes)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    return [2 /*return*/, Promise.reject(err_1)];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function isFileExist(filePath, errMessage) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs_1.default.stat(filePath, function (err, stats) {
                        if (err)
                            return reject(chalk_1.default.red(errMessage || "File not found!"));
                        return resolve(stats.isFile());
                    });
                })];
        });
    });
}
function readDotEnvFileContent(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs_1.default.readFile(filePath || path_1.default.join(process.cwd(), ".env"), { encoding: "utf-8" }, function (err, data) {
                        if (err)
                            return reject(err.message);
                        return resolve(data);
                    });
                })];
        });
    });
}
function extractEnvVariables(content) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    return resolve(content.split("\n").map(function (item) { return item.split("=")[0]; }));
                })];
        });
    });
}
function generateTypesForDotEnvFile(dotEnvFileData) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    return resolve(ENV_FILE_TYPE_DEC_CON.replace("// Replace...", dotEnvFileData.map(function (item) { return item + ": string;\n"; }).join("")));
                })];
        });
    });
}
function writeToFile(content) {
    return __awaiter(this, void 0, void 0, function () {
        var writeToTypesDir;
        var _this = this;
        return __generator(this, function (_a) {
            writeToTypesDir = function (pathStr) { return __awaiter(_this, void 0, void 0, function () {
                var pathToCreate;
                return __generator(this, function (_a) {
                    pathToCreate = pathStr
                        ? path_1.default.join(pathStr, "types")
                        : path_1.default.join(process.cwd(), "types");
                    fs_1.default.stat(pathToCreate, function (err, stats) {
                        if (err || !stats.isDirectory()) {
                            fs_1.default.mkdir(pathToCreate, function (err) {
                                if (err)
                                    return Promise.reject(err.message);
                            });
                        }
                        fs_1.default.writeFile(path_1.default.join(pathToCreate, "types.d.ts"), content, { encoding: "utf-8" }, function (err) {
                            if (err)
                                return Promise.reject(err.message);
                            console.log(chalk_1.default.green("📜  'Env variables' types generated!"));
                        });
                        return Promise.resolve();
                    });
                    return [2 /*return*/];
                });
            }); };
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs_1.default.stat(path_1.default.join(process.cwd(), "src"), function (err, stats) {
                        if (err)
                            return reject(err.message);
                        if (stats.isDirectory())
                            writeToTypesDir(path_1.default.join(process.cwd(), "src"));
                        else
                            writeToTypesDir();
                        return resolve();
                    });
                })];
        });
    });
}
