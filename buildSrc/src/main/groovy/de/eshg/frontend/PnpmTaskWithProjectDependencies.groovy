// Copyright 2026 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg.frontend

import org.gradle.api.Task

abstract class PnpmTaskWithProjectDependencies extends PnpmTaskWithNpmDependencies {

    @Override
    Task configure(Closure closure) {
      def task = super.configure(closure)

      task.dependsOn(project.tasks.named('prepareEnvironment'))

      ProjectReferences.getDependencies(project).each { projectName ->
        task.inputs.file(project.project(projectName).file('package.json'))
        // use build meta files as input dependencies to reduce the number of tracked files
        task.inputs.files(project.project(projectName).layout.buildDirectory.file('lib/metafile-esm.json')).optional()
        task.inputs.files(project.project(projectName).layout.buildDirectory.file('dist/tsconfig.tsbuildinfo')).optional()
      }

      return task
  }
}
