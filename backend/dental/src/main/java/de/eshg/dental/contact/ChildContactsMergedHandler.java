/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.contact;

import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.lib.contact.model.ContactsMergedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ChildContactsMergedHandler {

  private static final Logger log = LoggerFactory.getLogger(ChildContactsMergedHandler.class);

  private final ChildRepository childRepository;

  ChildContactsMergedHandler(ChildRepository childRepository) {
    this.childRepository = childRepository;
  }

  @EventListener
  @Transactional
  public void handleContactsMerged(ContactsMergedEvent event) {
    int numberOfReplacedChildren =
        childRepository.replaceInstitutionId(event.mergedFromId(), event.mergedIntoId());
    if (numberOfReplacedChildren > 0) {
      log.info(
          "Institution contact '{}' was merged into '{}'. Replaced the institution ID in {} children",
          event.mergedFromId(),
          event.mergedIntoId(),
          numberOfReplacedChildren);
    } else {
      log.debug(
          "Received contact merge for id '{}' but found no institution contacts to replace in children",
          event.mergedFromId());
    }
  }
}
