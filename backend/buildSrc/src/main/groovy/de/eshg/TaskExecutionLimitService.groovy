// Copyright 2026 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg

import org.gradle.api.services.BuildService
import org.gradle.api.services.BuildServiceParameters

abstract class TaskExecutionLimitService implements BuildService<BuildServiceParameters.None> {
}
