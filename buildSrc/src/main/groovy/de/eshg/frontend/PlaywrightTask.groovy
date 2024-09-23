// Copyright 2024 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg.frontend

import com.github.gradle.node.pnpm.task.PnpmTask
import org.gradle.api.Task
import org.gradle.api.tasks.Input

abstract class PlaywrightTask extends PnpmTask {

    @Input
    List<String> additionalArgs = []

    @Override
    Task configure(Closure closure) {
      // ISSUE-4220: enable experimental support for service workers to test offline mode
      // see https://playwright.dev/docs/service-workers-experimental
      environment.put("PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS", "1");

      if (project.hasProperty("a11y")) {
        environment.put("RUN_A11Y_TESTS", "true")
      }

      if (project.hasProperty("proxy")) {
        environment.put("PLAYWRIGHT_PROXY", "true")
        environment.put("MULTI_INSTANCE", "true")
      }

      def task = super.configure(closure)

        task.dependsOn("prepareEnvironment")

        task.inputs.dir("${project.projectDir}/data/test/validation")
        task.outputs.dir("${project.projectDir}/data/test/output")

        task.args = ['playwright'] + additionalArgs

        return task
    }

}
