/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper;

import static de.eshg.lib.procedure.model.ProcedureStatusDto.CLOSED;
import static de.eshg.lib.procedure.model.ProcedureStatusDto.OPEN;

import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.officialmedicalservice.appointment.OmsAppointmentService;
import de.eshg.officialmedicalservice.citizenpublic.CitizenProcedureService;
import de.eshg.officialmedicalservice.concern.ConcernMapper;
import de.eshg.officialmedicalservice.concern.ConcernService;
import de.eshg.officialmedicalservice.document.OmsDocumentService;
import de.eshg.officialmedicalservice.document.api.DocumentStatusDto;
import de.eshg.officialmedicalservice.document.api.PatchDocumentReviewRequest;
import de.eshg.officialmedicalservice.document.api.ReviewResultDto;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocumentRepository;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocumentStatus;
import de.eshg.officialmedicalservice.procedure.EmployeeOmsProcedureService;
import de.eshg.officialmedicalservice.procedure.api.ConcernDto;
import de.eshg.officialmedicalservice.procedure.api.PatchAcceptDraftProcedureRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchConcernRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchEmployeeOmsProcedureEmailNotificationsRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchEmployeeOmsProcedurePhysicianRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchMedicalOpinionStatusRequest;
import de.eshg.officialmedicalservice.procedure.api.PostCitizenProcedureRequest;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.testhelper.api.AppointmentPopulationDto;
import de.eshg.officialmedicalservice.testhelper.api.CitizenPortalCredentialsDto;
import de.eshg.officialmedicalservice.testhelper.api.ConcernTestDataConfig;
import de.eshg.officialmedicalservice.testhelper.api.DocumentPopulationDto;
import de.eshg.officialmedicalservice.testhelper.api.FileTestDataConfig;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateCitizenProcedureRequest;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureRequest;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureResponse;
import de.eshg.officialmedicalservice.user.CitizenAccessCodeUserClient;
import de.eshg.officialmedicalservice.waitingroom.WaitingRoomService;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import jakarta.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/*
Entities still to handle:
 - Appointments
    - complete / withdraw
 - Documents	(how to access docs created by concern)
    - Files	(4, 5 Standardfiles im Backend, die via key über API angesprochen werden)
    - State
 - Opinion
    - File
    - State

API Request:
	completeAppointments - List of AppointmentKeys
	additionalDocuments - List DocumentPopulations (documentKey, fachlichen PostRequest)
	uploadedFiles - List Of filePopulation (documentKey, fileKey, uploadedBy (Citizen or Employee))
	documentState? - ListOf DocumentKeys, entweder (documentState, optional reason) oder fachlicher Patch?
	  beobachten, möglicherweise wird state auch von fileActions beeinflusst, ggf. ist es doch einfacher,
	  documents, files und documentState in einem PopulationDto zu handhaben
	medicalOpinion - PopulationDto mit state, fileKey, publishedFlag
	sendInvitation - true or null
	disputeProcedure - true or null

Folgende PopulationKeys werden nicht vom Client gesetzt, sondern sind im BE fixiert:
 - DefaultDocumentDefinitionKey, dito
 - FileKey, ~ 3 Dateien, die im BE abgelegt werden, um in der PopulatorAPI keine Filestreamingzirkus veranstalten zu müssen
   (sollten Dateinamen eine weitergehende Rolle spielen, nur diese dann in FilePopulationDtos aufnehmen)
Vorschlag: Definitionen als EnumDto in API

Workflow
	# create procedure
	# add facility
	# add concern
	# add physician
	# start procedure (using TargetState)
	# create appointments
	# cancel appointments
	# complete appointments
	# send invitation and obtain citizen token
	# create documents
	# obtain UUIDs from default documents
	# upload files to documents as employee
	# upload files to documents as citizen
	# set file states
	# upload file to opinion
	# set opinion state
	# publish opinion
	# close procedure
	# dispute procedure

API Response
	procedureId
	facilityId (wird aktuell nicht verwendet, könnte für SyncTestfälle sinnvoll sein, sollte dann auch mit affectedPerson so gemacht werden)
	appointmentMap - appointmentKey, UUID der Entity
	documentMap - documentKeys, UUID der Entity (beinhaltet auch die Keys der Documents, die über die default Definitionen angelegt wurden)
	ggf. opinionId
	disputeProcedureId
 */

@Service
@ConditionalOnTestHelperEnabled
public class TestPopulateProcedureService {

