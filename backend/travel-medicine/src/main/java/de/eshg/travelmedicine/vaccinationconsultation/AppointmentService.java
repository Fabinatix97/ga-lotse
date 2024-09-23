/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.UserDefinedAppointment;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.UserDefinedAppointmentRepository;
import java.time.Duration;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {
  private final UserDefinedAppointmentRepository userDefinedAppointmentRepository;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;

  public AppointmentService(
      UserDefinedAppointmentRepository userDefinedAppointmentRepository,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil) {
    this.userDefinedAppointmentRepository = userDefinedAppointmentRepository;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
  }

  public void createUserDefinedAppointment(
      ProcedureStep procedureStep, Instant start, Integer durationInMinutes) {
    if (durationInMinutes == null || durationInMinutes < 1) {
      throw new BadRequestException("User defined appointment needs a duration greater than 0");
    }

    Instant end = start.plus(Duration.ofMinutes(durationInMinutes));

    UserDefinedAppointment userDefinedAppointment = new UserDefinedAppointment(start, end);

    UserDefinedAppointment savedUserDefinedAppointment =
        userDefinedAppointmentRepository.save(userDefinedAppointment);
    procedureStep.setUserDefinedAppointment(savedUserDefinedAppointment);
  }

  public void createAppointment(
      ProcedureStep procedureStep, Instant start, Integer durationInMinutes) {

    checkExistingAppointment(procedureStep);

    AppointmentType appointmentType = procedureStep.getAppointmentType();
    Instant end = start.plus(Duration.ofMinutes(durationInMinutes));
    appointmentBlockSlotUtil.updateAppointment(appointmentType, null, procedureStep, start, end);
  }

  private void checkExistingAppointment(ProcedureStep procedureStep) {
    if (procedureStep.getUserDefinedAppointment() != null) {
      throw new BadRequestException(
          String.format(
              "Procedure step %s already has an user defined appointment.", procedureStep.getId()));
    }
    if (procedureStep.getAppointment() != null) {
      throw new BadRequestException(
          String.format(
              "Procedure step %s already has an appointment from appointment block.",
              procedureStep.getId()));
    }
  }
}
