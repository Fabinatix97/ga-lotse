/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper;

import static de.eshg.travelmedicine.featuretoggle.TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT;

import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersResponse;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.travelmedicine.certificate.CertificateService;
import de.eshg.travelmedicine.certificate.api.CertificateTypeDto;
import de.eshg.travelmedicine.certificate.api.PostPutCertificateRequest;
import de.eshg.travelmedicine.citizenpublic.api.PostCitizenVaccinationConsultationRequest;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import de.eshg.travelmedicine.testhelper.api.CertificatePopulationDto;
import de.eshg.travelmedicine.testhelper.api.CitizenPortalCredentialsDto;
import de.eshg.travelmedicine.testhelper.api.InitialStepPopulationDto;
import de.eshg.travelmedicine.testhelper.api.OtherServicePopulationDto;
import de.eshg.travelmedicine.testhelper.api.PostPopulateProcedureRequest;
import de.eshg.travelmedicine.testhelper.api.PostPopulateProcedureResponse;
import de.eshg.travelmedicine.testhelper.api.ProcedureStepPopulationDto;
import de.eshg.travelmedicine.testhelper.api.VaccinationPopulationDto;
import de.eshg.travelmedicine.vaccinationconsultation.CitizenAccessCodeUserClient;
import de.eshg.travelmedicine.vaccinationconsultation.ProcedureStepService;
import de.eshg.travelmedicine.vaccinationconsultation.VaccinationConsultationService;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchOtherServiceRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostInformationStatementsRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostProcedureStepRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostVaccinationConsultationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStepRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultationRepository;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@ConditionalOnTestHelperEnabled
public class TestPopulateProcedureService {

  private final VaccinationConsultationService vaccinationConsultationService;
  private final VaccinationConsultationRepository vaccinationConsultationRepository;
  private final ProcedureStepService procedureStepService;
  private final ProcedureStepRepository procedureStepRepository;
  private final CertificateService certificateService;

  private final CitizenAccessCodeUserClient citizenAccessCodeUserClient;
  private final UserApi userApi;
  private final TravelMedicineFeatureToggle featureToggle;
  private final SecurityContextHolderStrategy securityContextHolderStrategy =
      SecurityContextHolder.getContextHolderStrategy();

  public TestPopulateProcedureService(
      VaccinationConsultationService vaccinationConsultationService,
      VaccinationConsultationRepository vaccinationConsultationRepository,
      ProcedureStepService procedureStepService,
      ProcedureStepRepository procedureStepRepository,
      CertificateService certificateService,
      UserApi userApi,
      CitizenAccessCodeUserClient citizenAccessCodeUserClient,
      TravelMedicineFeatureToggle featureToggle) {
    this.vaccinationConsultationService = vaccinationConsultationService;
    this.vaccinationConsultationRepository = vaccinationConsultationRepository;
    this.procedureStepService = procedureStepService;
    this.procedureStepRepository = procedureStepRepository;
    this.certificateService = certificateService;
    this.citizenAccessCodeUserClient = citizenAccessCodeUserClient;
    this.userApi = userApi;
    this.featureToggle = featureToggle;
  }

  @Transactional
  public PostPopulateProcedureResponse populateProcedure(
      PostPopulateProcedureRequest populateProcedureRequest) {

    // 0. create blank response data
    UUID procedureId;
    Map<String, UUID> stepMap = new LinkedHashMap<>();
    Map<String, UUID> serviceMap = new LinkedHashMap<>();
    CitizenPortalCredentialsDto citizenPortalCredentials = null;

    // 1. check request
    boolean isCitizenPortal = isCitizenPortal(populateProcedureRequest);

    // 2. create the procedure itself
    if (isCitizenPortal) {
      PostCitizenVaccinationConsultationRequest citizenProcedureRequest =
          populateProcedureRequest.citizenProcedureData();
      procedureId = populateCitizenVaccinationConsultation(citizenProcedureRequest);
      citizenPortalCredentials = createCredentials(procedureId, citizenProcedureRequest);
    } else {
      procedureId =
          populateEmployeeVaccinationConsultation(populateProcedureRequest.procedureData());
    }

    // 3. add services
    serviceMap.putAll(populateVaccinations(procedureId, populateProcedureRequest.vaccinations()));
    serviceMap.putAll(populateOtherServices(procedureId, populateProcedureRequest.otherServices()));

    // 4. deal with initial procedure step
    InitialStepPopulationDto initialStep = populateProcedureRequest.initialStep();
    if (initialStep != null) {
      UUID initialStepId =
          procedureStepRepository
              .findInitialProcedureStep(procedureId)
              .orElseThrow()
              .getExternalId();
      stepMap.put(initialStep.initialStepKey(), initialStepId);

      // assign services
      List<String> initialServices = initialStep.serviceKeys();
      if (initialServices != null) {
        assignServicesToStep(procedureId, initialStepId, getAll(initialServices, serviceMap));
      }
    }

    // 5. populate steps
    stepMap.putAll(
        populateSteps(procedureId, populateProcedureRequest.procedureSteps(), serviceMap));
    // 6. cancel appointments
    cancelAppointments(procedureId, stepMap, populateProcedureRequest.cancelSteps());

    // 7. perform services
    executeVaccinations(procedureId, serviceMap, populateProcedureRequest.executeVaccinations());
    executeOtherServices(procedureId, serviceMap, populateProcedureRequest.executeOtherServices());

    // 8. add certificates
    populateCertificates(procedureId, populateProcedureRequest.certificates(), stepMap, serviceMap);

    // 9. add information statements
    populateInformationStatements(procedureId, populateProcedureRequest.informationStatements());

    // 10. close the procedure
    changeProcedureStatus(procedureId, populateProcedureRequest.statusChange());

    return new PostPopulateProcedureResponse(
        procedureId, stepMap, serviceMap, citizenPortalCredentials);
  }

