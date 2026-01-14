/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import java.util.UUID;

@FunctionalInterface
public interface UuidProvider {

  UUID nextUuid();
}
