/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.eshg.base.centralfile.persistence.FacilityService;
import de.eshg.base.centralfile.persistence.PersonService;
import java.time.Clock;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CentralFileCleanupService {

  private static final Logger log = LoggerFactory.getLogger(CentralFileCleanupService.class);

  private final PersonService personService;
  private final FacilityService facilityService;
  private final Clock clock;

  public CentralFileCleanupService(
      PersonService personService, FacilityService facilityService, Clock clock) {
    this.personService = personService;
    this.facilityService = facilityService;
    this.clock = clock;
  }

  @Scheduled(cron = "${de.eshg.central-file-deletion-service.schedule:@daily}")
  void performCleanUpForFacilities() {
    Instant expirationTime = Instant.now(clock);
    deleteExpiredFacilityFileStates(expirationTime);
  }

  @Scheduled(cron = "${de.eshg.central-file-deletion-service.schedule:@daily}")
  void performCleanupForPersons() {
    Instant expirationTime = Instant.now(clock);
    deleteExpiredPersonFileStates(expirationTime);
  }

  private void deleteExpiredPersonFileStates(Instant expirationTime) {
    log.info(
        "Starting clean-up job for person entries in the central file marked for deletion with an expiration time before "
            + expirationTime);
    int personsDeleted = personService.deleteExpiredFileStatesAndReferences(expirationTime);
    log.info("Successfully deleted {} person entries", personsDeleted);
  }

  private void deleteExpiredFacilityFileStates(Instant expirationTime) {
    log.info(
        "Starting clean-up job for facility entries in the central file marked for deletion with an expiration time before "
            + expirationTime);
    int facilitiesDeleted = facilityService.deleteExpiredFileStatesAndReferences(expirationTime);
    log.info("Successfully deleted {} facility entries", facilitiesDeleted);
  }
}
