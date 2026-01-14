/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.scheduling.spring;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import java.util.Optional;
import java.util.function.Supplier;
import javax.sql.DataSource;
import net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider;
import net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider.Configuration.Builder;
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import net.javacrumbs.shedlock.support.StorageBasedLockProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * configures ShedLock.
 *
 * @see <a href="https://github.com/lukas-krecan/ShedLock">ShedLock</a>
 */
@Configuration
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "1h")
public class SchedulingConfiguration {

  @FunctionalInterface
  public interface LockedByValueSupplier extends Supplier<String> {}

  @Bean
  @ConditionalOnTestHelperEnabled
  public LockedByValueSupplier lockProviderLockedByValueSupplier() {
    return () -> "[HOSTNAME]";
  }

  @Bean
  public StorageBasedLockProvider lockProvider(
      DataSource dataSource,
      @Autowired(required = false) LockedByValueSupplier lockedByValueSupplier) {
    Builder builder = JdbcTemplateLockProvider.Configuration.builder();

    Optional.ofNullable(lockedByValueSupplier)
        .ifPresent(supplier -> builder.withLockedByValue(supplier.get()));

    return new JdbcTemplateLockProvider(
        builder.withJdbcTemplate(new JdbcTemplate(dataSource)).usingDbTime().build());
  }
}
