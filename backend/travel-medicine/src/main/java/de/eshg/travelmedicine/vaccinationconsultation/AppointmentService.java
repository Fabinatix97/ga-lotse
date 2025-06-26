/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.lib.appointmentblock.AbstractAppointmentService;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.EntityWithAppointment;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStepRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.UserDefinedAppointment;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.UserDefinedAppointmentRepository;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService extends AbstractAppointmentService<ProcedureStep> {
  private final UserDefinedAppointmentRepository userDefinedAppointmentRepository;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final TravelMedicineFeatureToggle travelMedicineFeatureToggle;
  private final ProcedureStepRepository procedureStepRepository;
  private final PersonClient personClient;

  public AppointmentService(
      Clock clock,
      UserDefinedAppointmentRepository userDefinedAppointmentRepository,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      TravelMedicineFeatureToggle travelMedicineFeatureToggle,
      ProcedureStepRepository procedureStepRepository,
      PersonClient personClient) {
    super(clock);
    this.userDefinedAppointmentRepository = userDefinedAppointmentRepository;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.travelMedicineFeatureToggle = travelMedicineFeatureToggle;
    this.procedureStepRepository = procedureStepRepository;
    this.personClient = personClient;
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

  public void createBlockAppointmentForStep(
      ProcedureStep procedureStep, Instant start, Integer durationInMinutes) {

    checkExistingAppointment(procedureStep);

    AppointmentType appointmentType = procedureStep.getAppointmentType();
    Instant end = start.plus(Duration.ofMinutes(durationInMinutes));
    appointmentBlockSlotUtil.updateAppointment(
        appointmentType, null, null, procedureStep, start, end);
  }

  public Appointment createBlockAppointment(
      AppointmentType appointmentType, Instant start, Integer durationInMinutes) {
    DummyEntityWithAppointment appointmentHolder = new DummyEntityWithAppointment();
    Instant end = start.plus(Duration.ofMinutes(durationInMinutes));
    appointmentBlockSlotUtil.updateAppointment(
        appointmentType, null, null, appointmentHolder, start, end);
    return appointmentHolder.getAppointment();
  }

  public void cancelAppointment(ProcedureStep procedureStep) {

    Appointment blockAppointment = procedureStep.getAppointment();
    UserDefinedAppointment userDefinedAppointment = procedureStep.getUserDefinedAppointment();
    if (blockAppointment != null) {
      UserDefinedAppointment cancelledUda =
          new UserDefinedAppointment(
              blockAppointment.getAppointmentStart(), blockAppointment.getAppointmentEnd(), true);
      userDefinedAppointmentRepository.save(cancelledUda);
      procedureStep.setUserDefinedAppointment(cancelledUda);
      procedureStep.setAppointment(null);
    } else if (userDefinedAppointment != null && !userDefinedAppointment.isCancelled()) {
      userDefinedAppointment.setCancelled(true);
    } else {
      throw new BadRequestException("Procedure step has no uncancelled appointment.");
    }
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

  @Override
  public void checkAppointmentBlockViewFeatureActive() {
    throw new BadRequestException("No feature toggle");
  }

  @Override
  protected List<ProcedureStep> resolveEntitiesWithAppointments(List<Appointment> appointments) {
    return procedureStepRepository.findByAppointmentIn(appointments);
  }

  @Override
  protected Map<ProcedureStep, String> getInformationForAppointmentOverview(
      List<ProcedureStep> entities) {
    Map<ProcedureStep, UUID> stepToCentralFileId =
        entities.stream()
            .collect(
                Collectors.toMap(
                    entity -> entity,
                    entity ->
                        entity
                            .getVaccinationConsultation()
                            .getPatientIdsFromCentralFile()
                            .getFirst()));

    Map<UUID, PatientDto> personsFromCentralFile =
        personClient.getPersonsFromCentralFile(
            stepToCentralFileId.values().stream().distinct().toList());

    return entities.stream()
        .collect(
            Collectors.toMap(
                entity -> entity,
                entity -> {
                  UUID centralFileId = stepToCentralFileId.get(entity);
                  PatientDto patientDto = personsFromCentralFile.get(centralFileId);
                  if (patientDto == null) {
                    return "";
                  }
                  return "%s %s".formatted(patientDto.firstName(), patientDto.lastName());
                }));
  }

  @Override
  protected UUID getProcedureId(ProcedureStep entity) {
    return entity.getVaccinationConsultation().getExternalId();
  }

  static class DummyEntityWithAppointment implements EntityWithAppointment {

    private Appointment appointment;

    @Override
    public Appointment getAppointment() {
      return appointment;
    }

    @Override
    public void setAppointment(Appointment appointment) {
      this.appointment = appointment;
    }
  }
}
