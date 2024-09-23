// Copyright 2024 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg.frontend;

import org.gradle.api.provider.ListProperty;

interface IncludesAndExcludes {
  ListProperty<String> getInclude()

  ListProperty<String> getAdditionalExcludes()
}
