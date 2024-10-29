// Copyright 2024 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg.frontend

import org.gradle.api.GradleException
import org.gradle.api.Task
import org.gradle.api.tasks.Exec
import org.gradle.api.tasks.InputFile


class K6TaskWindows extends Exec {

  @InputFile
  File script

  @Override
  Task configure(Closure closure) {
    def task = super.configure(closure) as Exec


    def envFile = project.layout.projectDirectory.file(".env")
    if (envFile.asFile.exists()) {
      inputs.file envFile

      def props = new Properties()
      envFile.asFile.withInputStream { props.load(it) }
      props.forEach { k, v ->
        environment.put(k, v)
      }
    }
    environment.put('HOST_VITALS_ENABLED', false)

    task.dependsOn project.tasks.named('buildK6Executable')

    def k6Bin = project.layout.projectDirectory.file("/build/k6.exe")

    if (!script.exists()) {
      throw new GradleException("K6 script file not found: ${script}")
    }

    task.commandLine k6Bin, 'run', script

    return task
  }
}
