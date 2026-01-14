/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.scheduling;

import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.stiprotection.AbstractExpiredEntityRemover;
import de.eshg.stiprotection.CitizenAppointmentService;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ExpiredAnonymousUsersRemover
    extends AbstractExpiredEntityRemover<StiProtectionProcedure> {

  private final StiProtectionProcedureRepository stiProtectionProcedureRepository;
  private final CitizenAppointmentService citizenAppointmentService;

  public ExpiredAnonymousUsersRemover(
      StiProtectionProcedureRepository stiProtectionProcedureRepository,
      CitizenAppointmentService citizenAppointmentService,
      Clock clock,
      @Value("${eshg.sti-protection.expired-anonymous-users.expire-after:30d}")
          Duration expireAfter,
      @Value("${eshg.sti-protection.expired-anonymous-users.page-size:100}") int pageSize) {
    super(clock, expireAfter, pageSize);
    this.stiProtectionProcedureRepository = stiProtectionProcedureRepository;
    this.citizenAppointmentService = citizenAppointmentService;
  }

  @Scheduled(cron = "${eshg.sti-protection.expired-anonymous-users.cron:@daily}")
  @SchedulerLock(
      name = "ExpiredAnonymousUsersRemover",
      lockAtMostFor = "30m",
      lockAtLeastFor = "1m")
  @Transactional
  public void scheduleRun() {
    LockAssert.assertLocked();
    run();
  }

  @Override
  protected Page<StiProtectionProcedure> fetchExpiredEntities(
      Instant retentionTime, Pageable pageable) {
    return stiProtectionProcedureRepository.findAll(closedAtBefore(retentionTime), pageable);
  }

  private static Specification<StiProtectionProcedure> closedAtBefore(Instant retentionTime) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.lessThanOrEqualTo(root.get(Procedure_.closedAt), retentionTime);
  }

  @Override
  protected void processEntity(StiProtectionProcedure procedure) {
    UUID anonymousUserId = procedure.getAnonymousUserId();
    if (anonymousUserId != null) {
      try {
        citizenAppointmentService.deleteCitizenAccessCodeUser(anonymousUserId);
      } catch (RuntimeException e) {
        log.warn("Error deleting user with ID {}", anonymousUserId, e);
      }
      procedure.setAnonymousUserId(null);
      procedure.setAccessCode(null);
    }
  }
}
