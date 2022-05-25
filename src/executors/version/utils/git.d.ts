import { Observable } from 'rxjs';
/**
 * Return the list of commits since `since` commit.
 */
export declare function getCommits({ projectRoot, since, }: {
    projectRoot: string;
    since: string;
}): Observable<string[]>;
export declare function tryPush({ remote, branch, noVerify, projectName, tag, }: {
    tag: string;
    remote: string;
    branch: string;
    noVerify: boolean;
    projectName: string;
}): Observable<string>;
export declare type AddToStage = {
    paths: string[];
    dryRun: boolean;
};
export declare function mergeAddToStage(stages: AddToStage[], dryRun: boolean): AddToStage;
export declare function addToStage({ paths, dryRun }: AddToStage): Observable<void>;
export declare function getFirstCommitRef(): Observable<string>;
export declare function createTag({ dryRun, tag, commitMessage, projectName, }: {
    dryRun: boolean;
    tag: string;
    commitMessage: string;
    projectName: string;
}): Observable<string>;
