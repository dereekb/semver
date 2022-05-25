import { logger } from '@nrwl/devkit';
import { type MonoTypeOperatorFunction } from 'rxjs';
declare type Step = 'nothing_changed' | 'failure' | 'warning' | 'calculate_version_success' | 'package_json_success' | 'changelog_success' | 'tag_success' | 'post_target_success' | 'push_success' | 'commit_success';
export declare function logStep<T>({ step, message, projectName, }: {
    step: Step;
    message: string;
    projectName: string;
}): MonoTypeOperatorFunction<T>;
export declare function _logStep({ step, message, projectName, level }: {
    step: Step;
    message: string;
    projectName: string;
    level?: keyof typeof logger;
}): void;
export {};
