/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.user.CitizenAccessCodeUserClient;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class OmsProcedureKeycloakUserCleanupJob {
  private static final Logger log =
      LoggerFactory.getLogger(OmsProcedureKeycloakUserCleanupJob.class);

  private final Duration overdueDuration;
  private final OmsProcedureRepository omsProcedureRepository;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final CitizenAccessCodeUserClient citizenAccessCodeUserClient;
  private final Clock clock;

  public OmsProcedureKeycloakUserCleanupJob(
      @Value("${de.eshg.official-medical-service.keycloak-user-cleanup-job.overdue-duration:30d}")
          Duration overdueDuration,
      OmsProcedureRepository omsProcedureRepository,
      ModuleClientAuthenticator moduleClientAuthenticator,
      CitizenAccessCodeUserClient citizenAccessCodeUserClient,
      Clock clock) {
    this.overdueDuration = overdueDuration;
    this.omsProcedureRepository = omsProcedureRepository;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.citizenAccessCodeUserClient = citizenAccessCodeUserClient;
    this.clock = clock;
  }

  @Scheduled(cron = "0 0 2 * * ?")
  @SchedulerLock(name = "OmsProcedureKeycloakUserCleanupJob", lockAtMostFor = "23h")
  public void run() {
    LockAssert.assertLocked();
    performOmsProcedureKeycloakUserCleanupJob();
  }

  public void performOmsProcedureKeycloakUserCleanupJob() {
    log.info("Starting oms keycloak user cleanup job...");
    ZonedDateTime now = ZonedDateTime.now(clock);
    Instant cutOffDate = now.minus(overdueDuration).toInstant();

    List<OmsProcedure> closedProcedures =
        omsProcedureRepository.findClosedProceduresWithExistingKeycloakUsers(cutOffDate);

    closedProcedures.forEach(
        procedure -> {
          moduleClientAuthenticator.doWithModuleClientAuthentication(
              () ->
                  citizenAccessCodeUserClient.deleteCitizenAccessCodeUser(
                      procedure.getCitizenUserId()));
          procedure.setCitizenUserId(null);
          omsProcedureRepository.saveAndFlush(procedure);
        });

    log.info("oms keycloak user cleanup job completed.");
  }
}
