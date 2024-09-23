// Copyright 2024 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg.frontend

import org.gradle.api.provider.ListProperty

class TypescriptDefaults {

  private static final List<String> DEFAULT_EXCLUDES = ["node_modules", 'build', '.gradle']

  static List<String> getAllExcludes(ListProperty<String> additionalExcludes) {
    return DEFAULT_EXCLUDES + additionalExcludes.getOrElse([])
  }

}
