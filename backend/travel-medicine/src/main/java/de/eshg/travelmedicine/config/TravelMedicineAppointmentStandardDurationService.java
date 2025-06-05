/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.config;

import static de.eshg.config.ConfigurationEndpoint.TRAVEL_MEDICINE_APPOINTMENT_STANDARD_DURATION;
import static de.eshg.lib.appointmentblock.AppointmentDurationInfo.mapEntryOf;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.lib.appointmentblock.AbstractSimpleAppointmentStandardDurationService;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class TravelMedicineAppointmentStandardDurationService
    extends AbstractSimpleAppointmentStandardDurationService<
        TravelMedicineAppointmentStandardDuration> {

  protected TravelMedicineAppointmentStandardDurationService(
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
                AppointmentType.CONSULTATION,
                TravelMedicineAppointmentStandardDuration::getConsultation,
                TravelMedicineAppointmentStandardDuration::setConsultation),
            mapEntryOf(
                AppointmentType.VACCINATION,
                TravelMedicineAppointmentStandardDuration::getVaccination,
                TravelMedicineAppointmentStandardDuration::setVaccination)),
        TravelMedicineAppointmentStandardDuration.class,
        TravelMedicineAppointmentStandardDuration::new,
        TRAVEL_MEDICINE_APPOINTMENT_STANDARD_DURATION);
  }
}
