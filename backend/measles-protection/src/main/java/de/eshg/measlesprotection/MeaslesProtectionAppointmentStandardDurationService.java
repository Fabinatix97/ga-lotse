/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static de.eshg.config.ConfigurationEndpoint.MEASLES_PROTECTION_APPOINTMENT_STANDARD_DURATION;
import static de.eshg.lib.appointmentblock.AppointmentDurationInfo.mapEntryOf;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.lib.appointmentblock.AbstractSimpleAppointmentStandardDurationService;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.measlesprotection.config.MeaslesProtectionAppointmentStandardDuration;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class MeaslesProtectionAppointmentStandardDurationService
    extends AbstractSimpleAppointmentStandardDurationService<
        MeaslesProtectionAppointmentStandardDuration> {

  protected MeaslesProtectionAppointmentStandardDurationService(
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
                AppointmentType.PROOF_SUBMISSION,
                MeaslesProtectionAppointmentStandardDuration::getProofSubmission,
                MeaslesProtectionAppointmentStandardDuration::setProofSubmission)),
        MeaslesProtectionAppointmentStandardDuration.class,
        MeaslesProtectionAppointmentStandardDuration::new,
        MEASLES_PROTECTION_APPOINTMENT_STANDARD_DURATION);
  }
}
