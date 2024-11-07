/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.travelmedicine.util.MappingUtil;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationConsultationTravelDetailsRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelInformationDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.CreatedByUserType;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Person;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.TravelTimeUnit;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.TravelType;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultationTask;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class VaccinationConsultationMapper {

  private final Clock clock;
  private final AuditLogger auditLogger;

  public VaccinationConsultationMapper(Clock clock, AuditLogger auditLogger) {
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  public VaccinationConsultation toDomainType(
      TravelInformationDto travelInformation,
      UUID patientIdFromCentralFile,
      UUID currentUserId,
      CreatedByUserType userType) {
    VaccinationConsultation vaccinationConsultation = new VaccinationConsultation();
    vaccinationConsultation.setProcedureType(ProcedureType.TM_VACCINATION_CONSULTATION);

    Person patient = buildPatient(patientIdFromCentralFile);
    vaccinationConsultation.addRelatedPerson(patient);

    vaccinationConsultation.setTravelType(
        MappingUtil.mapEnum(TravelType.class, travelInformation.travelType()));
    vaccinationConsultation.setTravelDestinations(travelInformation.travelDestinations());
    vaccinationConsultation.setTravelStartDate(travelInformation.travelStartDate());
    vaccinationConsultation.setTravelTimeAmount(travelInformation.travelTimeAmount());
    vaccinationConsultation.setTravelTimeUnit(
        MappingUtil.mapEnum(TravelTimeUnit.class, travelInformation.travelTimeUnit()));
    ProcedureStatus procedureStatus =
        userType == CreatedByUserType.CITIZEN_PORTAL ? ProcedureStatus.DRAFT : ProcedureStatus.OPEN;
    vaccinationConsultation.updateProcedureStatus(procedureStatus, clock, auditLogger);
    vaccinationConsultation.setCreatedBy(userType);

    VaccinationConsultationTask vaccinationConsultationTask = new VaccinationConsultationTask();
    if (currentUserId != null) {
      vaccinationConsultationTask.assign(currentUserId, currentUserId, Instant.now(clock));
    }
    vaccinationConsultationTask.setTaskType(TaskType.TRAVEL_MEDICINE);
    vaccinationConsultationTask.setTaskStatus(TaskStatus.OPEN);
    vaccinationConsultation.addTask(vaccinationConsultationTask);

    return vaccinationConsultation;
  }

  public VaccinationConsultation toDomainTypePatchTravel(
      PatchVaccinationConsultationTravelDetailsRequest request,
      VaccinationConsultation vaccinationConsultation) {
    vaccinationConsultation.setTravelType(
        MappingUtil.mapEnum(TravelType.class, request.travelType()));
    vaccinationConsultation.setTravelDestinations(request.travelDestinations());
    vaccinationConsultation.setTravelStartDate(request.travelStartDate());
    vaccinationConsultation.setTravelTimeAmount(request.travelTimeAmount());
    vaccinationConsultation.setTravelTimeUnit(
        MappingUtil.mapEnum(TravelTimeUnit.class, request.travelTimeUnit()));
    return vaccinationConsultation;
  }

  // extended naming as UUID doesn't seem sufficient to determine usecase
  public VaccinationConsultation toDomainTypePatchPerson(
      UUID patientIdFromCentralFile, VaccinationConsultation vaccinationConsultation) {
    Person patient = buildPatient(patientIdFromCentralFile);
    vaccinationConsultation
        .getRelatedPersons()
        .removeIf(p -> PersonType.PATIENT.equals(p.getPersonType()));
    vaccinationConsultation.addRelatedPerson(patient);
    return vaccinationConsultation;
  }

  private static Person buildPatient(UUID patientIdFromCentralFile) {
    Person patient = new Person();
    patient.setCentralFileStateId(patientIdFromCentralFile);
    patient.setPersonType(PersonType.PATIENT);
    return patient;
  }
}
