/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.travelmedicine.medicalhistory.persistence.entity.MedicalHistory;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity.MedicalHistoryTemplate;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity.MedicalHistoryTemplateRepository;
import de.eshg.travelmedicine.util.MappingUtil;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentBookingTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetProcedureStepServicesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchAppointmentRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostProcedureStepRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.ProcedureStepServiceDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.OtherService;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStepRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ServiceRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.UserDefinedAppointment;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Vaccination;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VcService;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ProcedureStepService {
  private final ProcedureStepRepository procedureStepRepository;
  private final MedicalHistoryTemplateRepository medicalHistoryTemplateRepository;
  private final ServiceRepository serviceRepository;
  private final AppointmentService appointmentService;

  private final ProcedureAccessor procedureAccessor;
  private final AppointmentBookingTypeMapper appointmentBookingTypeMapper;

  public ProcedureStepService(
      ProcedureStepRepository procedureStepRepository,
      MedicalHistoryTemplateRepository medicalHistoryTemplateRepository,
      ServiceRepository serviceRepository,
      AppointmentService appointmentService,
      ProcedureAccessor procedureAccessor,
      AppointmentBookingTypeMapper appointmentBookingTypeMapper) {
    this.procedureStepRepository = procedureStepRepository;
    this.medicalHistoryTemplateRepository = medicalHistoryTemplateRepository;
    this.serviceRepository = serviceRepository;
    this.appointmentService = appointmentService;
    this.procedureAccessor = procedureAccessor;
    this.appointmentBookingTypeMapper = appointmentBookingTypeMapper;
  }

  public MedicalHistory createMedicalHistory(boolean followUp) {
    Optional<MedicalHistoryTemplate> template =
        followUp
            ? medicalHistoryTemplateRepository.findByFollowUpFlagIsTrue()
            : medicalHistoryTemplateRepository.findByMainFlagIsTrue();
    MedicalHistory medicalHistory = new MedicalHistory();
    medicalHistory.setContent(template.map(MedicalHistoryTemplate::getContent).orElse("{}"));
    return medicalHistory;
  }

  public static Instant getAppointment(ProcedureStep ps) {
    if (ps.getUserDefinedAppointment() != null) {
      return ps.getUserDefinedAppointment().getAppointmentStart();
    } else if (ps.getAppointment() != null) {
      return ps.getAppointment().getAppointmentStart();
    } else return ps.getEarliestDate().atStartOfDay().toInstant(ZoneOffset.UTC);
  }

  // --- end of util methods

  public UUID createProcedureStep(UUID externalId, PostProcedureStepRequest procedureStepRequest) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(externalId, ProcedureAccessor.checkNotClosed);

    validateAppointmentData(
        procedureStepRequest.appointmentBookingType(),
        procedureStepRequest.appointmentStart(),
        procedureStepRequest.durationInMinutes(),
        procedureStepRequest.earliestDate());

    List<UUID> serviceIds = procedureStepRequest.services();
    List<VcService> foundServices = serviceRepository.findAllById(serviceIds);
    if (foundServices.size() < serviceIds.size())
      throw new BadRequestException("At least one of the service IDs is unknown.");
    for (VcService vcService : foundServices) {
      if (!vcService.getVaccinationConsultation().getExternalId().equals(externalId))
        throw new BadRequestException(
            "The service doesn't belong to the vaccination consultation: "
                + vcService.getExternalId());
      if (vcService.getProcedureStep() != null)
        throw new BadRequestException(
            "The service is already assigned to a different procedure step: "
                + vcService.getExternalId());
    }

    ProcedureStep procedureStep =
        ProcedureStep.createFollowupProcedureStep(procedureStepRequest.earliestDate());

    procedureStep.setVaccinationConsultation(vaccinationConsultation);
    procedureStep.setMedicalHistory(createMedicalHistory(true)); // always follow-ups here
    procedureStepRepository.save(procedureStep);

    if (procedureStepRequest.appointmentBookingType()
        == AppointmentBookingTypeDto.APPOINTMENT_BLOCK) {
      appointmentService.createBlockAppointmentForStep(
          procedureStep,
          procedureStepRequest.appointmentStart(),
          procedureStepRequest.durationInMinutes());

    } else if (procedureStepRequest.appointmentBookingType()
        == AppointmentBookingTypeDto.USER_DEFINED) {
      appointmentService.createUserDefinedAppointment(
          procedureStep,
          procedureStepRequest.appointmentStart(),
          procedureStepRequest.durationInMinutes());
    }

    for (VcService vcService : foundServices) {
      vcService.setProcedureStep(procedureStep);
    }

    vaccinationConsultation.getProcedureSteps().add(procedureStep);
    return procedureStep.getExternalId();
  }

  public GetProcedureStepServicesResponse getProcedureStepServices(UUID procedureStepId) {
    procedureAccessor.accessProcedureStep(procedureStepId, null, ProcedureAccessor.noChecks);

    List<VcService> services = serviceRepository.findAllByProcedureStepIdOrderById(procedureStepId);
    List<ProcedureStepServiceDto> serviceDtos =
        services.stream()
            .map(this::createProcedureStepServiceDto)
            .sorted(
                Comparator.comparing(ProcedureStepServiceDto::serviceDescription)
                    .thenComparing(
                        ProcedureStepServiceDto::vaccinationNumber,
                        Comparator.nullsFirst(Comparator.naturalOrder())))
            .toList();
    return new GetProcedureStepServicesResponse(serviceDtos);
  }

  private ProcedureStepServiceDto createProcedureStepServiceDto(VcService service) {
    if (service instanceof OtherService os) {
      return new ProcedureStepServiceDto(os.getId(), os.getDescription(), null);
    }
    if (service instanceof Vaccination v) {
      return new ProcedureStepServiceDto(v.getId(), v.getDiseaseName(), v.getVaccinationNumber());
    }
    throw new IllegalArgumentException("Unknown ServiceType");
  }

  public void validateAppointmentData(
      AppointmentBookingTypeDto bookingType,
      Instant appointmentStart,
      Integer durationInMinutes,
      LocalDate earliestDate) {
    if (bookingType == AppointmentBookingTypeDto.USER_DEFINED
        && (appointmentStart == null || durationInMinutes == null)) {
      throw new BadRequestException("A user defined appointment needs a start and a duration");
    }
    if (bookingType == AppointmentBookingTypeDto.APPOINTMENT_BLOCK
        && (appointmentStart == null || durationInMinutes == null)) {
      throw new BadRequestException("An appointment needs a start and a duration");
    }
    if (bookingType == AppointmentBookingTypeDto.SELF_BOOKING && earliestDate == null) {
      throw new BadRequestException("A self bookable appointment needs an earliest date");
    }
  }

  public void updateAppointment(UUID procedureStepId, PatchAppointmentRequest appointmentRequest) {
    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            procedureStepId, null, ProcedureAccessor.checkNotClosed);

    validatePatchAppointmentRequest(appointmentRequest);

    if (appointmentRequest.earliestDate() != null) {
      procedureStep.setEarliestDate(appointmentRequest.earliestDate());
    }

    if (!checkForAppointmentChanges(procedureStep, appointmentRequest)) {
      return;
    }

    procedureStep.setAppointmentType(
        MappingUtil.mapEnum(AppointmentType.class, appointmentRequest.appointmentType()));

    procedureStep.setAppointment(null);
    procedureStep.setUserDefinedAppointment(null);
    if (appointmentRequest.appointmentBookingType()
        == AppointmentBookingTypeDto.APPOINTMENT_BLOCK) {
      appointmentService.createBlockAppointmentForStep(
          procedureStep,
          appointmentRequest.appointmentStart(),
          appointmentRequest.durationInMinutes());
    }
    if (appointmentRequest.appointmentBookingType() == AppointmentBookingTypeDto.USER_DEFINED) {
      appointmentService.createUserDefinedAppointment(
          procedureStep,
          appointmentRequest.appointmentStart(),
          appointmentRequest.durationInMinutes());
    }
  }

  private boolean checkForAppointmentChanges(
      ProcedureStep ps, PatchAppointmentRequest appointmentRequest) {
    AppointmentType oldAppointmentType = ps.getAppointmentType();
    if (oldAppointmentType
        != MappingUtil.mapEnum(AppointmentType.class, appointmentRequest.appointmentType())) {
      return true;
    }

    AppointmentBookingTypeDto currentBookingType = determineBookingType(ps);

    if (currentBookingType == AppointmentBookingTypeDto.APPOINTMENT_BLOCK
        && (appointmentRequest.appointmentBookingType()
                != AppointmentBookingTypeDto.APPOINTMENT_BLOCK
            || !ps.getAppointment()
                .getAppointmentStart()
                .equals(appointmentRequest.appointmentStart()))) {
      return true;
    }
    if (currentBookingType == AppointmentBookingTypeDto.USER_DEFINED
        && (appointmentRequest.appointmentBookingType() != AppointmentBookingTypeDto.USER_DEFINED
            || !ps.getUserDefinedAppointment()
                .getAppointmentStart()
                .equals(appointmentRequest.appointmentStart()))) {
      return true;
    }
    return currentBookingType == AppointmentBookingTypeDto.CANCELLED;
  }

  private void validatePatchAppointmentRequest(PatchAppointmentRequest appointmentRequest) {
    if (appointmentRequest.appointmentBookingType() == AppointmentBookingTypeDto.SELF_BOOKING
        && appointmentRequest.earliestDate() == null) {
      throw new BadRequestException("earliestDate must be set for booking type SELF_BOOKING.");
    } else {
      if (appointmentRequest.appointmentStart() == null
          || appointmentRequest.durationInMinutes() == null) {
        throw new BadRequestException(
            "appointmentStart and duration must be set to book a appointment.");
      }
    }
  }

  private AppointmentBookingTypeDto determineBookingType(ProcedureStep procedureStep) {
    Appointment appointment = procedureStep.getAppointment();
    UserDefinedAppointment userDefinedAppointment = procedureStep.getUserDefinedAppointment();
    return appointmentBookingTypeMapper.mapToInterfaceType(appointment, userDefinedAppointment);
  }
}
