/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import static de.eshg.travelmedicine.util.MappingUtil.mapEnum;
import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.PERSON_SYNCHRONIZED;
import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.PERSON_UPDATED;

import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.lib.appointmentblock.AppointmentTypeMapper;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.travelmedicine.citizenpublic.api.PostCitizenVaccinationConsultationRequest;
import de.eshg.travelmedicine.notification.NotificationService;
import de.eshg.travelmedicine.util.MappingUtil;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppliedServiceDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentBookingTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentOverviewEntryDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentSummaryDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.AssignableServiceDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetAppointmentDetailsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetAppointmentOverviewResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetAssignableServicesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetAvailableAppointmentsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetCitizenAppointmentOverviewResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetStepsWithAppliedServicesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetVaccinationConsultationDetailsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.InformationStatementSummaryDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchAcceptDraftRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchOtherServiceRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationConsultationPatientRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationConsultationTravelDetailsRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostOtherServiceRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostVaccinationConsultationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostVaccinationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.SearchVaccinationConsultationResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.StepWithAppliedServicesDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.SyncPersonRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelInformationDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.VaccinationConsultationSearchDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.AppointmentOverviewEntry;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.CreatedByUserType;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.OtherService;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Person;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStepRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ServicePlanEntry;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ServiceRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Vaccination;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultationRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultationSearch;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VcService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class VaccinationConsultationService {
  private static final Logger log = LoggerFactory.getLogger(VaccinationConsultationService.class);
  private final VaccinationConsultationRepository vaccinationConsultationRepository;
  private final ProcedureStepRepository procedureStepRepository;
  private final ProcedureStepService procedureStepService;

  private final VcServiceService vcServiceService;
  private final ServiceRepository serviceRepository;
  private final AppointmentService appointmentService;
  private final VaccinationConsultationMapper vaccinationConsultationMapper;
  private final VaccinationConsultationDetailsMapper vaccinationConsultationDetailsMapper;
  private final AppointmentOverviewMapper appointmentOverviewMapper;
  private final PersonClient personClient;
  private final CitizenAccessCodeUserClient citizenAccessCodeUserClient;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final Clock clock;
  private final AuditLogger auditLogger;

  private static final String UNEXPECTED_TRAVEL_DATA =
      "No further travel data allowed if travel type is NO_TRAVEL.";
  private static final String INVALID_TRAVEL_DATA_NULL =
      "The list of travel destinations must not contain null elements.";
  private static final String UPDATE_OUTDATED_PERSON =
      "The patient update failed. Is the person data up-to-date?";
  private static final String INVALID_TRAVEL_TIME_AMOUNT =
      "The travel time amount must be between 1 and 1000 inclusive.";
  private final ProcedureAccessor procedureAccessor;
  private final NotificationService notificationService;

  private final ProgressEntryService progressEntryService;

  public VaccinationConsultationService(
      VaccinationConsultationRepository vaccinationConsultationRepository,
      ProcedureStepRepository procedureStepRepository,
      ProcedureStepService procedureStepService,
      VcServiceService vcServiceService,
      ServiceRepository serviceRepository,
      AppointmentService appointmentService,
      VaccinationConsultationMapper vaccinationConsultationMapper,
      VaccinationConsultationDetailsMapper vaccinationConsultationDetailsMapper,
      AppointmentOverviewMapper appointmentOverviewMapper,
      PersonClient personClient,
      CitizenAccessCodeUserClient citizenAccessCodeUserClient,
      ModuleClientAuthenticator moduleClientAuthenticator,
      Clock clock,
      AuditLogger auditLogger,
      ProcedureAccessor procedureAccessor,
      NotificationService notificationService,
      ProgressEntryService progressEntryService) {
    this.vaccinationConsultationRepository = vaccinationConsultationRepository;
    this.procedureStepRepository = procedureStepRepository;
    this.procedureStepService = procedureStepService;
    this.vcServiceService = vcServiceService;
    this.serviceRepository = serviceRepository;
    this.appointmentService = appointmentService;
    this.vaccinationConsultationMapper = vaccinationConsultationMapper;
    this.vaccinationConsultationDetailsMapper = vaccinationConsultationDetailsMapper;
    this.appointmentOverviewMapper = appointmentOverviewMapper;
    this.personClient = personClient;
    this.citizenAccessCodeUserClient = citizenAccessCodeUserClient;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.procedureAccessor = procedureAccessor;
    this.notificationService = notificationService;
    this.progressEntryService = progressEntryService;
  }

  public PatientDto patientOf(VaccinationConsultation vaccinationConsultation) {
    UUID patientId = vaccinationConsultation.getPatientIdsFromCentralFile().getFirst();
    return personClient.getPatientFromCentralFile(patientId);
  }

  public UUID createProcedure(PostVaccinationConsultationRequest request) {
    validatePostVaccinationConsultationRequest(request);

    UUID patientIdFromCentralFile = personClient.createPersonInCentralFile(request.patient());

    VaccinationConsultation vaccinationConsultation =
        vaccinationConsultationMapper.toDomainType(
            extractTravelInformation(request),
            patientIdFromCentralFile,
            CurrentUserHelper.getCurrentUserId(),
            CreatedByUserType.EMPLOYEE);

    ProcedureStep initialProcedureStep =
        ProcedureStep.createInitialProcedureStep(
            AppointmentTypeMapper.toDomainType(request.initialStepAppointmentType()));
    initialProcedureStep.setVaccinationConsultation(vaccinationConsultation);
    initialProcedureStep.setMedicalHistory(procedureStepService.createMedicalHistory(false));
    bookAppointment(initialProcedureStep, request);

    vaccinationConsultation.getProcedureSteps().add(initialProcedureStep);
    vaccinationConsultationRepository.save(vaccinationConsultation);
    procedureStepRepository.save(initialProcedureStep);

    progressEntryService.createProgressEntryForNewAppointment(
        vaccinationConsultation, request.initialStepAppointmentType(), request.appointmentStart());
    return vaccinationConsultation.getExternalId();
  }

  public UUID createCitizenProcedure(PostCitizenVaccinationConsultationRequest request) {
    validateTravelInformation(request.travelInformation());

    Appointment appointment =
        appointmentService.createBlockAppointment(
            MappingUtil.mapEnum(AppointmentType.class, request.initialStepAppointmentType()),
            request.appointmentStart(),
            request.durationInMinutes());

    UUID personFileStateId = personClient.createPersonFromExternalSource(request.patient());

    VaccinationConsultation vaccinationConsultation =
        vaccinationConsultationMapper.toDomainType(
            request.travelInformation(), personFileStateId, null, CreatedByUserType.CITIZEN_PORTAL);

    CitizenAccessCodeUserDto citizenAccessCodeUser =
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () -> citizenAccessCodeUserClient.addCitizenAccessCodeUser(personFileStateId));
    vaccinationConsultation.setCitizenUserId(citizenAccessCodeUser.userId());

    ProcedureStep initialProcedureStep =
        ProcedureStep.createInitialProcedureStep(
            AppointmentTypeMapper.toDomainType(request.initialStepAppointmentType()));
    initialProcedureStep.setVaccinationConsultation(vaccinationConsultation);
    initialProcedureStep.setMedicalHistory(procedureStepService.createMedicalHistory(false));
    initialProcedureStep.setAppointment(appointment);

    vaccinationConsultation.getProcedureSteps().add(initialProcedureStep);
    vaccinationConsultationRepository.save(vaccinationConsultation);
    procedureStepRepository.save(initialProcedureStep);

    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL) {
      notificationService.notifyNewCitizenProcedure(
          request.patient(),
          initialProcedureStep.getAppointment().getAppointmentStart(),
          citizenAccessCodeUser.accessCode());
    }
    progressEntryService.createProgressEntryForNewAppointment(
        vaccinationConsultation, request.initialStepAppointmentType(), request.appointmentStart());
    return vaccinationConsultation.getExternalId();
  }

  public GetAppointmentOverviewResponse getAllProcedureAppointmentSummaries(LocalDate date) {
    Instant startOfDay = date.atStartOfDay(clock.getZone()).toInstant();
    Instant endOfDay = date.atTime(LocalTime.MAX).atZone(clock.getZone()).toInstant();
    List<AppointmentOverviewEntry> appointmentOverview =
        vaccinationConsultationRepository.findAppointmentOverview(startOfDay, endOfDay, date);
    List<UUID> cfsIds =
        appointmentOverview.stream()
            .map(AppointmentOverviewEntry::centralFileStateId)
            .distinct()
            .toList();
    Map<UUID, PatientDto> personsFromCentralFile = personClient.getPersonsFromCentralFile(cfsIds);
    List<AppointmentOverviewEntryDto> appointmentOverviewEntries =
        appointmentOverviewMapper.toInterfaceType(appointmentOverview, personsFromCentralFile);
    return new GetAppointmentOverviewResponse(appointmentOverviewEntries);
  }

  private void bookAppointment(
      ProcedureStep initialProcedureStep, PostVaccinationConsultationRequest request) {
    if (request.appointmentBookingType() == AppointmentBookingTypeDto.APPOINTMENT_BLOCK) {
      appointmentService.createBlockAppointmentForStep(
          initialProcedureStep, request.appointmentStart(), request.durationInMinutes());
    } else if (request.appointmentBookingType() == AppointmentBookingTypeDto.USER_DEFINED) {
      appointmentService.createUserDefinedAppointment(
          initialProcedureStep, request.appointmentStart(), request.durationInMinutes());
    } else {
      throw new BadRequestException(
          "AppointmentBookingType must be APPOINTMENT_BLOCK or USER_DEFINED.");
    }
  }

  private void validatePostVaccinationConsultationRequest(
      PostVaccinationConsultationRequest request) {
    validateTravelInformation(extractTravelInformation(request));
    procedureStepService.validateAppointmentData(
        request.appointmentBookingType(),
        request.appointmentStart(),
        request.durationInMinutes(),
        null);
  }

  private TravelInformationDto extractTravelInformation(
      PostVaccinationConsultationRequest request) {
    return new TravelInformationDto(
        request.travelType(),
        request.travelDestinations(),
        request.travelStartDate(),
        request.travelTimeAmount(),
        request.travelTimeUnit());
  }

  private TravelInformationDto extractTravelInformation(
      PatchVaccinationConsultationTravelDetailsRequest request) {
    return new TravelInformationDto(
        request.travelType(),
        request.travelDestinations(),
        request.travelStartDate(),
        request.travelTimeAmount(),
        request.travelTimeUnit());
  }

  private void validateTravelInformation(TravelInformationDto travelInformation) {
    if ((travelInformation.travelType() == TravelTypeDto.NO_TRAVEL)
        && (!travelInformation.travelDestinations().isEmpty()
            || travelInformation.travelStartDate() != null
            || travelInformation.travelTimeAmount() != null
            || travelInformation.travelTimeUnit() != null)) {
      throw new BadRequestException(UNEXPECTED_TRAVEL_DATA);
    }

    if (travelInformation.travelDestinations().contains(null))
      throw new BadRequestException(INVALID_TRAVEL_DATA_NULL);

    if (travelInformation.travelTimeAmount() != null
        && (travelInformation.travelTimeAmount() < 1
            || travelInformation.travelTimeAmount() > 1000)) {
      throw new BadRequestException(INVALID_TRAVEL_TIME_AMOUNT);
    }
  }

  public void syncPersonData(UUID procedureId, SyncPersonRequest request) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.checkNotClosed);

    Person person = vaccinationConsultation.getRelatedPersons().getFirst();
    UUID previousPersonFileStateId = person.getCentralFileStateId();
    UUID updatedFileStateId =
        personClient.syncPerson(previousPersonFileStateId, request.referenceVersion());
    person.setCentralFileStateId(updatedFileStateId);

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            PERSON_SYNCHRONIZED.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    progressEntry.setPreviousPersonFileStateId(previousPersonFileStateId);
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void updatePatient(UUID externalId, PatchVaccinationConsultationPatientRequest request) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(externalId, ProcedureAccessor.checkNotClosed);
    if (vaccinationConsultation.getProcedureStatus() == ProcedureStatus.DRAFT) {
      throw new BadRequestException("Can't update person in draft status.");
    }

    Person person = vaccinationConsultation.getRelatedPersons().getFirst();
    UUID previousPersonFileStateId = person.getCentralFileStateId();

    try {
      UUID patientIdFromCentralFile =
          personClient.updatePersonInCentralFile(previousPersonFileStateId, request.patient());
      vaccinationConsultationMapper.toDomainTypePatchPerson(
          patientIdFromCentralFile, vaccinationConsultation);
    } catch (Exception e) {
      throw new BadRequestException(UPDATE_OUTDATED_PERSON);
    }

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            PERSON_UPDATED.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(vaccinationConsultation.getId());
    progressEntry.setPreviousPersonFileStateId(previousPersonFileStateId);
    vaccinationConsultation.addProgressEntry(progressEntry);
  }

  public void updateTravelDetails(
      UUID externalId, PatchVaccinationConsultationTravelDetailsRequest patchRequest) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(externalId, ProcedureAccessor.checkNotClosed);

    validateTravelInformation(extractTravelInformation(patchRequest));

    vaccinationConsultationMapper.toDomainTypePatchTravel(patchRequest, vaccinationConsultation);
  }

  public GetVaccinationConsultationDetailsResponse getVaccinationConsultationDetails(
      UUID externalId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(externalId, ProcedureAccessor.noChecks);

    UUID patientId = vaccinationConsultation.getPatientIdsFromCentralFile().getFirst();
    PersonClient.PatientSync patientFromCentralFile =
        personClient.getPersonFromCentralFile(patientId);

    List<ServicePlanEntry> servicePlan =
        vaccinationConsultationRepository.findServicePlanById(externalId);
    ProcedureStep initialProcedureStep =
        procedureStepRepository
            .findInitialProcedureStep(externalId)
            .orElseThrow(() -> new IllegalStateException("No initial procedure step available"));

    return vaccinationConsultationDetailsMapper.toInterfaceType(
        vaccinationConsultation,
        patientFromCentralFile.patient(),
        patientFromCentralFile.personSync(),
        initialProcedureStep,
        servicePlan);
  }

  public GetAvailableAppointmentsResponse getAllAvailableAppointments(UUID procedureId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.noChecks);

    List<AppointmentSummaryDto> appointmentSummaryDtos =
        vaccinationConsultationDetailsMapper.mapToAppointmentSummaries(
            vaccinationConsultation.getProcedureSteps());

    return new GetAvailableAppointmentsResponse(appointmentSummaryDtos);
  }

  public void assignProcedureStepToService(UUID procedureId, UUID procedureStepId, UUID serviceId) {
    VcService service = retrieveService(serviceId);
    assignProcedureStepToServices(procedureId, procedureStepId, List.of(service));
  }

  public void assignProcedureStepToServices(
      UUID procedureId, UUID procedureStepId, List<VcService> services) {
    // access the procedure via the step, not via the service which isn't yet assigned to it
    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            procedureStepId, procedureId, ProcedureAccessor.checkNotClosed);

    for (VcService service : services) {
      if (service.getProcedureStep() != null) {
        throw new BadRequestException("Service has already a procedure step. Unassign first.");
      }
      service.setProcedureStep(procedureStep);
    }
  }

  public void unassignProcedureStepFromService(UUID procedureId, UUID serviceId) {
    VcService service =
        procedureAccessor.accessService(serviceId, procedureId, ProcedureAccessor.checkNotClosed);

    if (service.isAccomplished()) {
      throw new BadRequestException(
          "Service is already applied and cannot be unassigned from procedure step.");
    }
    ProcedureStep procedureStep = service.getProcedureStep();
    if (procedureStep != null) {
      service.setProcedureStep(null);
      procedureStep.getServices().remove(service);
      if (procedureStep.getServices().isEmpty() && procedureStep.getIsFollowUp()) {
        procedureStepRepository.delete(procedureStep);
      }
    }
  }

  public List<UUID> createServices(
      UUID procedureId,
      UUID procedureStepId,
      List<PostVaccinationRequest> postVaccinationRequests,
      List<PostOtherServiceRequest> postOtherServiceRequests) {
    VaccinationConsultation procedure =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.checkNotClosed);

    List<Vaccination> collectSeriesFollowUps = new ArrayList<>();

    List<Vaccination> vaccinations =
        vcServiceService.createVaccinations(
            procedure, postVaccinationRequests, collectSeriesFollowUps);
    List<OtherService> otherServices =
        vcServiceService.createOtherServices(procedure, postOtherServiceRequests);

    if (procedureStepId != null) {
      // assign services (except series-based follow-up vaccinations) to the step's appointment
      List<VcService> servicesToAssign =
          Stream.concat(
                  vaccinations.stream().filter(v -> !collectSeriesFollowUps.contains(v)),
                  otherServices.stream())
              .toList();
      assignProcedureStepToServices(procedureId, procedureStepId, servicesToAssign);
    }

    return Stream.concat(vaccinations.stream(), otherServices.stream())
        .map(VcService::getId)
        .toList();
  }

  public void deleteService(UUID procedureId, UUID serviceId) {
    VcService service =
        procedureAccessor.accessService(serviceId, procedureId, ProcedureAccessor.checkNotClosed);
    vcServiceService.deleteService(service);
  }

  public void updateOtherService(
      UUID procedureId, UUID serviceId, PatchOtherServiceRequest patchOtherServiceRequest) {

    OtherService otherService =
        procedureAccessor.accessOtherService(
            serviceId, procedureId, ProcedureAccessor.checkNotClosed);

    vcServiceService.updateOtherService(otherService, patchOtherServiceRequest);
  }

  public void updateVaccination(
      UUID procedureId, UUID serviceId, PatchVaccinationRequest patchVaccinationRequest) {

    Vaccination vaccination =
        procedureAccessor.accessVaccination(
            serviceId, procedureId, ProcedureAccessor.checkNotClosed);

    vcServiceService.updateVaccination(vaccination, patchVaccinationRequest);
  }

  public GetAssignableServicesResponse getAllAssignableServices(UUID procedureId) {
    List<VcService> services =
        serviceRepository.findAllByVaccinationConsultationExternalIdOrderById(procedureId);
    List<AssignableServiceDto> assignableAppointments = new ArrayList<>();

    services.stream()
        .filter(VcService::isOpen)
        .filter(OtherService.class::isInstance)
        .map(OtherService.class::cast)
        .forEach(
            os ->
                assignableAppointments.add(
                    new AssignableServiceDto(os.getId(), os.getDescription(), null, null, null)));

    List<Vaccination> allVaccinations =
        services.stream()
            .filter(Vaccination.class::isInstance)
            .map(Vaccination.class::cast)
            .toList();

    List<Vaccination> unplannedVaccinations =
        allVaccinations.stream().filter(VcService::isOpen).toList();

    Set<String> diseases =
        unplannedVaccinations.stream().map(Vaccination::getDiseaseName).collect(Collectors.toSet());
    for (String disease : diseases) {
      Vaccination vac =
          unplannedVaccinations.stream()
              .filter(v -> v.getDiseaseName().equals(disease))
              .min(Comparator.comparing(Vaccination::getVaccinationNumber))
              .orElseThrow();
      LocalDate appointmentSuggestion = calculateAppointmentSuggestion(allVaccinations, vac);
      assignableAppointments.add(
          new AssignableServiceDto(
              vac.getId(),
              vac.getDiseaseName(),
              vac.getVaccinationNumber(),
              vac.getLatency(),
              appointmentSuggestion));
    }

    return new GetAssignableServicesResponse(
        assignableAppointments.stream()
            .sorted(
                Comparator.comparing(AssignableServiceDto::serviceDescription)
                    .thenComparing(
                        AssignableServiceDto::vaccinationNumber,
                        Comparator.nullsFirst(Comparator.naturalOrder())))
            .toList());
  }

  private LocalDate calculateAppointmentSuggestion(
      List<Vaccination> allVaccinations, Vaccination vac) {
    int vaccinationNumber = vac.getVaccinationNumber();
    if (vaccinationNumber < 2 || vac.getLatency() == null) {
      return null;
    }
    Optional<Vaccination> firstVac =
        allVaccinations.stream()
            .filter(
                v ->
                    (v.getDiseaseName().equals(vac.getDiseaseName())
                        && v.getVaccinationNumber() == 1))
            .findFirst();
    if (firstVac.isPresent()) {
      Instant dateTime =
          vaccinationConsultationDetailsMapper
              .mapToAppointmentSummaryInterfaceType(firstVac.orElseThrow().getProcedureStep())
              .start();

      return dateTime == null
          ? null
          : dateTime.atZone(clock.getZone()).toLocalDate().plusWeeks(vac.getLatency().longValue());
    }
    return null;
  }

  private static String assembleServiceDescription(VcService service) {
    return switch (service) {
      case Vaccination vaccination ->
          vaccination.getDiseaseName() + " - Nr. " + vaccination.getVaccinationNumber();
      case OtherService otherService -> otherService.getDescription();
      default -> throw new IllegalArgumentException("Unsupported instance of VcService");
    };
  }

  private static AppliedServiceDto buildAppliedServiceDto(VcService service) {
    return new AppliedServiceDto(service.getId(), assembleServiceDescription(service));
  }

  public GetStepsWithAppliedServicesResponse getStepsWithAppliedServices(UUID procedureId) {
    procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.noChecks);

    @NotNull
    @Valid
    List<StepWithAppliedServicesDto> stepsWithAppliedServices =
        this.serviceRepository
            .findAllByVaccinationConsultationExternalIdOrderById(procedureId)
            .stream()
            .filter(VcService::isAccomplished)
            .collect(Collectors.groupingBy(VcService::getProcedureStep))
            .entrySet()
            .stream()
            .map(
                servicesOfStep -> {
                  ProcedureStep procedureStep = servicesOfStep.getKey();
                  List<VcService> services = servicesOfStep.getValue();

                  List<AppliedServiceDto> appliedServices =
                      services.stream()
                          .map(VaccinationConsultationService::buildAppliedServiceDto)
                          .sorted(Comparator.comparing(AppliedServiceDto::serviceDescription))
                          .toList();

                  return new StepWithAppliedServicesDto(
                      procedureStep.getId(),
                      ProcedureStepService.getStartDateOrEarliestDateFromAppointment(procedureStep),
                      appliedServices);
                })
            .sorted(Comparator.comparing(StepWithAppliedServicesDto::appointmentDateTime))
            .toList();

    return new GetStepsWithAppliedServicesResponse(procedureId, stepsWithAppliedServices);
  }

  public ProcedureStatusDto getProcedureStatus(UUID procedureId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.noChecks);
    return mapEnum(ProcedureStatusDto.class, vaccinationConsultation.getProcedureStatus());
  }

  public void updateProcedureStatus(UUID procedureId, @Valid ProcedureStatusDto request) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.noChecks);

    if (request != ProcedureStatusDto.CLOSED && request != ProcedureStatusDto.OPEN)
      throw new BadRequestException("Unsupported new state " + request);

    ProcedureStatus procedureStatus = mapEnum(ProcedureStatus.class, request);

    if (procedureStatus == ProcedureStatus.CLOSED) {
      if (vaccinationConsultation.getProcedureStatus() == ProcedureStatus.CLOSED)
        throw new BadRequestException(
            "Can't re-close a closed procedure " + vaccinationConsultation.getId());

      boolean hasPlannedServices = procedureHasPlannedServices(procedureId);
      if (hasPlannedServices)
        throw new BadRequestException(
            "Can't close a procedure with planned services: " + vaccinationConsultation.getId());
    } else if (procedureStatus == ProcedureStatus.OPEN) {
      if (vaccinationConsultation.getProcedureStatus() != ProcedureStatus.CLOSED)
        throw new BadRequestException(
            "Can't reopen an open procedure " + vaccinationConsultation.getId());
    }
    vaccinationConsultation.updateProcedureStatus(procedureStatus, clock, auditLogger);
  }

  public SearchVaccinationConsultationResponse searchVaccinationConsultation(
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      ProcedureStatusDto procedureStatus) {
    validateSearchParams(firstName, lastName, dateOfBirth);
    List<ProcedureStatus> statusList =
        getStatusList(mapEnum(ProcedureStatus.class, procedureStatus));
    List<VaccinationConsultationSearchDto> filteredResultList = new ArrayList<>();
    List<VaccinationConsultationSearch> vaccinationConsultations;
    final int batchSize = 500;
    int page = 0;
    do {
      vaccinationConsultations =
          vaccinationConsultationRepository.findAllByProcedureStatusIn(
              statusList, PageRequest.of(page++, batchSize));
      List<UUID> cfsIds =
          vaccinationConsultations.stream().map(VaccinationConsultationSearch::fileState).toList();
      Map<UUID, PatientDto> personsFromCentralFile = personClient.getPersonsFromCentralFile(cfsIds);

      filteredResultList.addAll(
          SearchVaccinationConsultationFilterAndMapper.filterAndMapSearchResults(
              vaccinationConsultations, personsFromCentralFile, firstName, lastName, dateOfBirth));
    } while (filteredResultList.size() < 50 && vaccinationConsultations.size() == batchSize);

    return new SearchVaccinationConsultationResponse(filteredResultList);
  }

  private void validateSearchParams(String firstName, String lastName, LocalDate dateOfBirth) {
    if (dateOfBirth == null
        && StringUtils.length(firstName) < 2
        && StringUtils.length(lastName) < 2) {
      throw new BadRequestException(
          "At least one filter criteria must be set. DateOfBirth or firstName or lastName with min length 2.");
    }
  }

  private VcService retrieveService(UUID serviceId) {
    return serviceRepository
        .findById(serviceId)
        .orElseThrow(() -> new NotFoundException("Service not found"));
  }

  private boolean procedureHasPlannedServices(UUID procedureId) {
    return serviceRepository
        .findAllByVaccinationConsultationExternalIdOrderById(procedureId)
        .stream()
        .anyMatch(VcService::isPlanned);
  }

  private List<ProcedureStatus> getStatusList(ProcedureStatus procedureStatus) {
    if (ProcedureStatus.ABORTED == procedureStatus || ProcedureStatus.CLOSED == procedureStatus) {
      throw new BadRequestException(
          "Search is allowed for procedure status DRAFT, OPEN and  IN_PROGRESS");
    }
    return procedureStatus == null
        ? List.of(ProcedureStatus.IN_PROGRESS, ProcedureStatus.DRAFT, ProcedureStatus.OPEN)
        : List.of(procedureStatus);
  }

  public GetCitizenAppointmentOverviewResponse getProcedureStepAppointments(UUID citizenUserId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedureByCitizenUserId(
            citizenUserId, ProcedureAccessor.checkNotClosed);

    List<ProcedureStep> stepList = vaccinationConsultation.getProcedureSteps();

    List<AppointmentSummaryDto> openAppointments = new LinkedList<>();
    List<AppointmentSummaryDto> pastAppointments = new LinkedList<>();

    stepList.forEach(
        step -> {
          AppointmentSummaryDto summary =
              vaccinationConsultationDetailsMapper.mapToAppointmentSummaryInterfaceType(step);
          boolean hasAccomplishedService =
              step.getServices().stream().anyMatch(VcService::isAccomplished);

          if (hasAccomplishedService) {
            pastAppointments.add(summary);
          } else {
            openAppointments.add(summary);
          }
        });

    openAppointments.sort(
        Comparator.comparing(
                AppointmentSummaryDto::start, Comparator.nullsFirst(Comparator.naturalOrder()))
            .thenComparing(
                AppointmentSummaryDto::earliestDate,
                Comparator.nullsFirst(Comparator.naturalOrder())));
    pastAppointments.sort(
        Comparator.comparing(
                AppointmentSummaryDto::start, Comparator.nullsFirst(Comparator.naturalOrder()))
            .reversed());

    return new GetCitizenAppointmentOverviewResponse(
        vaccinationConsultation.getExternalId(), openAppointments, pastAppointments);
  }

  public GetAppointmentDetailsResponse getAppointmentDetails(
      UUID citizenUserId, UUID procedureId, UUID procedureStepId) {
    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            procedureStepId,
            procedureId,
            List.of(
                new ProcedureAccessor.CheckNotClosed(),
                new ProcedureAccessor.CheckCitizenUserId(citizenUserId)));

    UUID patientId =
        procedureStep.getVaccinationConsultation().getPatientIdsFromCentralFile().getFirst();
    PatientDto patient = personClient.getPersonFromCentralFile(patientId).patient();

    AppointmentSummaryDto summaryDto =
        vaccinationConsultationDetailsMapper.mapToAppointmentSummaryInterfaceType(procedureStep);

    List<InformationStatementSummaryDto> informationStatementSummaries =
        InformationStatementSummaryMapper.mapToInterfaceType(
            procedureStep.getVaccinationConsultation().getInformationStatements());

    return AppointmentDetailsMapper.mapToDetails(
        summaryDto, patient, procedureStep, informationStatementSummaries);
  }

  public void cancelAppointmentByCitizen(
      UUID citizenUserId, UUID procedureId, UUID procedureStepId) {
    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            procedureStepId,
            procedureId,
            List.of(
                new ProcedureAccessor.CheckNotClosed(),
                new ProcedureAccessor.CheckCitizenUserId(citizenUserId)));
    if (procedureStep.getServices().stream().anyMatch(VcService::isAccomplished)) {
      throw new BadRequestException(
          "Appointment has accomplished services and cannot be cancelled.");
    }
    Instant cancelledAppointment = ProcedureStepService.getStartDateFromAppointment(procedureStep);
    appointmentService.cancelAppointment(procedureStep);

    VaccinationConsultation vaccinationConsultation = procedureStep.getVaccinationConsultation();
    boolean sendMailSuccessfully = false;
    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL) {
      try {
        notificationService.notifyCancelledByCitizen(
            patientOf(vaccinationConsultation), cancelledAppointment);
        sendMailSuccessfully = true;
      } catch (Exception e) {
        log.warn("Cannot send eMail", e);
      }
    }

    progressEntryService.createProgressEntryForCancelAppointmentByCitizen(
        vaccinationConsultation,
        procedureStep.getAppointmentType(),
        cancelledAppointment,
        sendMailSuccessfully);
  }

  public void bookCitizenAppointmentByCitizen(
      UUID citizenUserId, UUID procedureId, UUID procedureStepId, AppointmentDto appointmentDto) {

    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            procedureStepId,
            procedureId,
            List.of(
                new ProcedureAccessor.CheckNotClosed(),
                new ProcedureAccessor.CheckCitizenUserId(citizenUserId)));
    if (procedureStep.getServices().stream().anyMatch(VcService::isAccomplished)) {
      throw new BadRequestException(
          "Appointment has accomplished services and cannot be rebooked.");
    }
    Instant newAppointmentStart = appointmentDto.start();
    if (procedureStep.getEarliestDate() != null) {
      if (procedureStep
          .getEarliestDate()
          .atStartOfDay(clock.getZone())
          .toInstant()
          .isAfter(newAppointmentStart)) {
        throw new BadRequestException(
            "Appointment has accomplished services and cannot be rebooked.");
      }
    }

    Instant previousAppointmentStart =
        ProcedureStepService.getStartDateFromAppointment(procedureStep);
    boolean rebook = false;
    if (procedureStep.getAppointment() != null
        || procedureStep.getUserDefinedAppointment() != null) {
      rebook = true;
      procedureStep.setAppointment(null);
      procedureStep.setUserDefinedAppointment(null);
    }

    int remainingBookings = procedureStep.getBookingsRemaining();
    if (remainingBookings > 0) {
      appointmentService.createBlockAppointmentForStep(
          procedureStep,
          newAppointmentStart,
          Math.toIntExact(ChronoUnit.MINUTES.between(newAppointmentStart, appointmentDto.end())));

    } else {
      throw new BadRequestException("No more bookings available. 2 rebookings max. allowed.");
    }

    if (rebook) {
      procedureStep.setBookingsRemaining(remainingBookings - 1);
    }

    VaccinationConsultation vaccinationConsultation = procedureStep.getVaccinationConsultation();
    boolean sendMailSuccessfully = false;
    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL) {
      try {
        if (rebook) {
          notificationService.notifyRebookedByCitizen(
              patientOf(vaccinationConsultation), previousAppointmentStart, newAppointmentStart);
        } else {
          notificationService.notifyBookedByCitizen(
              patientOf(vaccinationConsultation), newAppointmentStart);
        }
        sendMailSuccessfully = true;
      } catch (Exception e) {
        log.warn("Cannot send eMail", e);
      }
    }
    if (rebook) {
      progressEntryService.createProgressEntryForAppointmentRebookingByCitizen(
          vaccinationConsultation,
          procedureStep.getAppointmentType(),
          previousAppointmentStart,
          newAppointmentStart,
          sendMailSuccessfully);
    } else {
      progressEntryService.createProgressEntryForAppointmentBookingByCitizen(
          vaccinationConsultation,
          procedureStep.getAppointmentType(),
          newAppointmentStart,
          sendMailSuccessfully);
    }
  }

  public void abortDraftVaccinationConsultation(UUID procedureId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.checkIsDraft);
    UUID centralFileStateId =
        vaccinationConsultation.getRelatedPersons().getFirst().getCentralFileStateId();
    personClient.markExternalPersonForDeletion(centralFileStateId);
    if (vaccinationConsultation.getCitizenUserId() != null)
      try {
        citizenAccessCodeUserClient.deleteCitizenAccessCodeUser(
            vaccinationConsultation.getCitizenUserId());
      } catch (Exception e) {
        log.warn("Error while deleting citizen access code user.", e);
      }

    ProcedureStep initialProcedureStep =
        procedureStepRepository
            .findInitialProcedureStep(procedureId)
            .orElseThrow(() -> new IllegalStateException("No initial procedure step available"));

    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL
        && !(initialProcedureStep.getUserDefinedAppointment() != null
            && initialProcedureStep.getUserDefinedAppointment().isCancelled())) {
      PatientDto patientDto = personClient.getPatientFromCentralFile(centralFileStateId);
      notificationService.notifyCancelledByEmployee(
          patientDto, initialProcedureStep.getAppointment().getAppointmentStart());
    }

    vaccinationConsultationRepository.deleteById(vaccinationConsultation.getId());
  }

  public void acceptDraftVaccinationConsultation(
      UUID procedureId, PatchAcceptDraftRequest acceptDraftRequest) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.checkIsDraft);

    Person person = vaccinationConsultation.getRelatedPersons().getFirst();
    UUID newFileState;
    if (acceptDraftRequest.referencePersonId() == null) {
      newFileState = createInternalReferencePerson(person.getCentralFileStateId());
    } else {
      newFileState =
          personClient.updatePersonAndCreateFileState(
              acceptDraftRequest.referencePersonId(), person.getCentralFileStateId());
    }
    person.setCentralFileStateId(newFileState);
    vaccinationConsultation.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
  }

  private UUID createInternalReferencePerson(UUID fileStateId) {
    try {
      return personClient.createInternalReferencePerson(fileStateId);
    } catch (HttpClientErrorException.BadRequest e) {
      throw new BadRequestException(e.getMessage());
    }
  }
}
