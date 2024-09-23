/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.travelmedicine.util.MappingUtil;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentBookingTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentSummaryDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetVaccinationConsultationDetailsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.InformationStatementDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.ServicePlanEntryDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.ServiceStatusDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelInformationDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelTimeUnitDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.InformationStatement;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.OtherService;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ServicePlanEntry;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.UserDefinedAppointment;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Vaccination;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationType;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VcService;
import jakarta.validation.UnexpectedTypeException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class VaccinationConsultationDetailsMapper {
  private final InformationStatementMapper informationStatementMapper;

  public VaccinationConsultationDetailsMapper(
      InformationStatementMapper informationStatementMapper) {
    this.informationStatementMapper = informationStatementMapper;
  }

  public GetVaccinationConsultationDetailsResponse toInterfaceType(
      VaccinationConsultation vaccinationConsultation,
      PatientDto patientDto,
      ProcedureStep initialProcedureStep,
      List<ServicePlanEntry> servicePlan,
      List<InformationStatement> informationStatements) {

    return new GetVaccinationConsultationDetailsResponse(
        vaccinationConsultation.getExternalId(),
        MappingUtil.mapEnum(ProcedureStatusDto.class, vaccinationConsultation.getProcedureStatus()),
        patientDto,
        mapTravelInformationToInterfaceType(vaccinationConsultation),
        mapToAppointmentSummaryInterfaceType(initialProcedureStep),
        mapServicePlanToToInterfaceType(servicePlan),
        mapInformationStatementsToInterfaceType(informationStatements));
  }

  private List<ServicePlanEntryDto> mapServicePlanToToInterfaceType(
      List<ServicePlanEntry> servicePlan) {
    return servicePlan.stream()
        .map(this::mapServicePlanRowToInterfaceType)
        .sorted(
            Comparator.comparing(
                    ServicePlanEntryDto::appointment,
                    Comparator.nullsFirst(Comparator.naturalOrder()))
                .thenComparing(ServicePlanEntryDto::serviceTypeDescription)
                .thenComparing(
                    ServicePlanEntryDto::diseaseName,
                    Comparator.nullsFirst(Comparator.naturalOrder()))
                .thenComparing(
                    ServicePlanEntryDto::vaccineName,
                    Comparator.nullsFirst(Comparator.naturalOrder()))
                .thenComparing(
                    ServicePlanEntryDto::vaccinationNumber,
                    Comparator.nullsFirst(Comparator.naturalOrder())))
        .toList();
  }

  private ServicePlanEntryDto mapServicePlanRowToInterfaceType(ServicePlanEntry servicePlanEntry) {
    VcService service = servicePlanEntry.service();
    String serviceDescription;
    String diseaseName = null;
    String vaccineName = null;
    Integer vaccinationNumber = null;
    String batchIdentifier = null;
    Integer latency = null;
    Instant appointment =
        getAppointmentStartDate(
            servicePlanEntry.appointment(), servicePlanEntry.userDefinedAppointment());
    LocalDate earliestDate =
        service.getProcedureStep() == null ? null : service.getProcedureStep().getEarliestDate();
    AppointmentTypeDto appointmentType = getAppointmentType(service.getProcedureStep());
    AppointmentBookingTypeDto appointmentBookingType =
        getAppointmentBookingType(
            servicePlanEntry.appointment(), servicePlanEntry.userDefinedAppointment());
    ServiceStatusDto status =
        MappingUtil.mapEnum(ServiceStatusDto.class, service.getServiceStatus());
    UUID procedureStepId =
        servicePlanEntry.procedureStep() == null ? null : servicePlanEntry.procedureStep().getId();
    BigDecimal fee = service.getFee();
    Boolean medicalHistoryCompleted = servicePlanEntry.isMedicalHistoryAnswered();
    LocalDate appliedAt = service.getAppliedAt();
    if (service instanceof OtherService os) {
      serviceDescription = os.getDescription();
    } else if (service instanceof Vaccination vac) {
      serviceDescription =
          vac.getVaccinationType() == VaccinationType.BASIC
              ? "Grundimmunisierung"
              : "Auffrischimpfung";
      diseaseName = vac.getDiseaseName();
      vaccineName = vac.getVaccineName();
      vaccinationNumber = vac.getVaccinationNumber();
      batchIdentifier = vac.getBatchIdentifier();
      latency = vac.getLatency();
    } else {
      throw new UnexpectedTypeException("ServiceType unknown");
    }

    return new ServicePlanEntryDto(
        service.getId(),
        serviceDescription,
        diseaseName,
        vaccineName,
        vaccinationNumber,
        latency,
        batchIdentifier,
        appliedAt,
        service.getPhysician(),
        service.getMfa(),
        status,
        procedureStepId,
        appointment,
        appointmentType,
        appointmentBookingType,
        earliestDate,
        fee,
        medicalHistoryCompleted);
  }

  private AppointmentTypeDto getAppointmentType(ProcedureStep procedureStep) {

    return procedureStep == null
        ? null
        : MappingUtil.mapEnum(AppointmentTypeDto.class, procedureStep.getAppointmentType());
  }

  private Instant getAppointmentStartDate(
      Appointment appointment, UserDefinedAppointment userDefinedAppointment) {

    if (appointment != null) {
      return appointment.getAppointmentStart();
    }
    if (userDefinedAppointment != null) {
      return userDefinedAppointment.getAppointmentStart();
    }
    return null;
  }

  private AppointmentBookingTypeDto getAppointmentBookingType(
      Appointment appointment, UserDefinedAppointment userDefinedAppointment) {

    if (appointment != null) {
      return AppointmentBookingTypeDto.APPOINTMENT_BLOCK;
    }
    if (userDefinedAppointment != null) {
      return AppointmentBookingTypeDto.USER_DEFINED;
    }
    return null;
  }

  private Instant getAppointmentEndDate(
      Appointment appointment, UserDefinedAppointment userDefinedAppointment) {

    if (appointment != null) {
      return appointment.getAppointmentEnd();
    }
    if (userDefinedAppointment != null) {
      return userDefinedAppointment.getAppointmentEnd();
    }
    return null;
  }

  public List<AppointmentSummaryDto> mapToAppointmentSummaries(List<ProcedureStep> procedureSteps) {
    if (procedureSteps == null) {
      return Collections.emptyList();
    }
    return procedureSteps.stream()
        .map(this::mapToAppointmentSummaryInterfaceType)
        .sorted(Comparator.comparing(AppointmentSummaryDto::start))
        .toList();
  }

  public AppointmentSummaryDto mapToAppointmentSummaryInterfaceType(ProcedureStep ps) {
    AppointmentBookingTypeDto bookingType;
    if (ps.getAppointment() != null) {
      bookingType = AppointmentBookingTypeDto.APPOINTMENT_BLOCK;
    } else if (ps.getUserDefinedAppointment() != null) {
      bookingType = AppointmentBookingTypeDto.USER_DEFINED;
    } else {
      bookingType = AppointmentBookingTypeDto.SELF_BOOKING;
    }
    Instant appointmentStartDate =
        getAppointmentStartDate(ps.getAppointment(), ps.getUserDefinedAppointment());

    return new AppointmentSummaryDto(
        ps.getId(),
        appointmentStartDate,
        getAppointmentEndDate(ps.getAppointment(), ps.getUserDefinedAppointment()),
        ps.getEarliestDate(),
        MappingUtil.mapEnum(AppointmentTypeDto.class, ps.getAppointmentType()),
        bookingType);
  }

  private TravelInformationDto mapTravelInformationToInterfaceType(VaccinationConsultation vc) {
    return new TravelInformationDto(
        MappingUtil.mapEnum(TravelTypeDto.class, vc.getTravelType()),
        new ArrayList<>(vc.getTravelDestinations()),
        vc.getTravelStartDate(),
        vc.getTravelTimeAmount(),
        MappingUtil.mapEnum(TravelTimeUnitDto.class, vc.getTravelTimeUnit()));
  }

  private List<InformationStatementDto> mapInformationStatementsToInterfaceType(
      List<InformationStatement> informationStatements) {
    return informationStatementMapper.mapInformationStatementsToInterfaceType(
        informationStatements);
  }
}