  private final EmployeeOmsProcedureService employeeOmsProcedureService;
  private final CitizenProcedureService citizenProcedureService;
  private final ConcernService concernService;
  private final OmsAppointmentService appointmentService;
  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final OmsDocumentService omsDocumentService;
  private final OmsDocumentRepository omsDocumentRepository;
  private final WaitingRoomService waitingRoomService;
  private final CitizenAccessCodeUserClient citizenAccessCodeUserClient;
  private final OmsProcedureRepository omsProcedureRepository;

  public TestPopulateProcedureService(
      EmployeeOmsProcedureService employeeOmsProcedureService,
      CitizenProcedureService citizenProcedureService,
      ConcernService concernService,
      OmsAppointmentService appointmentService,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      OmsDocumentService omsDocumentService,
      OmsDocumentRepository omsDocumentRepository,
      WaitingRoomService waitingRoomService,
      CitizenAccessCodeUserClient citizenAccessCodeUserClient,
      OmsProcedureRepository omsProcedureRepository) {
    this.employeeOmsProcedureService = employeeOmsProcedureService;
    this.citizenProcedureService = citizenProcedureService;
    this.concernService = concernService;
    this.appointmentService = appointmentService;
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.omsDocumentService = omsDocumentService;
    this.omsDocumentRepository = omsDocumentRepository;
    this.waitingRoomService = waitingRoomService;
    this.citizenAccessCodeUserClient = citizenAccessCodeUserClient;
    this.omsProcedureRepository = omsProcedureRepository;
  }

