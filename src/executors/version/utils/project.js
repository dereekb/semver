"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackageJson = exports.getPackageJsonPath = exports.readPackageJson = void 0;
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const filesystem_1 = require("./filesystem");
const logger_1 = require("./logger");
function readPackageJson(projectRoot) {
    return (0, filesystem_1.readJsonFile)(getPackageJsonPath(projectRoot));
}
exports.readPackageJson = readPackageJson;
function getPackageJsonPath(projectRoot) {
    return (0, path_1.resolve)(projectRoot, 'package.json');
}
exports.getPackageJsonPath = getPackageJsonPath;
/**
 * Safely update package.json file.
 */
function updatePackageJson({ newVersion, projectRoot, projectName, dryRun, }) {
    if (dryRun) {
        return (0, rxjs_1.of)(null);
    }
    const packageJsonPath = getPackageJsonPath(projectRoot);
    return (0, filesystem_1.readFileIfExists)(packageJsonPath).pipe((0, rxjs_1.switchMap)((packageJson) => {
        if (packageJson.length) {
            const newPackageJson = JSON.parse(packageJson);
            newPackageJson.version = newVersion;
            return (0, filesystem_1.writeFile)(packageJsonPath, JSON.stringify(newPackageJson, null, 2)).pipe((0, logger_1.logStep)({
                step: 'package_json_success',
                message: `Updated package.json version.`,
                projectName,
            }), (0, rxjs_1.map)(() => packageJsonPath));
        }
        return (0, rxjs_1.of)(null);
    }));
}
exports.updatePackageJson = updatePackageJson;
//# sourceMappingURL=project.js.map