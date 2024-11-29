/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.contact;

import de.eshg.lib.contact.model.ContactsMergedEvent;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SchoolEntryProcedureContactsMergedHandler {

  private static final Logger log =
      LoggerFactory.getLogger(SchoolEntryProcedureContactsMergedHandler.class);

  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;

  SchoolEntryProcedureContactsMergedHandler(
      SchoolEntryProcedureRepository schoolEntryProcedureRepository) {
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
  }

  @EventListener
  @Transactional
  public void handleContactsMerged(ContactsMergedEvent event) {
    replaceSchoolContacts(event);
    replaceLocationContacts(event);
  }

  private void replaceSchoolContacts(ContactsMergedEvent event) {
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

  private void replaceLocationContacts(ContactsMergedEvent event) {
    int numberOfReplacedProcedures =
        schoolEntryProcedureRepository.replaceLocationId(
            event.mergedFromId(), event.mergedIntoId());
    if (numberOfReplacedProcedures > 0) {
      log.info(
          "Location contact '{}' was merged into '{}'. Replaced the location ID in {} procedure(s)",
          event.mergedFromId(),
          event.mergedIntoId(),
          numberOfReplacedProcedures);
    } else {
      log.debug(
          "Received contact merge for id '{}' but found no location contacts to replace in school entry procedures",
          event.mergedFromId());
    }
  }
}
