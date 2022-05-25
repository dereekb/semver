"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._generateChangelogs = exports.versionProject = exports.versionWorkspace = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const changelog_1 = require("./utils/changelog");
const commit_1 = require("./utils/commit");
const git_1 = require("./utils/git");
const logger_1 = require("./utils/logger");
const project_1 = require("./utils/project");
const workspace_1 = require("./utils/workspace");
function versionWorkspace(_a) {
    var { skipRootChangelog, commitMessage, newVersion, dryRun, noVerify, projectName, tag } = _a, options = tslib_1.__rest(_a, ["skipRootChangelog", "commitMessage", "newVersion", "dryRun", "noVerify", "projectName", "tag"]);
    return (0, rxjs_1.forkJoin)([
        (0, workspace_1.getProjectRoots)(options.workspaceRoot).pipe((0, operators_1.concatMap)((projectRoots) => _generateChangelogs(Object.assign({ projectRoots,
            skipRootChangelog,
            commitMessage,
            newVersion,
            dryRun,
            noVerify,
            projectName,
            tag }, options))), (0, operators_1.concatMap)((changelogPaths) => (0, rxjs_1.of)({ paths: changelogPaths, dryRun }))),
        (0, workspace_1.getProjectRoots)(options.workspaceRoot).pipe((0, operators_1.concatMap)((projectRoots) => (0, rxjs_1.forkJoin)(projectRoots.map((projectRoot) => (0, project_1.updatePackageJson)({
            projectRoot,
            newVersion,
            projectName,
            dryRun,
        })))), (0, operators_1.concatMap)((packageFiles) => (0, rxjs_1.of)({
            paths: packageFiles.filter((packageFile) => packageFile !== null),
            dryRun,
        }))),
    ]).pipe((0, operators_1.concatMap)((changesToStage) => (0, git_1.addToStage)((0, git_1.mergeAddToStage)(changesToStage, dryRun))), (0, operators_1.concatMap)(() => (0, commit_1.commit)({
        dryRun,
        noVerify,
        commitMessage,
        projectName,
    })), (0, operators_1.concatMap)(() => (0, git_1.createTag)({
        dryRun,
        tag,
        commitMessage,
        projectName,
    })));
}
exports.versionWorkspace = versionWorkspace;
function versionProject(_a) {
    var { workspaceRoot, projectRoot, newVersion, dryRun, commitMessage, noVerify, tagPrefix, projectName, tag } = _a, options = tslib_1.__rest(_a, ["workspaceRoot", "projectRoot", "newVersion", "dryRun", "commitMessage", "noVerify", "tagPrefix", "projectName", "tag"]);
    return _generateChangelogs(Object.assign({ projectName, projectRoots: [projectRoot], skipRootChangelog: true, workspaceRoot,
        newVersion,
        commitMessage,
        dryRun,
        noVerify,
        tagPrefix,
        tag }, options)).pipe((0, operators_1.concatMap)((changelogPaths) => 
    /* If --skipProjectChangelog is passed `changelogPaths` has length 0, otherwise it has 1 single entry. */
    changelogPaths.length === 1
        ? (0, changelog_1.insertChangelogDependencyUpdates)({
            changelogPath: changelogPaths[0],
            version: newVersion,
            dryRun,
            dependencyUpdates: options.dependencyUpdates,
        }).pipe((0, operators_1.concatMap)((changelogPath) => (0, git_1.addToStage)({ paths: [changelogPath], dryRun })))
        : (0, rxjs_1.of)(undefined)), (0, operators_1.concatMap)(() => (0, project_1.updatePackageJson)({
        newVersion,
        projectRoot,
        projectName,
        dryRun,
    }).pipe((0, operators_1.concatMap)((packageFile) => packageFile !== null
        ? (0, git_1.addToStage)({
            paths: [packageFile],
            dryRun,
        })
        : (0, rxjs_1.of)(undefined)))), (0, operators_1.concatMap)(() => (0, commit_1.commit)({
        dryRun,
        noVerify,
        commitMessage,
        projectName,
    })), (0, operators_1.concatMap)(() => (0, git_1.createTag)({
        dryRun,
        tag,
        commitMessage,
        projectName,
    })));
}
exports.versionProject = versionProject;
/**
 * istanbul ignore next
 */
function _generateChangelogs(_a) {
    var { projectRoots, workspaceRoot, skipRootChangelog, skipProjectChangelog, projectName } = _a, options = tslib_1.__rest(_a, ["projectRoots", "workspaceRoot", "skipRootChangelog", "skipProjectChangelog", "projectName"]);
    const changelogRoots = projectRoots
        .filter((projectRoot) => !(skipProjectChangelog && projectRoot !== workspaceRoot))
        .filter((projectRoot) => !(skipRootChangelog && projectRoot === workspaceRoot));
    if (changelogRoots.length === 0) {
        return (0, rxjs_1.of)([]);
    }
    return (0, rxjs_1.forkJoin)(changelogRoots.map((projectRoot) => (0, changelog_1.updateChangelog)(Object.assign({ projectRoot }, options)).pipe((0, logger_1.logStep)({
        step: 'changelog_success',
        message: `Generated CHANGELOG.md.`,
        projectName,
    }))));
}
exports._generateChangelogs = _generateChangelogs;
//# sourceMappingURL=version.js.map