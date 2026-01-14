// Copyright 2026 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg.frontend

import org.gradle.api.Project

class ProjectReferences {

  static List<String> getDependencies(Project project) {
    def gradleDependenciesJson = project.layout.projectDirectory.file('gradleDependencies.json').asFile

    if (!gradleDependenciesJson.exists()) {
      return []
    }

    def gradleDependencies = new groovy.json.JsonSlurper().parseText(gradleDependenciesJson.text)
    return gradleDependencies.dependencies
  }
}
