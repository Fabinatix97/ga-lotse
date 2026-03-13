/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.testhelper;

import static de.eshg.lib.procedure.model.ProcedureStatusDto.CLOSED;
import static de.eshg.lib.procedure.model.ProcedureStatusDto.OPEN;

import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.officialmedicalservice.anamnesis.api.UpdateAnamnesisRequest;
import de.eshg.officialmedicalservice.appointment.OmsAppointmentService;
import de.eshg.officialmedicalservice.citizenpublic.CitizenPublicProcedureService;
import de.eshg.officialmedicalservice.concern.ConcernMapper;
import de.eshg.officialmedicalservice.concern.ConcernService;
import de.eshg.officialmedicalservice.document.OmsDocumentService;
import de.eshg.officialmedicalservice.document.api.PatchDocumentReviewRequest;
import de.eshg.officialmedicalservice.document.api.ReviewResultDto;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocument;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocumentRepository;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocumentStatus;
import de.eshg.officialmedicalservice.procedure.EmployeeOmsProcedureService;
import de.eshg.officialmedicalservice.procedure.api.ConcernDto;
import de.eshg.officialmedicalservice.procedure.api.MergeAffectedPersonRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchAcceptDraftProcedureRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchMedicalOpinionStatusRequest;
import de.eshg.officialmedicalservice.procedure.api.PostCitizenProcedureRequest;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
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
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.i18n.Language;
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
    - Files	(4, 5 Standardfiles im Backend, die via key über API angesprochen
    werden)
    - State
 - Opinion
    - File
    - State

API Request:
	completeAppointments - List of AppointmentKeys
	additionalDocuments - List DocumentPopulations (documentKey, fachlichen
	PostRequest)
	uploadedFiles - List Of filePopulation (documentKey, fileKey, uploadedBy
	(Citizen or Employee))
	documentState? - ListOf DocumentKeys, entweder (documentState, optional
	reason) oder fachlicher Patch?
	  beobachten, möglicherweise wird state auch von fileActions beeinflusst,
	  ggf. ist es doch einfacher,
	  documents, files und documentState in einem PopulationDto zu handhaben
	medicalOpinion - PopulationDto mit state, fileKey, publishedFlag
	sendInvitation - true or null
	disputeProcedure - true or null

Folgende PopulationKeys werden nicht vom Client gesetzt, sondern sind im BE
fixiert:
 - DefaultDocumentDefinitionKey, dito
 - FileKey, ~ 3 Dateien, die im BE abgelegt werden, um in der PopulatorAPI
 keine Filestreamingzirkus veranstalten zu müssen
   (sollten Dateinamen eine weitergehende Rolle spielen, nur diese dann in
   FilePopulationDtos aufnehmen)
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
	facilityId (wird aktuell nicht verwendet, könnte für SyncTestfälle sinnvoll
	sein, sollte dann auch mit affectedPerson so gemacht werden)
	appointmentMap - appointmentKey, UUID der Entity
	documentMap - documentKeys, UUID der Entity (beinhaltet auch die Keys der
	Documents, die über die default Definitionen angelegt wurden)
	ggf. opinionId
	disputeProcedureId
 */

@Service
@ConditionalOnTestHelperEnabled
public class TestPopulateProcedureService {

