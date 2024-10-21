/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import static de.eshg.travelmedicine.medicalhistory.MedicalHistoryHelper.isMedicalHistoryCompletelyAnswered;
import static de.eshg.travelmedicine.util.MappingUtil.mapEnum;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.lib.appointmentblock.AppointmentTypeMapper;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.travelmedicine.citizenpublic.api.PostCitizenVaccinationConsultationRequest;
import de.eshg.travelmedicine.medicalhistory.MedicalHistoryMapper;
import de.eshg.travelmedicine.medicalhistory.MedicalHistoryService;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistoryContentDto;
import de.eshg.travelmedicine.medicalhistory.persistence.entity.MedicalHistory;
import de.eshg.travelmedicine.notification.NotificationService;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplate;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplateRepository;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplateState;
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
import de.eshg.travelmedicine.vaccinationconsultation.api.GetMedicalHistoriesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetStepsWithAppliedServicesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetVaccinationConsultationDetailsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchOtherServiceRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationConsultationPatientRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationConsultationTravelDetailsRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostInformationStatementsRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostOtherServiceRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostVaccinationConsultationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostVaccinationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.SearchVaccinationConsultationResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.StepWithAppliedServicesDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelInformationDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.VaccinationConsultationSearchDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.AppointmentOverviewEntry;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.CreatedByUserType;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.InformationStatement;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.OtherService;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class VaccinationConsultationService {
  private final VaccinationConsultationRepository vaccinationConsultationRepository;
  private final ProcedureStepRepository procedureStepRepository;
  private final ProcedureStepService procedureStepService;
  private final MedicalHistoryService medicalHistoryService;

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
  private final ProcedureAccessor procedureAccessor;
  private final InformationStatementTemplateRepository informationStatementTemplateRepository;
  private final NotificationService notificationService;

  public VaccinationConsultationService(
      VaccinationConsultationRepository vaccinationConsultationRepository,
      ProcedureStepRepository procedureStepRepository,
      ProcedureStepService procedureStepService,
      MedicalHistoryService medicalHistoryService,
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
      InformationStatementTemplateRepository informationStatementTemplateRepository,
      NotificationService notificationService) {
    this.vaccinationConsultationRepository = vaccinationConsultationRepository;
    this.procedureStepRepository = procedureStepRepository;
    this.procedureStepService = procedureStepService;
    this.medicalHistoryService = medicalHistoryService;
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
    this.informationStatementTemplateRepository = informationStatementTemplateRepository;
    this.notificationService = notificationService;
  }

  public UUID createProcedure(PostVaccinationConsultationRequest request) {
    validatePostVaccinationConsultationRequest(request);

    UUID patientIdFromCentralFile = personClient.createPersonInCentralFile(request.patient());

    VaccinationConsultation vaccinationConsultation =
        vaccinationConsultationMapper.toDomainType(
            getTravelInformation(request),
            patientIdFromCentralFile,
            CurrentUserHelper.getCurrentUserId(),
            CreatedByUserType.EMPLOYEE);

    ProcedureStep initialProcedureStep =
        ProcedureStep.createInitialProcedureStep(
            AppointmentTypeMapper.toDomainType(request.initialStepAppointmentType()),
            request.earliestDate());
    initialProcedureStep.setVaccinationConsultation(vaccinationConsultation);
    initialProcedureStep.setMedicalHistory(procedureStepService.createMedicalHistory(false));
    bookAppointment(initialProcedureStep, request);

    vaccinationConsultation.getProcedureSteps().add(initialProcedureStep);
    vaccinationConsultationRepository.save(vaccinationConsultation);
    procedureStepRepository.save(initialProcedureStep);

    return vaccinationConsultation.getExternalId();
  }

  public UUID createProcedure(PostCitizenVaccinationConsultationRequest request) {
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
            AppointmentTypeMapper.toDomainType(request.initialStepAppointmentType()), null);
    initialProcedureStep.setVaccinationConsultation(vaccinationConsultation);
    initialProcedureStep.setMedicalHistory(procedureStepService.createMedicalHistory(false));
    initialProcedureStep.setAppointment(appointment);

    vaccinationConsultation.getProcedureSteps().add(initialProcedureStep);
    vaccinationConsultationRepository.save(vaccinationConsultation);
    procedureStepRepository.save(initialProcedureStep);

    notificationService.onNewCitizenProcedure(
        citizenAccessCodeUser.accessCode(), request.patient(), initialProcedureStep);

    return vaccinationConsultation.getExternalId();
  }

  public GetAppointmentOverviewResponse getAllProcedureAppointmentSummaries(
      LocalDate dateRangeStart, LocalDate dateRangeEnd) {
    Instant start = dateRangeStart.atStartOfDay(clock.getZone()).toInstant();
    Instant end = dateRangeEnd.atTime(LocalTime.MAX).atZone(clock.getZone()).toInstant();
    List<AppointmentOverviewEntry> appointmentOverview =
        vaccinationConsultationRepository.findAppointmentOverview(
            start, end, dateRangeStart, dateRangeEnd);
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
    }
  }

  private void validatePostVaccinationConsultationRequest(
      PostVaccinationConsultationRequest request) {
    validateTravelInformation(getTravelInformation(request));
    procedureStepService.validateAppointmentData(
        request.appointmentBookingType(),
        request.appointmentStart(),
        request.durationInMinutes(),
        request.earliestDate());
  }

  private TravelInformationDto getTravelInformation(PostVaccinationConsultationRequest request) {
    return new TravelInformationDto(
        request.travelType(),
        request.travelDestinations(),
        request.travelStartDate(),
        request.travelTimeAmount(),
        request.travelTimeUnit());
  }

  private void validateTravelInformation(TravelInformationDto travelInformation) {
    if (travelInformation.travelType() == TravelTypeDto.NO_TRAVEL
        && (!travelInformation.travelDestinations().isEmpty()
            || travelInformation.travelStartDate() != null
            || travelInformation.travelTimeAmount() != null
            || travelInformation.travelTimeUnit() != null)) {
      throw new BadRequestException(UNEXPECTED_TRAVEL_DATA);
    }
  }

  public void updatePatient(UUID externalId, PatchVaccinationConsultationPatientRequest request) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(externalId, ProcedureAccessor.checkNotClosed);

    UUID patientIdFromCentralFile =
        personClient.updatePersonInCentralFile(
            vaccinationConsultation.getRelatedPersons().getFirst().getCentralFileStateId(),
            request.patient());
    vaccinationConsultationMapper.toDomainTypePatchPerson(
        patientIdFromCentralFile, vaccinationConsultation);
  }

  public void updateTravelDetails(
      UUID externalId, PatchVaccinationConsultationTravelDetailsRequest patchRequest) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(externalId, ProcedureAccessor.checkNotClosed);

    if (patchRequest.travelDestinations().contains(null))
      throw new BadRequestException(INVALID_TRAVEL_DATA_NULL);
    if (patchRequest.travelType() == TravelTypeDto.NO_TRAVEL
        && (!patchRequest.travelDestinations().isEmpty()
            || patchRequest.travelStartDate() != null
            || patchRequest.travelTimeAmount() != null
            || patchRequest.travelTimeUnit() != null)) {
      throw new BadRequestException(UNEXPECTED_TRAVEL_DATA);
    }

    vaccinationConsultationMapper.toDomainTypePatchTravel(patchRequest, vaccinationConsultation);
  }

  public GetVaccinationConsultationDetailsResponse getVaccinationConsultationDetails(
      UUID externalId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(externalId, ProcedureAccessor.noChecks);

    UUID patientId = vaccinationConsultation.getPatientIdsFromCentralFile().getFirst();
    PatientDto patientFromCentralFile = personClient.getPersonFromCentralFile(patientId);

    List<ServicePlanEntry> servicePlan =
        vaccinationConsultationRepository.findServicePlanById(externalId);
    ProcedureStep initialProcedureStep =
        procedureStepRepository
            .findInitialProcedureStep(externalId)
            .orElseThrow(() -> new IllegalStateException("No initial procedure step available"));

    List<InformationStatement> informationStatements =
        vaccinationConsultation.getInformationStatements();

    return vaccinationConsultationDetailsMapper.toInterfaceType(
        vaccinationConsultation,
        patientFromCentralFile,
        initialProcedureStep,
        servicePlan,
        informationStatements);
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

      return dateTime.atZone(clock.getZone()).toLocalDate().plusWeeks(vac.getLatency().longValue());
    }
    return null;
  }

  public GetMedicalHistoriesResponse getMedicalHistories(UUID procedureId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.noChecks);

    return medicalHistoryService.getMedicalHistories(vaccinationConsultation);
  }

  public void addInformationStatements(UUID procedureId, PostInformationStatementsRequest request) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.checkNotClosed);

    List<InformationStatement> newStatements =
        request.templateIds().stream()
            .map(
                templateID -> {
                  InformationStatementTemplate template =
                      informationStatementTemplateRepository
                          .findById(templateID)
                          .orElseThrow(
                              () -> new NotFoundException("No such template: " + templateID));
                  if (template.getState() != InformationStatementTemplateState.FINAL)
                    throw new BadRequestException(
                        "The template can't be used until it's in its FINAL state.");
                  return template;
                })
            .map(
                template ->
                    new InformationStatement(template.getTitle(), "content from the template"))
            .toList();

    vaccinationConsultation.getInformationStatements().addAll(newStatements);
    newStatements.forEach(s -> s.setVaccinationConsultation(vaccinationConsultation));
  }

  public void deleteInformationStatement(UUID procedureId, UUID informationStatementId) {
    InformationStatement informationStatement =
        procedureAccessor.accessInformationStatement(
            informationStatementId, procedureId, ProcedureAccessor.checkNotClosed);

    VaccinationConsultation vaccinationConsultation =
        informationStatement.getVaccinationConsultation();

    vaccinationConsultation.getInformationStatements().remove(informationStatement);
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
                      ProcedureStepService.getAppointment(procedureStep),
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
        .orElseThrow(() -> new NotFoundException("Service not found: " + serviceId));
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
    PatientDto patient = personClient.getPersonFromCentralFile(patientId);

    AppointmentSummaryDto summaryDto =
        vaccinationConsultationDetailsMapper.mapToAppointmentSummaryInterfaceType(procedureStep);

    return AppointmentDetailsMapper.mapToDetails(summaryDto, patient, procedureStep);
  }

  public MedicalHistoryContentDto getMedicalHistory(
      UUID citizenUserId, UUID procedureId, UUID procedureStepId) {
    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            procedureStepId,
            procedureId,
            List.of(
                new ProcedureAccessor.CheckNotClosed(),
                new ProcedureAccessor.CheckCitizenUserId(citizenUserId)));

    return MedicalHistoryMapper.contentToInterfaceType(procedureStep.getMedicalHistory());
  }

  public void patchMedicalHistory(
      UUID citizenUserId,
      UUID procedureId,
      UUID procedureStepId,
      MedicalHistoryContentDto patchMedicalHistoryContent) {
    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            procedureStepId,
            procedureId,
            List.of(
                new ProcedureAccessor.CheckNotClosed(),
                new ProcedureAccessor.CheckCitizenUserId(citizenUserId)));
    MedicalHistory medicalHistory = procedureStep.getMedicalHistory();
    if (medicalHistory.isCitizenHasAnswered()) {
      throw new BadRequestException("Medical history already answered by citizen.");
    }

    ObjectMapper objectMapper = new ObjectMapper();
    try {
      medicalHistory.setContent(objectMapper.writeValueAsString(patchMedicalHistoryContent));
    } catch (JsonProcessingException e) {
      throw new BadRequestException("Content does not match required structure");
    }
    medicalHistory.setCompletelyAnswered(
        isMedicalHistoryCompletelyAnswered(patchMedicalHistoryContent));
    medicalHistory.setCitizenHasAnswered(true);
  }

  public void deleteAppointment(UUID citizenUserId, UUID procedureId, UUID procedureStepId) {
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
    appointmentService.deleteAppointment(procedureStep);
  }

  public void bookCitizenAppointment(
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
    if (procedureStep.getEarliestDate() != null) {
      if (procedureStep
          .getEarliestDate()
          .atStartOfDay(clock.getZone())
          .toInstant()
          .isAfter(appointmentDto.start())) {
        throw new BadRequestException(
            "Appointment has accomplished services and cannot be rebooked.");
      }
    }
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
          appointmentDto.start(),
          Math.toIntExact(
              ChronoUnit.MINUTES.between(appointmentDto.start(), appointmentDto.end())));

    } else {
      throw new BadRequestException("No more bookings available. 2 rebookings max. allowed.");
    }

    if (rebook) {
      procedureStep.setBookingsRemaining(remainingBookings - 1);
    }
  }
}
