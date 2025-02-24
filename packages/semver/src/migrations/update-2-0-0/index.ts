import { getProjects, updateProjectConfiguration, type Tree } from '@nrwl/devkit';

/* istanbul ignore next */
export default function migrate(tree: Tree) {
  getProjects(tree).forEach((project, projectName) => {
    if (project.targets?.version) {
      const options = project.targets.version.options ?? {};

      /* Check if the outdated option is defined. */
      if (typeof options.rootChangelog === 'boolean') {
        const newOptions = {
          skipRootChangelog: !options.rootChangelog,
        };

        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const { rootChangelog, ...otherOptions } = options;

        updateProjectConfiguration(tree, projectName, {
          ...project,
          targets: {
            ...project.targets,
            version: {
              executor: '@jscutlery/semver:version',
              options: { ...otherOptions, ...newOptions },
            },
          },
        });
      }
    }
  });
}