  @Transactional
  public PostPopulateProcedureResponse populateProcedure(PostPopulateProcedureRequest request) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> {
          // 0. create blank response data
          UUID procedureId;
          UUID facilityId = null;
          Map<String, UUID> appointmentMap;
          Map<String, UUID> documentMap;
          UUID citizenUserId;
          CitizenPortalCredentialsDto citizenPortalCredentials = null;

          // 1. create procedure
          if (request.procedureData() != null) {
            procedureId =
                employeeOmsProcedureService.createEmployeeProcedure((request.procedureData()));
          } else {
            procedureId = addCitizenProcedure(request.procedureDataCitizen());
          }

          // 2. Deactivate email notifications
          if (request.sendEmailNotifications() != null) {
            employeeOmsProcedureService.patchEmailNotifications(
                procedureId,
                new PatchEmployeeOmsProcedureEmailNotificationsRequest(
                    request.sendEmailNotifications()));
          }

          // 3. add facility
          if (request.facility() != null) {
            facilityId = employeeOmsProcedureService.addFacility(procedureId, request.facility());
          }

          // 4. add concern
          if (request.concern() != null) {
            ConcernDto concern = loadConcern(request.concern());

            employeeOmsProcedureService.updateOmsProcedureConcern(
                procedureId, new PatchConcernRequest(concern));
          }

          // 5. add physician
          if (request.physician() != null) {
            employeeOmsProcedureService.modifyPhysician(
                procedureId, new PatchEmployeeOmsProcedurePhysicianRequest(request.physician()));
          }

          // 6. start procedure
          if (Arrays.asList(OPEN, CLOSED).contains(request.targetState())) {
            employeeOmsProcedureService.acceptDraftProcedure(
                procedureId, new PatchAcceptDraftProcedureRequest(null, null));
            if (request.procedureDataCitizen() != null) {
              citizenUserId = getCitizenUserId(procedureId);
              citizenPortalCredentials =
                  createCredentials(citizenUserId, request.procedureDataCitizen());
            }
          }

          // 7. add (and cancel and close) appointments
          appointmentMap =
              addAppointments(
                  procedureId,
                  request.appointments(),
                  request.cancelledAppointments(),
                  request.closedAppointments());

          // 8. add documents
          documentMap = addDocuments(procedureId, request.documents());

          // 9. update medical opinion status
          if (request.medicalOpinionStatus() != null) {
            employeeOmsProcedureService.updateMedicalOpinionStatus(
                procedureId,
                new PatchMedicalOpinionStatusRequest(
                    request.medicalOpinionStatus(), request.medicalOpinionResult()));
          }

          // 10. update waiting room
          if (request.waitingRoom() != null) {
            waitingRoomService.updateWaitingRoom(procedureId, request.waitingRoom());
          }

          // 11. close procedure
          if (Objects.equals(CLOSED, request.targetState())) {
            employeeOmsProcedureService.closeOpenProcedure(procedureId);
          }

          return new PostPopulateProcedureResponse(
              procedureId, facilityId, appointmentMap, documentMap, citizenPortalCredentials);
        });
  }

  private UUID addCitizenProcedure(PostPopulateCitizenProcedureRequest procedureDataCitizen) {
    PostCitizenProcedureRequest request =
        new PostCitizenProcedureRequest(
            loadConcern(procedureDataCitizen.concern()),
            procedureDataCitizen.appointment().request(),
            procedureDataCitizen.affectedPerson());
    return citizenProcedureService.createCitizenProcedure(
        request, loadFiles(procedureDataCitizen.files()));
  }

  private UUID getCitizenUserId(UUID procedureId) {
    return omsProcedureRepository.findByExternalId(procedureId).orElseThrow().getCitizenUserId();
  }

  private CitizenPortalCredentialsDto createCredentials(
      UUID citizenUserId, PostPopulateCitizenProcedureRequest citizenProcedureRequest) {
    LocalDate dateOfBirth = citizenProcedureRequest.affectedPerson().dateOfBirth();

    CitizenAccessCodeUserDto citizenAccessCode =
        citizenAccessCodeUserClient.getCitizenAccessCode(citizenUserId);
    return new CitizenPortalCredentialsDto(citizenAccessCode.accessCode(), dateOfBirth);
  }

  private Map<String, UUID> addAppointments(
      UUID procedureId,
      List<AppointmentPopulationDto> appointmentPopulations,
      List<String> canceledAppointments,
      List<String> closedAppointments) {
    Map<String, UUID> appointmentMap = new LinkedHashMap<>();
    Set<String> canceledAppointmentsSet =
        new HashSet<>(
            canceledAppointments != null ? canceledAppointments : Collections.emptyList());
    Set<String> closedAppointmentsSet =
        new HashSet<>(closedAppointments != null ? closedAppointments : Collections.emptyList());
    if (appointmentPopulations != null) {
      appointmentPopulations.forEach(
          population -> {
            UUID appointmentId =
                appointmentService.addAppointmentEmployee(procedureId, population.request());
            appointmentMap.put(population.key(), appointmentId);
            if (canceledAppointmentsSet.contains(population.key())) {
              appointmentService.cancelAppointmentEmployee(appointmentId);
            }
            if (closedAppointmentsSet.contains(population.key())) {
              appointmentService.closeAppointmentEmployee(appointmentId);
            }
          });
    }
    return appointmentMap;
  }

  private Map<String, UUID> addDocuments(
      UUID procedureId, List<DocumentPopulationDto> documentPopulation) {
    Map<String, UUID> documentMap = new LinkedHashMap<>();
    if (documentPopulation != null) {
      documentPopulation.forEach(
          document -> {
            List<MultipartFile> filesToAdd = new ArrayList<>();
            String note = null;
            if (document.targetState() == DocumentStatusDto.ACCEPTED
                || document.targetState() == DocumentStatusDto.SUBMITTED) {
              filesToAdd = loadFiles(document.files());

              if (!document.files().isEmpty()) {
                note = document.note();
              }
            }

            UUID documentId =
                omsDocumentService.addDocumentEmployee(
                    procedureId, document.request(), filesToAdd, note);

            // TODO ISSUE-7371: use citizen portal document function from document service
            if (DocumentStatusDto.SUBMITTED == document.targetState()
                || DocumentStatusDto.REJECTED == document.targetState()) {
              omsDocumentRepository
                  .findById(documentId)
                  .orElseThrow()
                  .setDocumentStatus(OmsDocumentStatus.SUBMITTED);
            }

            if (document.targetState() == DocumentStatusDto.REJECTED) {
              omsDocumentService.reviewDocumentEmployee(
                  documentId,
                  new PatchDocumentReviewRequest(
                      ReviewResultDto.REJECTED, document.reasonForRejection()));
            }

            documentMap.put(document.key(), documentId);
          });
    }
    return documentMap;
  }

  private ConcernDto loadConcern(ConcernTestDataConfig concern) {
    return concernService.getConcerns().categories().stream()
        .flatMap(
            category ->
                category.concerns().stream()
                    .filter(concernDto -> concernDto.nameDe().equals(concern.getNameDe()))
                    .map(
                        concernConfigDto ->
                            ConcernMapper.mapConcernConfigToConcernDto(
                                concernConfigDto, category, 0))
                    .findFirst()
                    .stream())
        .findFirst()
        .orElseThrow();
  }

  private List<MultipartFile> loadFiles(List<FileTestDataConfig> files) {
    List<MultipartFile> filesToAdd = new ArrayList<>();
    files.forEach(
        config -> {
          try {
            Path filePath =
                Paths.get(
                    getClass()
                        .getClassLoader()
                        .getResource("documents/" + config.getName())
                        .toURI());
            File file = filePath.toFile();

            filesToAdd.add(
                new OmsDocumentTestHelperFile(
                    file.getName(), Files.probeContentType(file.toPath()), file));
          } catch (IOException | URISyntaxException e) {
            throw new RuntimeException("Fehler beim Laden der Testdatei: " + config.getName(), e);
          }
        });
    return filesToAdd;
  }
}
