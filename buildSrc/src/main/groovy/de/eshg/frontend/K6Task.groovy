// Copyright 2026 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg.frontend

import org.gradle.api.Task
import org.gradle.api.logging.StandardOutputListener
import org.gradle.api.tasks.Exec
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.InputFile
import org.gradle.nativeplatform.platform.internal.DefaultNativePlatform

abstract class K6Task extends Exec {

  @Input
  List<String> additionalArgs = ['--no-summary', '--no-thresholds']

  @InputFile
  File script

  @Override
  Task configure(Closure closure) {
    def task = super.configure(closure) as Exec

    task.dependsOn project.tasks.named("build")
    task.dependsOn project.tasks.named("startServices")
    task.dependsOn project.tasks.named("assertK6ContainerNotRunning")

    BufferedWriter stdOut
    BufferedWriter errOut

    task.doFirst {
      stdOut = project.layout.buildDirectory.file("k6-stdout.txt").get().asFile.newWriter()
      errOut = project.layout.buildDirectory.file("k6-error.txt").get().asFile.newWriter()
      logging.addStandardOutputListener(stdOut::write as StandardOutputListener)
      logging.addStandardErrorListener(errOut::write as StandardOutputListener)

      project.delete project.layout.buildDirectory.dir("screenshots").get()
      project.layout.buildDirectory.dir("screenshots").get().asFile.mkdirs()
    }

    task.doLast {
      stdOut.close()
      errOut.close()
    }

    def userArg = []
    if (!DefaultNativePlatform.currentOperatingSystem.windows) {
      def uid = ["id", "-u"].execute().text.trim()
      def gid = ["id", "-g"].execute().text.trim()
      userArg = ["--user=${uid}:${gid}"]
    }

    def service = project.hasProperty('local') ? "k6-local" : "k6"

    task.commandLine = [
      'docker', 'compose',
      '-p', 'performance-test',
      'run', '--rm',
    ] + userArg + [
      service
    ] + additionalArgs + [
      "/project/${project.rootProject.relativePath(script)}"
    ] as List<String>

    return task
  }

}
