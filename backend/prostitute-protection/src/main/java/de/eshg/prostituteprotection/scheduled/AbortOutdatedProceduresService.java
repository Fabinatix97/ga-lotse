/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.scheduled;

import de.eshg.prostituteprotection.ProstituteProtectionService;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AbortOutdatedProceduresService {

  private static final Period RETENTION_PERIOD = Period.ofWeeks(2);
  private static final Logger log = LoggerFactory.getLogger(AbortOutdatedProceduresService.class);
  private final ProstituteProtectionProcedureRepository procedureRepository;
  private final ProstituteProtectionService prostituteProtectionService;
  private final Clock clock;

  public AbortOutdatedProceduresService(
      ProstituteProtectionProcedureRepository procedureRepository,
      ProstituteProtectionService prostituteProtectionService,
      Clock clock) {
    this.procedureRepository = procedureRepository;
    this.prostituteProtectionService = prostituteProtectionService;
    this.clock = clock;
  }

  @Scheduled(cron = "0 0 4 * * *")
  @SchedulerLock(name = "ProstituteProtectionAbortOutdatedProcedures", lockAtMostFor = "23h")
  @Transactional
  public void abortOutdatedProcedures() {
    LockAssert.assertLocked();
    Instant retentionThreshold =
        LocalDate.now(clock).atStartOfDay(clock.getZone()).toInstant().minus(RETENTION_PERIOD);
    log.info(
        "Starting aborting procedures - attempting to abort all procedures with appointment start before {}",
        retentionThreshold);
    List<ProstituteProtectionProcedure> proceduresToAbort =
        procedureRepository.findAllOpenByAppointmentStartBefore(retentionThreshold);
    proceduresToAbort.forEach(prostituteProtectionService::abortProcedure);
    procedureRepository.flush();
    log.info("{} procedures aborted", proceduresToAbort.size());
  }
}
