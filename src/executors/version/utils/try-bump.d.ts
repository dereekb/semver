import { type Observable } from 'rxjs';
import { type ReleaseIdentifier } from '../schema';
import { type Version } from '../version';
import { type DependencyRoot } from './get-project-dependencies';
export interface NewVersion {
    version: string;
    dependencyUpdates: Version[];
}
export declare function getProjectVersion({ tagPrefix, projectRoot, releaseType, since, projectName, }: {
    tagPrefix: string;
    projectRoot: string;
    releaseType?: ReleaseIdentifier;
    since?: string;
    projectName: string;
}): {
    lastVersion$: Observable<string>;
    commits$: Observable<string[]>;
    lastVersionGitRef$: Observable<string>;
};
/**
 * Return new version or null if nothing changed.
 */
export declare function tryBump({ preset, projectRoot, tagPrefix, dependencyRoots, releaseType, preid, versionTagPrefix, syncVersions, allowEmptyRelease, projectName, }: {
    preset: string;
    projectRoot: string;
    tagPrefix: string;
    dependencyRoots?: DependencyRoot[];
    releaseType?: ReleaseIdentifier;
    preid?: string;
    versionTagPrefix?: string | null;
    syncVersions: boolean;
    allowEmptyRelease?: boolean;
    projectName: string;
}): Observable<NewVersion | null>;
export declare function _semverBump({ since, preset, projectRoot, tagPrefix, }: {
    since: string;
    preset: string;
    projectRoot: string;
    tagPrefix: string;
}): Observable<string | null>;
export declare function _manualBump({ since, releaseType, preid, }: {
    since: string;
    releaseType: string;
    preid: string;
}): Observable<string | null>;
export declare function _getDependencyVersions({ preset, dependencyRoots, releaseType, versionTagPrefix, syncVersions, lastVersionGitRef, projectName, }: {
    preset: string;
    lastVersionGitRef: string;
    dependencyRoots: DependencyRoot[];
    releaseType?: ReleaseIdentifier;
    versionTagPrefix?: string | null;
    syncVersions: boolean;
    projectName: string;
}): Observable<Version[]>;
export declare function _isNewVersion(version: Version): boolean;
export declare function _isInitialVersion({ lastVersion, }: {
    lastVersion: string;
}): boolean;
