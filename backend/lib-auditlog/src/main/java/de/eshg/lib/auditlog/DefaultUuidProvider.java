/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class DefaultUuidProvider implements UuidProvider {

  @Override
  public UUID nextUuid() {
    return UUID.randomUUID();
  }
}
