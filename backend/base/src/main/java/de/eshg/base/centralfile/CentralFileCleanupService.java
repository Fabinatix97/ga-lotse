/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.eshg.base.centralfile.persistence.FacilityService;
import de.eshg.base.centralfile.persistence.PersonService;
import de.eshg.base.centralfile.persistence.PersonWithoutDateOfBirthService;
import java.time.Clock;
import java.time.Instant;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CentralFileCleanupService {

  private static final Logger log = LoggerFactory.getLogger(CentralFileCleanupService.class);

  private final PersonService personService;
  private final PersonWithoutDateOfBirthService personWithoutDateOfBirthService;
  private final FacilityService facilityService;
  private final Clock clock;

  public CentralFileCleanupService(
      PersonService personService,
      PersonWithoutDateOfBirthService personWithoutDateOfBirthService,
      FacilityService facilityService,
      Clock clock) {
    this.personService = personService;
    this.personWithoutDateOfBirthService = personWithoutDateOfBirthService;
    this.facilityService = facilityService;
    this.clock = clock;
  }

  @Scheduled(cron = "${de.eshg.central-file-deletion-service.schedule:@daily}")
  @SchedulerLock(
      name = "BaseCentralFileCleanupServiceFacilities",
      lockAtMostFor = "${de.eshg.central-file-deletion-service.lock-at-most-for:23h}")
  void performCleanUpForFacilities() {
    LockAssert.assertLocked();
    Instant expirationTime = Instant.now(clock);
    deleteExpiredFacilityFileStates(expirationTime);
  }

  @Scheduled(cron = "${de.eshg.central-file-deletion-service.schedule:@daily}")
  @SchedulerLock(
      name = "BaseCentralFileCleanupServicePersons",
      lockAtMostFor = "${de.eshg.central-file-deletion-service.lock-at-most-for:23h}")
  void performCleanupForPersons() {
    LockAssert.assertLocked();
    Instant expirationTime = Instant.now(clock);
    deleteExpiredPersonFileStates(expirationTime);
  }

  @Scheduled(cron = "${de.eshg.central-file-deletion-service.schedule:@daily}")
  @SchedulerLock(
      name = "BaseCentralFileCleanupServicePersonsWithoutDateOfBirth",
      lockAtMostFor = "${de.eshg.central-file-deletion-service.lock-at-most-for:23h}")
  void performCleanupForPersonsWithoutDateOfBirth() {
    LockAssert.assertLocked();
    Instant expirationTime = Instant.now(clock);
    deleteExpiredPersonsWithoutDateOfBirth(expirationTime);
  }

  private void deleteExpiredPersonFileStates(Instant expirationTime) {
    log.info(
        "Starting clean-up job for person entries in the central file marked for deletion with an expiration time before {}",
        expirationTime);
    int personsDeleted = personService.deleteExpiredFileStatesAndReferences(expirationTime);
    log.info("Successfully deleted {} person entries", personsDeleted);
  }

  private void deleteExpiredPersonsWithoutDateOfBirth(Instant expirationTime) {
    log.info(
        "Starting clean-up job for person entries without date of birth in the central file marked for deletion with an expiration time before {}",
        expirationTime);
    int personsDeleted = personWithoutDateOfBirthService.deleteExpiredEntries(expirationTime);
    log.info("Successfully deleted {} person entries without date of birth", personsDeleted);
  }

  private void deleteExpiredFacilityFileStates(Instant expirationTime) {
    log.info(
        "Starting clean-up job for facility entries in the central file marked for deletion with an expiration time before {}",
        expirationTime);
    int facilitiesDeleted = facilityService.deleteExpiredFileStatesAndReferences(expirationTime);
    log.info("Successfully deleted {} facility entries", facilitiesDeleted);
  }
}
