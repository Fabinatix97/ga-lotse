/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.lib.contact.model.ContactsMergedEvent;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
class SchoolEntryContactsMergedHandler {

  private static final Logger log = LoggerFactory.getLogger(SchoolEntryContactsMergedHandler.class);

  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;

  SchoolEntryContactsMergedHandler(SchoolEntryProcedureRepository schoolEntryProcedureRepository) {
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
  }

  @EventListener
  @Transactional
  void handleContactsMerged(ContactsMergedEvent event) {
    int numberOfReplacedProcedures =
        schoolEntryProcedureRepository.replaceSchoolId(event.mergedFromId(), event.mergedIntoId());
    if (numberOfReplacedProcedures > 0) {
      log.info(
          "School contact '{}' was merged into '{}'. Replaced the school ID in {} procedure(s)",
          event.mergedFromId(),
          event.mergedIntoId(),
          numberOfReplacedProcedures);
    } else {
      log.debug(
          "Received contact merge for id '{}' but found no school contacts to replace in school entry procedures",
          event.mergedFromId());
    }
  }
}
