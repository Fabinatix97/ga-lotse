/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.scheduled;

import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import java.time.Clock;
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
public class DeleteEncryptedDataService {

  private static final Period RETENTION_PERIOD = Period.ofMonths(3);
  private static final Logger log = LoggerFactory.getLogger(DeleteEncryptedDataService.class);
  private final ProstituteProtectionProcedureRepository procedureRepository;
  private final Clock clock;

  public DeleteEncryptedDataService(
      ProstituteProtectionProcedureRepository procedureRepository, Clock clock) {
    this.procedureRepository = procedureRepository;
    this.clock = clock;
  }

  @Scheduled(cron = "0 0 4 * * *")
  @SchedulerLock(name = "ProstituteProtectionDeleteEncryptedData", lockAtMostFor = "23h")
  @Transactional
  public void deleteEncryptedData() {
    LockAssert.assertLocked();
    LocalDate retentionThreshold = LocalDate.now(clock).minus(RETENTION_PERIOD);

    log.info(
        "Starting deletion encrypted data - attempting to delete encrypted data of procedures without emergency situation and with expired certificates after {}",
        retentionThreshold);

    List<ProstituteProtectionProcedure> procedures =
        procedureRepository.findByNoEmergencySituationAndCertificateExpired(retentionThreshold);

    procedureRepository.deleteEncryptedFiles(
        procedures.stream().map(ProstituteProtectionProcedure::getExternalId).toList());
    for (ProstituteProtectionProcedure procedure : procedures) {
      procedure.setEncryptedPersonalData(null);
    }

    procedureRepository.flush();
    log.info("{} encrypted data deleted", procedures.size());
  }
}
