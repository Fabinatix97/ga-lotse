/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.scheduling;

import de.eshg.stiprotection.AbstractExpiredEntityRemover;
import de.eshg.stiprotection.persistence.db.AppointmentCooldown;
import de.eshg.stiprotection.persistence.db.AppointmentCooldownRepository;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AppointmentCooldownRemover extends AbstractExpiredEntityRemover<AppointmentCooldown> {

  private final AppointmentCooldownRepository appointmentCooldownRepository;

  public AppointmentCooldownRemover(
      AppointmentCooldownRepository appointmentCooldownRepository,
      Clock clock,
      @Value("${eshg.sti-protection.appointment-cooldown.release-after:5m}") Duration releaseAfter,
      @Value("${eshg.sti-protection.appointment-cooldown.page-size:100}") int pageSize) {
    super(clock, releaseAfter, pageSize);
    this.appointmentCooldownRepository = appointmentCooldownRepository;
  }

  @Transactional
  public void runNow() {
    run();
  }

  @Scheduled(cron = "${eshg.sti-protection.appointment-cooldown.cron}")
  @SchedulerLock(
      name = "CancelledAppointmentsReleaser",
      lockAtMostFor = "1m",
      lockAtLeastFor = "30s")
  @Transactional
  public void scheduleRun() {
    LockAssert.assertLocked();
    run();
  }

  @Override
  protected Page<AppointmentCooldown> fetchExpiredEntities(
      Instant retentionTime, Pageable pageable) {
    return appointmentCooldownRepository.findByCreatedAtBefore(retentionTime, pageable);
  }

  @Override
  protected void processEntity(AppointmentCooldown entity) {
    try {
      appointmentCooldownRepository.delete(entity);
    } catch (RuntimeException e) {
      log.error("Error deleting appointment cooldown with Id {}", entity.getId(), e);
    }
  }
}
