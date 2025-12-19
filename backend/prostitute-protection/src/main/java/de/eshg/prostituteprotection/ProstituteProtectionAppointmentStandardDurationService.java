/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import static de.eshg.lib.appointmentblock.AppointmentDurationInfo.mapEntryOf;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.lib.appointmentblock.AbstractSimpleAppointmentStandardDurationService;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.persistence.TransactionHelper;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionAppointmentStandardDuration;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class ProstituteProtectionAppointmentStandardDurationService
    extends AbstractSimpleAppointmentStandardDurationService<
        ProstituteProtectionAppointmentStandardDuration> {

  protected ProstituteProtectionAppointmentStandardDurationService(
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
                AppointmentType.PROSTITUTE_PROTECTION_CONSULTATION,
                ProstituteProtectionAppointmentStandardDuration::getConsultation,
                ProstituteProtectionAppointmentStandardDuration::setConsultation)),
        ProstituteProtectionAppointmentStandardDuration.class,
        ProstituteProtectionAppointmentStandardDuration::new,
        ConfigurationEndpoint.PROSTITUTE_PROTECTION_APPOINTMENT_STANDARD_DURATION);
  }
}
