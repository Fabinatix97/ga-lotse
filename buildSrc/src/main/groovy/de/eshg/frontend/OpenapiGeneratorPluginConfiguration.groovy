// Copyright 2026 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg.frontend

import org.gradle.api.file.RegularFile
import org.gradle.api.provider.MapProperty;

interface OpenapiGeneratorPluginConfiguration {
  MapProperty<String, RegularFile> getInputSpecs()
}
