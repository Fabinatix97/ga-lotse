/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad;

import static de.eshg.lib.appointmentblock.AppointmentDurationInfo.mapEntryOf;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.lib.appointmentblock.AbstractSimpleAppointmentStandardDurationService;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.medsabroad.persistence.database.MedsAbroadAppointmentStandardDuration;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class MedsAbroadAppointmentStandardDurationService
    extends AbstractSimpleAppointmentStandardDurationService<
        MedsAbroadAppointmentStandardDuration> {

  protected MedsAbroadAppointmentStandardDurationService(
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
                AppointmentType.MEDS_ABROAD_CERTIFICATION,
                MedsAbroadAppointmentStandardDuration::getCertification,
                MedsAbroadAppointmentStandardDuration::setCertification)),
        MedsAbroadAppointmentStandardDuration.class,
        MedsAbroadAppointmentStandardDuration::new,
        ConfigurationEndpoint.MEDS_ABROAD_APPOINTMENT_STANDARD_DURATION);
  }
}
