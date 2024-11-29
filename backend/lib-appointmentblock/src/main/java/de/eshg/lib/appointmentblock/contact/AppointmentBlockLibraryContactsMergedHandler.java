/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.contact;

import de.eshg.lib.appointmentblock.persistence.AppointmentBlockGroupRepository;
import de.eshg.lib.contact.model.ContactsMergedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AppointmentBlockLibraryContactsMergedHandler {

  private static final Logger log =
      LoggerFactory.getLogger(AppointmentBlockLibraryContactsMergedHandler.class);

  private final AppointmentBlockGroupRepository appointmentBlockGroupRepository;

  AppointmentBlockLibraryContactsMergedHandler(
      AppointmentBlockGroupRepository appointmentBlockGroupRepository) {
    this.appointmentBlockGroupRepository = appointmentBlockGroupRepository;
  }

  @EventListener
  @Transactional
  public void handleContactsMerged(ContactsMergedEvent event) {
    int numberOfReplacedAppointmentBlockGroups =
        appointmentBlockGroupRepository.replaceLocationId(
            event.mergedFromId(), event.mergedIntoId());
    if (numberOfReplacedAppointmentBlockGroups > 0) {
      log.info(
          "Contact '{}' was merged into '{}'. Replaced the location ID in {} appointment block group(s)",
          event.mergedFromId(),
          event.mergedIntoId(),
          numberOfReplacedAppointmentBlockGroups);
    } else {
      log.debug("No location IDs to replace in appointment block groups");
    }
  }
}
