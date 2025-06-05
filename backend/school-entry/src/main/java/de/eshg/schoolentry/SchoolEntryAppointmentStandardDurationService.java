/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.config.ConfigurationEndpoint.SCHOOL_ENTRY_APPOINTMENT_STANDARD_DURATION;
import static de.eshg.lib.appointmentblock.AppointmentDurationInfo.mapEntryOf;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.lib.appointmentblock.AbstractSimpleAppointmentStandardDurationService;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.persistence.TransactionHelper;
import de.eshg.schoolentry.config.SchoolEntryAppointmentStandardDuration;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class SchoolEntryAppointmentStandardDurationService
    extends AbstractSimpleAppointmentStandardDurationService<
        SchoolEntryAppointmentStandardDuration> {

  protected SchoolEntryAppointmentStandardDurationService(
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
                AppointmentType.CAN_CHILD,
                SchoolEntryAppointmentStandardDuration::getCanChild,
                SchoolEntryAppointmentStandardDuration::setCanChild),
            mapEntryOf(
                AppointmentType.ENTRY_LEVEL,
                SchoolEntryAppointmentStandardDuration::getEntryLevel,
                SchoolEntryAppointmentStandardDuration::setEntryLevel),
            mapEntryOf(
                AppointmentType.REGULAR_EXAMINATION,
                SchoolEntryAppointmentStandardDuration::getRegularExamination,
                SchoolEntryAppointmentStandardDuration::setRegularExamination),
            mapEntryOf(
                AppointmentType.SPECIAL_NEEDS,
                SchoolEntryAppointmentStandardDuration::getSpecialNeeds,
                SchoolEntryAppointmentStandardDuration::setSpecialNeeds)),
        SchoolEntryAppointmentStandardDuration.class,
        SchoolEntryAppointmentStandardDuration::new,
        SCHOOL_ENTRY_APPOINTMENT_STANDARD_DURATION);
  }
}
