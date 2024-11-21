/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import static de.eshg.travelmedicine.featuretoggle.TravelMedicineFeature.DEFAULT_BATCH_ID;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import de.eshg.travelmedicine.util.MappingUtil;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentBookingTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentSummaryDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.CreatedByUserTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetVaccinationConsultationDetailsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PersonSyncDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.ServicePlanEntryDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.ServicePlanGroupDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.ServiceStatusDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelInformationDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelTimeUnitDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelTypeDto;
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
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class VaccinationConsultationDetailsMapper {
  private final AppointmentBookingTypeMapper appointmentBookingTypeMapper;
  private final TravelMedicineFeatureToggle travelMedicineFeatureToggle;

  public VaccinationConsultationDetailsMapper(
      AppointmentBookingTypeMapper appointmentBookingTypeMapper,
      TravelMedicineFeatureToggle travelMedicineFeatureToggle) {
    this.appointmentBookingTypeMapper = appointmentBookingTypeMapper;
    this.travelMedicineFeatureToggle = travelMedicineFeatureToggle;
  }

  public GetVaccinationConsultationDetailsResponse toInterfaceType(
      VaccinationConsultation vaccinationConsultation,
      PatientDto patientDto,
      PersonSyncDto personSync,
      ProcedureStep initialProcedureStep,
      List<ServicePlanEntry> servicePlan) {

    return new GetVaccinationConsultationDetailsResponse(
        vaccinationConsultation.getExternalId(),
        MappingUtil.mapEnum(ProcedureStatusDto.class, vaccinationConsultation.getProcedureStatus()),
        patientDto,
        personSync,
        mapTravelInformationToInterfaceType(vaccinationConsultation),
        MappingUtil.mapEnum(CreatedByUserTypeDto.class, vaccinationConsultation.getCreatedBy()),
        initialProcedureStep.getId(),
        mapServicePlanToToInterfaceType(servicePlan, initialProcedureStep));
  }

  private List<ServicePlanGroupDto> mapServicePlanToToInterfaceType(
      List<ServicePlanEntry> servicePlan, ProcedureStep initialProcedureStep) {
    Map<ProcedureStep, List<ServicePlanEntry>> groups =
        servicePlan.stream().collect(groupingByWithNullKeys(ServicePlanEntry::procedureStep));
    List<ServicePlanGroupDto> groupDtos = new ArrayList<>();
    for (Map.Entry<ProcedureStep, List<ServicePlanEntry>> entry : groups.entrySet()) {
      ProcedureStep step = entry.getKey();
      List<ServicePlanEntry> servicePlanEntries = entry.getValue();
      Instant appointment =
          step == null
              ? null
              : getAppointmentStartDate(step.getAppointment(), step.getUserDefinedAppointment());
      LocalDate earliestDate = step == null ? null : step.getEarliestDate();
      AppointmentTypeDto appointmentType = getAppointmentType(step);
      AppointmentBookingTypeDto appointmentBookingType =
          step == null
              ? null
              : appointmentBookingTypeMapper.mapToInterfaceType(
                  step.getAppointment(), step.getUserDefinedAppointment());
      BigDecimal groupFee = BigDecimal.ZERO;
      for (ServicePlanEntry spEntry : servicePlanEntries) {
        groupFee = groupFee.add(spEntry.service().getFee());
      }
      Boolean medicalHistoryCompleted =
          step == null ? null : step.getMedicalHistory().isCompletelyAnswered();
      Boolean citizenHasAnswered =
          step == null ? null : step.getMedicalHistory().isCitizenHasAnswered();
      groupDtos.add(
          new ServicePlanGroupDto(
              mapServicePlanEntriesToInterfaceType(servicePlanEntries),
              step == null ? null : step.getExternalId(),
              appointment,
              appointmentType,
              appointmentBookingType,
              earliestDate,
              groupFee,
              medicalHistoryCompleted,
              citizenHasAnswered));
    }
    addInitialStepIfNotAlreadyInList(groupDtos, initialProcedureStep);

    return groupDtos.stream()
        .sorted(
            Comparator.comparing(
                    ServicePlanGroupDto::earliestDate,
                    Comparator.nullsFirst(Comparator.naturalOrder()))
                .thenComparing(
                    ServicePlanGroupDto::appointment,
                    Comparator.nullsFirst(Comparator.naturalOrder())))
        .toList();
  }

  private void addInitialStepIfNotAlreadyInList(
      List<ServicePlanGroupDto> groupDtos, ProcedureStep initialProcedureStep) {
    if (groupDtos.stream()
        .map(ServicePlanGroupDto::procedureStepId)
        .anyMatch(stepId -> initialProcedureStep.getId().equals(stepId))) {
      return;
    }
    // This only happens when initial step has no services
    Instant appointment =
        getAppointmentStartDate(
            initialProcedureStep.getAppointment(),
            initialProcedureStep.getUserDefinedAppointment());
    LocalDate earliestDate = initialProcedureStep.getEarliestDate();
    AppointmentTypeDto appointmentType = getAppointmentType(initialProcedureStep);
    AppointmentBookingTypeDto appointmentBookingType =
        appointmentBookingTypeMapper.mapToInterfaceType(
            initialProcedureStep.getAppointment(),
            initialProcedureStep.getUserDefinedAppointment());
    boolean completelyAnswered = initialProcedureStep.getMedicalHistory().isCompletelyAnswered();
    boolean citizenHasAnswered = initialProcedureStep.getMedicalHistory().isCitizenHasAnswered();
    groupDtos.add(
        new ServicePlanGroupDto(
            Collections.emptyList(),
            initialProcedureStep.getId(),
            appointment,
            appointmentType,
            appointmentBookingType,
            earliestDate,
            BigDecimal.ZERO,
            completelyAnswered,
            citizenHasAnswered));
  }

  public static <T, A> Collector<T, ?, Map<A, List<T>>> groupingByWithNullKeys(
      Function<? super T, ? extends A> classifier) {
    return Collectors.toMap(
        classifier,
        Collections::singletonList,
        (List<T> oldList, List<T> newEl) -> {
          List<T> newList = new ArrayList<>(oldList.size() + 1);
          newList.addAll(oldList);
          newList.addAll(newEl);
          return newList;
        });
  }

  private List<ServicePlanEntryDto> mapServicePlanEntriesToInterfaceType(
      List<ServicePlanEntry> entries) {
    return entries.stream()
        .map(this::mapServicePlanEntryToInterfaceType)
        .sorted(
            Comparator.comparing(ServicePlanEntryDto::serviceTypeDescription)
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

  private ServicePlanEntryDto mapServicePlanEntryToInterfaceType(
      ServicePlanEntry servicePlanEntry) {
    VcService service = servicePlanEntry.service();
    String serviceDescription;
    String diseaseName = null;
    String vaccineName = null;
    Integer vaccinationNumber = null;
    String batchIdentifier = null;
    String defaultBatchIdentifier = null;
    Integer latency = null;
    ServiceStatusDto status =
        MappingUtil.mapEnum(ServiceStatusDto.class, service.getServiceStatus());
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
      defaultBatchIdentifier =
          (travelMedicineFeatureToggle.isNewFeatureEnabled(DEFAULT_BATCH_ID)
              ? vac.getDefaultBatchIdentifier()
              : null);
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
        defaultBatchIdentifier,
        service.getAppliedAt(),
        service.getPhysician(),
        service.getMfa(),
        status,
        service.getFee());
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
        .sorted(
            Comparator.comparing(
                    AppointmentSummaryDto::start, Comparator.nullsFirst(Comparator.naturalOrder()))
                .thenComparing(
                    AppointmentSummaryDto::earliestDate,
                    Comparator.nullsFirst(Comparator.naturalOrder())))
        .toList();
  }

  public AppointmentSummaryDto mapToAppointmentSummaryInterfaceType(ProcedureStep ps) {
    UserDefinedAppointment uda = ps.getUserDefinedAppointment();
    Appointment appointment = ps.getAppointment();
    AppointmentBookingTypeDto bookingType =
        appointmentBookingTypeMapper.mapToInterfaceType(appointment, uda);
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
}
