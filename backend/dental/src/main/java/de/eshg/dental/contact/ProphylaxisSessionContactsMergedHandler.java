/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.contact;

import de.eshg.dental.domain.repository.ProphylaxisSessionRepository;
import de.eshg.lib.contact.model.ContactsMergedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ProphylaxisSessionContactsMergedHandler {

  private static final Logger log =
      LoggerFactory.getLogger(ProphylaxisSessionContactsMergedHandler.class);

  private final ProphylaxisSessionRepository prophylaxisSessionRepository;

  ProphylaxisSessionContactsMergedHandler(
      ProphylaxisSessionRepository prophylaxisSessionRepository) {
    this.prophylaxisSessionRepository = prophylaxisSessionRepository;
  }

  @EventListener
  @Transactional
  public void handleContactsMerged(ContactsMergedEvent event) {
    int numberOfReplacedProphylaxisSessions =
        prophylaxisSessionRepository.replaceInstitutionId(
            event.mergedFromId(), event.mergedIntoId());
    if (numberOfReplacedProphylaxisSessions > 0) {
      log.info(
          "Institution contact '{}' was merged into '{}'. Replaced the institution ID in {} prophylaxis sessions",
          event.mergedFromId(),
          event.mergedIntoId(),
          numberOfReplacedProphylaxisSessions);
    } else {
      log.debug(
          "Received contact merge for id '{}' but found no institution contacts to replace in prophylaxis sessions",
          event.mergedFromId());
    }
  }
}
