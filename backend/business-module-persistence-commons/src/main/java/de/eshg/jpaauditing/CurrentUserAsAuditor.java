/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.jpaauditing;

import de.eshg.jpaauditing.JpaAuditingAutoConfiguration.CurrentUserIdProvider;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

@Component(JpaAuditingAutoConfiguration.AUDITOR_PROVIDER_BEAN_NAME)
class CurrentUserAsAuditor implements AuditorAware<UUID> {
  private final CurrentUserIdProvider currentUserIdProvider;

  CurrentUserAsAuditor(CurrentUserIdProvider currentUserIdProvider) {
    this.currentUserIdProvider = currentUserIdProvider;
  }

  @Override
  public Optional<UUID> getCurrentAuditor() {
    return currentUserIdProvider.get();
  }
}
