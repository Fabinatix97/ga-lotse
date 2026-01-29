/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.config.ConfigurationEndpoint.INFECTION_BRIEFING;
import static de.eshg.lib.appointmentblock.AppointmentDurationInfo.mapEntryOf;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingAppointmentStandardDuration;
import de.eshg.lib.appointmentblock.AbstractSimpleAppointmentStandardDurationService;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class InfectionBriefingAppointmentStandardDurationService
    extends AbstractSimpleAppointmentStandardDurationService<
        InfectionBriefingAppointmentStandardDuration> {

  protected InfectionBriefingAppointmentStandardDurationService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter,
      AppointmentBlockProperties appointmentBlockProperties) {
    super(
        entityManager,
        transactionHelper,
        auditLogWriter,
        appointmentBlockProperties,
        MapUtils.orderedMapOfEntries(
            mapEntryOf(
                AppointmentType.INFECTION_BRIEFING_NEW,
                InfectionBriefingAppointmentStandardDuration::getInfectionBriefingNew,
                InfectionBriefingAppointmentStandardDuration::setInfectionBriefingNew),
            mapEntryOf(
                AppointmentType.INFECTION_BRIEFING_REPLACEMENT,
                InfectionBriefingAppointmentStandardDuration::getInfectionBriefingReplacement,
                InfectionBriefingAppointmentStandardDuration::setInfectionBriefingReplacement)),
        InfectionBriefingAppointmentStandardDuration.class,
        InfectionBriefingAppointmentStandardDuration::new,
        INFECTION_BRIEFING);
  }
}
