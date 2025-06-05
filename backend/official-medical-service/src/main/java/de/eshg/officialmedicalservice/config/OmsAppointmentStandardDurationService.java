/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.config;

import static de.eshg.config.ConfigurationEndpoint.OMS_APPOINTMENT_STANDARD_DURATION;
import static de.eshg.lib.appointmentblock.AppointmentDurationInfo.mapEntryOf;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.lib.appointmentblock.AbstractSimpleAppointmentStandardDurationService;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointmentStandardDuration;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class OmsAppointmentStandardDurationService
    extends AbstractSimpleAppointmentStandardDurationService<OmsAppointmentStandardDuration> {

  protected OmsAppointmentStandardDurationService(
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
                AppointmentType.OFFICIAL_MEDICAL_SERVICE_LONG,
                OmsAppointmentStandardDuration::getOfficialMedicalServiceLong,
                OmsAppointmentStandardDuration::setOfficialMedicalServiceLong),
            mapEntryOf(
                AppointmentType.OFFICIAL_MEDICAL_SERVICE_SHORT,
                OmsAppointmentStandardDuration::getOfficialMedicalServiceShort,
                OmsAppointmentStandardDuration::setOfficialMedicalServiceShort)),
        OmsAppointmentStandardDuration.class,
        OmsAppointmentStandardDuration::new,
        OMS_APPOINTMENT_STANDARD_DURATION);
  }
}
