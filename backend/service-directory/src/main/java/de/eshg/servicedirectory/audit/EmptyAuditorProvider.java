/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.audit;

import de.eshg.jpaauditing.JpaAuditingAutoConfiguration.CurrentUserIdProvider;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class EmptyAuditorProvider implements CurrentUserIdProvider {
  @Override
  public Optional<UUID> get() {
    return Optional.empty();
  }
}