  private boolean isCitizenPortal(PostPopulateProcedureRequest createProcedureRequest) {
    PostVaccinationConsultationRequest vaccinationConsultationRequest =
        createProcedureRequest.procedureData();
    PostCitizenVaccinationConsultationRequest citizenVaccinationConsultationRequest =
        createProcedureRequest.citizenProcedureData();
    if (vaccinationConsultationRequest != null && citizenVaccinationConsultationRequest != null) {
      throw new BadRequestException(
          "Procedure Data has to be set for employee or citizen, but not both.");
    }
    if (citizenVaccinationConsultationRequest != null) {
      return true;
    }
    if (vaccinationConsultationRequest != null) {
      return false;
    }
    throw new BadRequestException("No procedure data in request.");
  }

  private UUID populateEmployeeVaccinationConsultation(
      PostVaccinationConsultationRequest postVaccinationConsultationRequest) {
    return vaccinationConsultationService.createProcedure(postVaccinationConsultationRequest);
  }

  private UUID populateCitizenVaccinationConsultation(
      PostCitizenVaccinationConsultationRequest citizenProcedureRequest) {
    SecurityContext oldContext = securityContextHolderStrategy.getContext();
    try {
      securityContextHolderStrategy.clearContext();
      // call must be unauthenticated
      return vaccinationConsultationService.createProcedure(citizenProcedureRequest);
    } finally {
      securityContextHolderStrategy.setContext(oldContext);
    }
  }

  private CitizenPortalCredentialsDto createCredentials(
      UUID procedureId, PostCitizenVaccinationConsultationRequest citizenProcedureRequest) {
    LocalDate dateOfBirth = citizenProcedureRequest.patient().dateOfBirth();
    UUID citizenUserId =
        vaccinationConsultationRepository
            .findByExternalId(procedureId)
            .orElseThrow()
            .getCitizenUserId();
    CitizenAccessCodeUserDto citizenAccessCode =
        citizenAccessCodeUserClient.getCitizenAccessCode(citizenUserId);
    return new CitizenPortalCredentialsDto(citizenAccessCode.accessCode(), dateOfBirth);
  }

  private Map<String, UUID> populateVaccinations(
      UUID procedureId, List<VaccinationPopulationDto> vaccinationPopulations) {
    Map<String, UUID> serviceMap = new LinkedHashMap<>();
    if (vaccinationPopulations != null) {
      vaccinationPopulations.forEach(
          population -> {
            if (population.request().createSeries())
              throw new BadRequestException("Series are not supported by test data population");
            UUID vaccinationId =
                vaccinationConsultationService
                    .createServices(
                        procedureId, null, List.of(population.request()), List.of()) // no a
                    .getFirst();
            serviceMap.put(population.serviceKey(), vaccinationId);
          });
    }
    return serviceMap;
  }

  private Map<String, UUID> populateOtherServices(
      UUID procedureId, List<OtherServicePopulationDto> otherServicePopulations) {
    Map<String, UUID> serviceMap = new LinkedHashMap<>();
    if (otherServicePopulations != null) {
      otherServicePopulations.forEach(
          population -> {
            UUID otherServiceId =
                vaccinationConsultationService
                    .createServices(procedureId, null, List.of(), List.of(population.request()))
                    .getFirst();
            serviceMap.put(population.serviceKey(), otherServiceId);
          });
    }
    return serviceMap;
  }

  private void assignServicesToStep(UUID procedureId, UUID stepId, List<UUID> serviceIds) {
    if (serviceIds != null) {
      serviceIds.forEach(
          serviceId ->
              vaccinationConsultationService.assignProcedureStepToService(
                  procedureId, stepId, serviceId));
    }
  }

