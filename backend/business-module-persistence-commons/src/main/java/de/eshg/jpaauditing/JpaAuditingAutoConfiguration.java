/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.jpaauditing;

import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@AutoConfiguration
@EnableJpaAuditing(
    dateTimeProviderRef = JpaAuditingAutoConfiguration.DATE_TIME_PROVIDER_BEAN_NAME,
    auditorAwareRef = JpaAuditingAutoConfiguration.AUDITOR_PROVIDER_BEAN_NAME)
@Import({ClockAsDateTimeProvider.class, CurrentUserAsAuditor.class})
public class JpaAuditingAutoConfiguration {

  static final String DATE_TIME_PROVIDER_BEAN_NAME = "dateTimeProvider";
  static final String AUDITOR_PROVIDER_BEAN_NAME = "auditorProvider";

  @Bean
  @ConditionalOnMissingBean(CurrentUserIdProvider.class)
  public CurrentUserIdProvider currentUserIdProvider() {
    return CurrentUserHelper::getCurrentUserIdGracefully;
  }

  public interface CurrentUserIdProvider extends Supplier<Optional<UUID>> {}
}
