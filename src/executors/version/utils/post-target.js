"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._checkTargetExist = exports._getTargetOptions = exports.runPostTargets = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const rxjs_1 = require("rxjs");
const logger_1 = require("./logger");
const template_string_1 = require("./template-string");
function runPostTargets({ postTargets, templateStringContext, context, projectName, }) {
    return (0, rxjs_1.concat)(...postTargets.map((postTargetSchema) => (0, rxjs_1.defer)(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var e_1, _a;
        const target = (0, devkit_1.parseTargetString)(postTargetSchema);
        _checkTargetExist(target, context);
        const targetOptions = _getTargetOptions({
            options: (0, devkit_1.readTargetOptions)(target, context),
            context: templateStringContext,
        });
        try {
            for (var _b = tslib_1.__asyncValues(yield (0, devkit_1.runExecutor)(target, targetOptions, context)), _c; _c = yield _b.next(), !_c.done;) {
                const { success } = _c.value;
                if (!success) {
                    throw new Error(`Something went wrong with post-target "${target.project}:${target.target}".`);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    })).pipe((0, logger_1.logStep)({
        step: 'post_target_success',
        message: `Ran post-target "${postTargetSchema}".`,
        projectName,
    }), (0, rxjs_1.catchError)((error) => {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'SchemaError') {
            return (0, rxjs_1.throwError)(() => new Error(error.message));
        }
        return (0, rxjs_1.throwError)(() => error);
    }))));
}
exports.runPostTargets = runPostTargets;
/* istanbul ignore next */
function _getTargetOptions({ options = {}, context, }) {
    return Object.entries(options).reduce((optionsAccumulator, [option, value]) => {
        const resolvedValue = typeof value === 'object'
            ? value
            : (0, template_string_1.coerce)((0, template_string_1.createTemplateString)(value.toString(), context));
        return Object.assign(Object.assign({}, optionsAccumulator), { [option]: resolvedValue });
    }, {});
}
exports._getTargetOptions = _getTargetOptions;
/* istanbul ignore next */
function _checkTargetExist(target, context) {
    var _a;
    const project = context.workspace.projects[target.project];
    if (project === undefined) {
        throw new Error(`The target project "${target.project}" does not exist in your workspace. Available projects: ${Object.keys(context.workspace.projects).map((project) => `"${project}"`)}.`);
    }
    const projectTarget = (_a = project.targets) === null || _a === void 0 ? void 0 : _a[target.target];
    if (projectTarget === undefined) {
        throw new Error(`The target name "${target.target}" does not exist. Available targets for "${target.project}": ${Object.keys(project.targets || {}).map((target) => `"${target}"`)}.`);
    }
}
exports._checkTargetExist = _checkTargetExist;
//# sourceMappingURL=post-target.js.map