  private Map<String, UUID> populateSteps(
      UUID procedureId,
      List<ProcedureStepPopulationDto> procedureStepPopulations,
      Map<String, UUID> serviceMap) {
    Map<String, UUID> stepMap = new LinkedHashMap<>();

    if (procedureStepPopulations != null) {
      for (ProcedureStepPopulationDto step : procedureStepPopulations) {
        List<UUID> serviceIds = getAll(step.serviceKeys(), serviceMap);

        // patch the list of services according to the service map and the keys in the request
        PostProcedureStepRequest inputRequest = step.request();
        PostProcedureStepRequest patchedRequest =
            new PostProcedureStepRequest(
                serviceIds,
                inputRequest.appointmentBookingType(),
                inputRequest.appointmentStart(),
                inputRequest.durationInMinutes(),
                inputRequest.earliestDate());

        UUID procedureStepId =
            procedureStepService.createProcedureStep(procedureId, patchedRequest);
        stepMap.put(step.stepKey(), procedureStepId);
      }
    }
    return stepMap;
  }

  private void cancelAppointments(
      UUID procedureId, Map<String, UUID> stepMap, List<String> stepKeys) {
    if (stepKeys == null) {
      return;
    }
    for (String key : stepKeys) {
      UUID stepId = stepMap.get(key);
      if (stepId == null) {
        throw new IllegalArgumentException("Unknown step key");
      }
      UUID citizenUserId =
          vaccinationConsultationRepository
              .findByExternalId(procedureId)
              .orElseThrow()
              .getCitizenUserId();
      vaccinationConsultationService.deleteAppointment(citizenUserId, procedureId, stepId);
    }
  }

  private void executeVaccinations(
      UUID procedureId, Map<String, UUID> serviceMap, List<String> vaccinationKeys) {
    if (vaccinationKeys != null) {
      vaccinationKeys.forEach(
          key -> {
            UUID vaccinationId =
                Optional.of(serviceMap.get(key))
                    .orElseThrow(() -> new RuntimeException("Unknown service key"));
            vaccinationConsultationService.updateVaccination(
                procedureId,
                vaccinationId,
                new PatchVaccinationRequest(
                    "1234567890", LocalDate.of(2024, 1, 1), getPhysicians().getFirst(), null));
          });
    }
  }

  private void executeOtherServices(
      UUID procedureId, Map<String, UUID> serviceMap, List<String> otherServiceKeys) {
    if (otherServiceKeys != null) {
      otherServiceKeys.forEach(
          key -> {
            UUID otherServiceId =
                Optional.of(serviceMap.get(key))
                    .orElseThrow(() -> new RuntimeException("Unknown service key"));
            vaccinationConsultationService.updateOtherService(
                procedureId,
                otherServiceId,
                new PatchOtherServiceRequest(
                    LocalDate.of(2024, 1, 1), getPhysicians().getFirst(), null));
          });
    }
  }

  private void populateCertificates(
      UUID procedureId,
      List<CertificatePopulationDto> certificatePopulations,
      Map<String, UUID> stepMap,
      Map<String, UUID> serviceMap) {
    if (certificatePopulations != null) {
      certificatePopulations.forEach(
          certificatePopulation -> {
            UUID procedureStepId =
                Optional.of(stepMap.get(certificatePopulation.stepKey()))
                    .orElseThrow(() -> new RuntimeException("Unknown step key"));
            List<UUID> serviceIds = getAll(certificatePopulation.serviceKeys(), serviceMap);
            PostPutCertificateRequest request =
                new PostPutCertificateRequest(
                    CertificateTypeDto.HEALTH_INSURANCE, procedureStepId, serviceIds);
            certificateService.createCertificate(procedureId, request);
          });
    }
  }

  private void populateInformationStatements(
      UUID procedureId, PostInformationStatementsRequest informationStatements) {
    if (featureToggle.isNewFeatureEnabled(CITIZEN_PORTAL_INFORMATION_STATEMENT)
        && informationStatements != null) {
      vaccinationConsultationService.addInformationStatements(procedureId, informationStatements);
    }
  }

  private void changeProcedureStatus(UUID procedureId, ProcedureStatusDto procedureStatusDto) {
    if (procedureStatusDto != null) {
      vaccinationConsultationService.updateProcedureStatus(procedureId, procedureStatusDto);
    }
  }

  private List<UUID> getPhysicians() {

    GetUsersResponse response =
        userApi.getUsersByGroup(TechnicalGroup.TRAVEL_MEDICINE_PHYSICIAN.getKeycloakName());
    List<UserDto> users =
        response.users().stream().sorted(Comparator.comparing(UserDto::lastName)).toList();
    return users.stream().map(UserDto::userId).toList();
  }

  // ----- internal utilities
  private static List<UUID> getAll(List<String> keys, Map<String, UUID> map) {
    return (keys == null ? Collections.emptyList() : keys.stream().map(map::get).toList());
  }
}
