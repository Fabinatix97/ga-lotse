// Copyright 2026 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg.frontend

import com.github.gradle.node.pnpm.task.PnpmTask
import org.gradle.api.Task

abstract class PnpmTaskWithNpmDependencies extends PnpmTask {

    @Override
    Task configure(Closure closure) {
      def task = super.configure(closure)

      task.inputs.file(project.rootProject.file('pnpm-workspace.yaml'))
      task.inputs.file(project.rootProject.file('pnpm-lock.yaml'))
      task.inputs.file(project.file('package.json'))

      return task
  }
}
