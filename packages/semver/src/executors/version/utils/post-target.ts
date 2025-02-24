import type { ExecutorContext } from '@nrwl/devkit';
import {
  parseTargetString,
  readTargetOptions,
  runExecutor,
  Target
} from '@nrwl/devkit';
import { catchError, concat, defer, Observable, throwError } from 'rxjs';
import { logStep } from './logger';
import { coerce, createTemplateString } from './template-string';

export function runPostTargets({
  postTargets,
  templateStringContext,
  context,
  projectName,
}: {
  postTargets: string[];
  templateStringContext: Record<string, unknown>;
  context: ExecutorContext;
  projectName: string;
}): Observable<void> {
  return concat(
    ...postTargets.map((postTargetSchema) =>
      defer(async () => {
        const target = parseTargetString(postTargetSchema);

        _checkTargetExist(target, context);

        const targetOptions = _getTargetOptions({
          options: readTargetOptions(target, context),
          context: templateStringContext,
        });

        for await (const { success } of await runExecutor(
          target,
          targetOptions,
          context
        )) {
          if (!success) {
            throw new Error(
              `Something went wrong with post-target "${target.project}:${target.target}".`
            );
          }
        }
      }).pipe(
        logStep({
          step: 'post_target_success',
          message: `Ran post-target "${postTargetSchema}".`,
          projectName,
        }),
        catchError((error) => {
          if (error?.name === 'SchemaError') {
            return throwError(() => new Error(error.message));
          }

          return throwError(() => error);
        })
      )
    )
  );
}

/* istanbul ignore next */
export function _getTargetOptions({
  options = {},
  context,
}: {
  options?: Record<string, unknown>;
  context: Record<string, unknown>;
}): Record<string, unknown> {
  return Object.entries(options).reduce(
    (optionsAccumulator, [option, value]) => {
      const resolvedValue =
        typeof value === 'object'
          ? value
          : coerce(
              createTemplateString(
                (value as number | string | boolean).toString(),
                context
              )
            );

      return {
        ...optionsAccumulator,
        [option]: resolvedValue,
      };
    },
    {}
  );
}

/* istanbul ignore next */
export function _checkTargetExist(target: Target, context: ExecutorContext) {
  const project = context.workspace.projects[target.project];

  if (project === undefined) {
    throw new Error(
      `The target project "${
        target.project
      }" does not exist in your workspace. Available projects: ${Object.keys(
        context.workspace.projects
      ).map((project) => `"${project}"`)}.`
    );
  }

  const projectTarget = project.targets?.[target.target];

  if (projectTarget === undefined) {
    throw new Error(
      `The target name "${
        target.target
      }" does not exist. Available targets for "${
        target.project
      }": ${Object.keys(project.targets || {}).map((target) => `"${target}"`)}.`
    );
  }
}