  private final EmployeeOmsProcedureService employeeOmsProcedureService;
  private final CitizenPublicProcedureService citizenPublicProcedureService;
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
      CitizenPublicProcedureService citizenPublicProcedureService,
      ConcernService concernService,
      OmsAppointmentService appointmentService,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      OmsDocumentService omsDocumentService,
      OmsDocumentRepository omsDocumentRepository,
      WaitingRoomService waitingRoomService,
      CitizenAccessCodeUserClient citizenAccessCodeUserClient,
      OmsProcedureRepository omsProcedureRepository) {
    this.employeeOmsProcedureService = employeeOmsProcedureService;
    this.citizenPublicProcedureService = citizenPublicProcedureService;
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
            employeeOmsProcedureService.updateEmailNotifications(
                loadOmsProcedure(procedureId), request.sendEmailNotifications());
          }

          // 3. add facility
          if (request.facility() != null) {
            facilityId = employeeOmsProcedureService.addFacility(procedureId, request.facility());
          }

          // 4. add concern
          if (request.concern() != null) {
            ConcernDto concern = loadConcern(request.concern());

            employeeOmsProcedureService.updateConcern(loadOmsProcedure(procedureId), concern);
          }

          // 5. add physician
          if (request.physician() != null) {
            employeeOmsProcedureService.updatePhysician(
                loadOmsProcedure(procedureId), request.physician());
          }

          // 6. accept person
          if (Boolean.TRUE.equals(request.personAccepted())) {
            employeeOmsProcedureService.mergeAffectedPerson(
                procedureId,
                new MergeAffectedPersonRequest(
                    request.procedureDataCitizen().affectedPerson(), null));
          }

          // 7. start procedure
          if (Arrays.asList(OPEN, CLOSED).contains(request.targetState())) {
            employeeOmsProcedureService.acceptDraftProcedure(
                procedureId, new PatchAcceptDraftProcedureRequest(null, null));
            if (request.procedureDataCitizen() != null) {
              citizenUserId = getCitizenUserId(procedureId);
              citizenPortalCredentials =
                  createCredentials(
                      citizenUserId, request.procedureDataCitizen().affectedPerson().dateOfBirth());
            } else {
              citizenUserId = getCitizenUserId(procedureId);
              citizenPortalCredentials =
                  createCredentials(
                      citizenUserId, request.procedureData().affectedPerson().dateOfBirth());
            }
          }

          // 8. add (and cancel and close) appointments
          appointmentMap =
              addAppointments(
                  procedureId,
                  request.appointments(),
                  request.cancelledAppointments(),
                  request.closedAppointments());

          // 9. add documents
          documentMap =
              addDocuments(
                  procedureId,
                  request.documents(),
                  request.submittedDocuments(),
                  request.rejectedDocuments(),
                  request.acceptedDocuments());

          // 11. update medical opinion status
          if (request.medicalOpinionStatus() != null) {
            employeeOmsProcedureService.updateMedicalOpinionStatus(
                procedureId,
                new PatchMedicalOpinionStatusRequest(
                    request.medicalOpinionStatus(),
                    request.medicalOpinionResult(),
                    request.medicalOpinionComment()));
          }

          // 12. update waiting room
          if (request.waitingRoom() != null) {
            waitingRoomService.updateWaitingRoom(procedureId, request.waitingRoom());
          }

          // 13. update cut-off date
          if (request.cutOffDate() != null) {
            employeeOmsProcedureService.updateMedicalOpinionCutOffDate(
                loadOmsProcedure(procedureId), request.cutOffDate());
          }

          // 14. update anamnesis
          if (request.anamnesis() != null) {
            employeeOmsProcedureService.updateAnamnesis(
                procedureId, new UpdateAnamnesisRequest(request.anamnesis()));
          }

          // 15. close procedure
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
    return citizenPublicProcedureService.createCitizenProcedure(
        request, loadFiles(procedureDataCitizen.files()));
  }

  private UUID getCitizenUserId(UUID procedureId) {
    return omsProcedureRepository.findByExternalId(procedureId).orElseThrow().getCitizenUserId();
  }

  private CitizenPortalCredentialsDto createCredentials(UUID citizenUserId, LocalDate dateOfBirth) {

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
              appointmentService.cancelAppointmentEmployee(
                  appointmentId, population.reasonForRejection());
            }
            if (closedAppointmentsSet.contains(population.key())) {
              appointmentService.closeAppointmentEmployee(appointmentId);
            }
          });
    }
    return appointmentMap;
  }

  private Map<String, UUID> addDocuments(
      UUID procedureId,
      List<DocumentPopulationDto> documentPopulation,
      List<String> submittedDocuments,
      List<String> rejectedDocuments,
      List<String> acceptedDocuments) {
    Map<String, UUID> documentMap = new LinkedHashMap<>();
    Set<String> submittedDocumentsSet =
        new HashSet<>(submittedDocuments != null ? submittedDocuments : Collections.emptyList());
    Set<String> rejectedDocumentsSet =
        new HashSet<>(rejectedDocuments != null ? rejectedDocuments : Collections.emptyList());
    Set<String> acceptedDocumentsSet =
        new HashSet<>(acceptedDocuments != null ? acceptedDocuments : Collections.emptyList());

    // TODO ISSUE-7371: use citizen portal document function from document
    //  service

    List<OmsDocument> initialDocuments =
        omsProcedureRepository.findByExternalId(procedureId).orElseThrow().getDocuments();

    initialDocuments.forEach(
        document -> {
          String key = document.getDocumentType(Language.GERMAN);
          documentMap.put(key, document.getId());

          if (acceptedDocumentsSet.contains(key)) {
            omsDocumentRepository
                .findById(document.getId())
                .orElseThrow()
                .setDocumentStatus(OmsDocumentStatus.SUBMITTED);

            omsDocumentService.reviewDocumentEmployee(
                document.getId(), new PatchDocumentReviewRequest(ReviewResultDto.ACCEPTED, null));
          }
        });

    if (documentPopulation != null) {
      documentPopulation.forEach(
          document -> {
            List<MultipartFile> filesToAdd = new ArrayList<>();
            String note = null;

            if (document.files() != null && !document.files().isEmpty()) {
              filesToAdd = loadFiles(document.files());
              note = document.note();
            }

            UUID documentId =
                omsDocumentService.addDocumentEmployee(
                    procedureId, document.request(), filesToAdd, note);

            documentMap.put(document.key(), documentId);

            if (submittedDocumentsSet.contains(document.key())) {
              omsDocumentRepository
                  .findById(documentId)
                  .orElseThrow()
                  .setDocumentStatus(OmsDocumentStatus.SUBMITTED);
            }

            if (rejectedDocumentsSet.contains(document.key())) {
              omsDocumentRepository
                  .findById(documentId)
                  .orElseThrow()
                  .setDocumentStatus(OmsDocumentStatus.SUBMITTED);

              omsDocumentService.reviewDocumentEmployee(
                  documentId,
                  new PatchDocumentReviewRequest(
                      ReviewResultDto.REJECTED, document.reasonForRejection()));
            }

            if (acceptedDocumentsSet.contains(document.key())) {
              omsDocumentRepository
                  .findById(documentId)
                  .orElseThrow()
                  .setDocumentStatus(OmsDocumentStatus.SUBMITTED);

              omsDocumentService.reviewDocumentEmployee(
                  documentId, new PatchDocumentReviewRequest(ReviewResultDto.ACCEPTED, null));
            }
          });
    }
    return documentMap;
  }

  private OmsProcedure loadOmsProcedure(UUID externalId) {
    return omsProcedureRepository
        .findByExternalId(externalId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }

  private ConcernDto loadConcern(ConcernTestDataConfig concern) {
    return concernService.getConcerns().categories().stream()
        .flatMap(
            category ->
                category.concerns().stream()
                    .filter(
                        concernDto ->
                            concernDto.names().get(Language.GERMAN).equals(concern.getNameDe()))
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
