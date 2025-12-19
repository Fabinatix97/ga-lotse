/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection;

import static java.nio.charset.StandardCharsets.UTF_8;

import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.checklist.persistence.element.ChecklistElement;
import de.eshg.inspection.client.CalendarClient;
import de.eshg.inspection.common.persistence.MediaFile;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.inspection.api.FinalizeInspectionRequest;
import de.eshg.inspection.inspection.api.FollowupType;
import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.api.InspectionResult;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionAppointment;
import de.eshg.inspection.inspection.persistence.InspectionRelatedFacility;
import de.eshg.inspection.inspection.persistence.InspectionRepository;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.report.InspectionReportService;
import de.eshg.inspection.report.pdf.InspectionReportBuilder;
import de.eshg.inspection.report.pdf.RepData;
import de.eshg.inspection.report.persistence.InspectionSignature;
import de.eshg.inspection.report.persistence.Report;
import de.eshg.inspection.util.FileUtil;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.file.FileFactory;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class InspectionFinalizer {

  private final InspectionFeatureToggle inspectionFeatureToggle;

  @Value("${de.eshg.inspection.signature.max.image.sidelength}")
  private long maxImageSignatureSideLength;

  private final InspectionUpdater inspectionUpdater;
  private final InspectionReportService inspectionReportService;
  private final InspectionReportBuilder inspectionReportBuilder;
  private final InspectionProgressEntryService inspectionProgressEntryService;
  private final InspectionValidator inspectionValidator;
  private final InspectionRepository inspectionRepository;
  private final FacilityClient facilityClient;
  private final CalendarClient calendarClient;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public InspectionFinalizer(
      InspectionUpdater inspectionUpdater,
      InspectionReportService inspectionReportService,
      InspectionReportBuilder inspectionReportBuilder,
      InspectionProgressEntryService inspectionProgressEntryService,
      InspectionValidator inspectionValidator,
      InspectionRepository inspectionRepository,
      FacilityClient facilityClient,
      CalendarClient calendarClient,
      Clock clock,
      AuditLogger auditLogger,
      InspectionFeatureToggle inspectionFeatureToggle) {
    this.inspectionUpdater = inspectionUpdater;
    this.inspectionReportService = inspectionReportService;
    this.inspectionReportBuilder = inspectionReportBuilder;
    this.inspectionProgressEntryService = inspectionProgressEntryService;
    this.inspectionValidator = inspectionValidator;
    this.inspectionRepository = inspectionRepository;
    this.facilityClient = facilityClient;
    this.calendarClient = calendarClient;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
  }

  private void checkApprovalPrerequisites(
      Inspection inspection) { // static removed for feature toggle implementation
    if (inspection.getPhase() != InspectionPhase.CREATING_REPORT_AND_INVOICE) {
      throw new BadRequestException(
          "wrong phase; expected: %s; actual: %s"
              .formatted(InspectionPhase.CREATING_REPORT_AND_INVOICE, inspection.getPhase()));
    }
    if (inspection.getResult() == InspectionResult.SUCCESSFUL_WITH_INCIDENTS) {
      if (inspectionFeatureToggle.isNewFeatureDisabled(InspectionFeature.OBJECT_TYPE_HIERARCHY)
          && inspection.getFollowupType() == null) {
        throw new BadRequestException(
            "inspection is SUCCESSFUL_WITH_INCIDENTS but followupType is missing");
      }
      if (inspectionFeatureToggle.isNewFeatureDisabled(InspectionFeature.OBJECT_TYPE_HIERARCHY)
          && inspection.getFollowupType() == FollowupType.REVIEW
          && inspection.getFollowupDate() == null) {
        throw new BadRequestException(
            "inspection is SUCCESSFUL_WITH_INCIDENTS and followupType is REVIEW but followupDate has not been set");
      }
    }
  }

  private static void checkFinalizationPrerequisites(Inspection inspection) {
    if (inspection.getPhase() != InspectionPhase.EXECUTING) {
      throw new BadRequestException(
          "wrong phase; expected: %s; actual: %s"
              .formatted(InspectionPhase.EXECUTING, inspection.getPhase()));
    }
  }

  /**
   * Finalize an inspection ("Begehung abschließen"). This gets called when the user completes all
   * checklists and the facility representative approves with his signature.
   *
   * <p>This method checks that all required checklist elements are filled, then creates an initial
   * version of the {@link Report}, closes the execution task and sets the phase to {@code
   * EXECUTED}.
   */
  void finalizeInspection(
      Inspection inspection, FinalizeInspectionRequest request, MultipartFile signatureFile) {
    checkFinalizationPrerequisites(inspection);

    InspectionSignature signature = createSignature(request, signatureFile);

    inspectionReportService.createReport(inspection, signature);
    inspectionProgressEntryService.addProgressEntryForFinalization(inspection);
    inspection.setPhase(InspectionPhase.CREATING_REPORT_AND_INVOICE);
    inspection.getExecutionTaskOrThrow().setTaskStatus(TaskStatus.CLOSED);
    inspection.createReportTask(clock.instant());
    inspectionValidator.generateSignatureHash(signature, inspection.getPhase());
    inspectionValidator.generateChecklistHashes(inspection.getChecklists(), inspection.getPhase());
    inspectionUpdater.updateModified(inspection);
  }

  /**
   * Approve an inspection ("Begehung freigeben"). This gets called after the user finished editing
   * the report and set a report result and, optionally, set a follow-up inspection date.
   *
   * <p>This method checks are requirements for approval are given, then creates the final PDF file
   * for the report and attaches it to the progress entries. If the inspection has result {@code
   * FAILED} then the facility is marked as "banned". Otherwise, a follow-up inspection is created,
   * either for regular inspection or for inspection after complaints.
   */
  void approveInspection(Inspection inspection) {
    checkApprovalPrerequisites(inspection);
    createReportPdf(inspection);
    inspectionProgressEntryService.addProgressEntryForApproval(inspection);

    // Banning facility if the result is negative, unbanning it otherwise
    InspectionRelatedFacility relatedFacility = inspection.getRelatedFacility();
    relatedFacility.getFacility().setBanned(inspection.getResult() == InspectionResult.FAILED);

    // We only create a followup inspection if the result is not negative
    if (inspection.getResult() != InspectionResult.FAILED) {
      if (inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.OBJECT_TYPE_HIERARCHY)) {
        // If an explicit date is set, we always create the follow-up
        if (inspection.getFollowupDate() != null) {
          Inspection followupInspection = createFollowupInspectionIfApplicable(inspection);
          if (followupInspection != null) {
            inspection.setFollowupInspection(followupInspection);
          }
        } else if (inspection.getFollowupType() != null) {
          // For SUCCESSFUL_WITH_INCIDENTS + REVIEW without date -> do NOT create follow-up
          if (inspection.getResult() == InspectionResult.SUCCESSFUL_WITH_INCIDENTS
              && inspection.getFollowupType() == FollowupType.REVIEW) {
            // Intentionally do nothing: user set no date -> no follow-up
          } else {
            // If only a type is set, only create if an appointment can be computed (interval
            // exists)
            InspectionType nextType = inspection.getFollowupType().asInspectionType;
            InspectionAppointment appt = computeFollowupAppointment(inspection, nextType);
            if (appt != null) {
              Inspection followupInspection = createFollowupInspectionIfApplicable(inspection);
              if (followupInspection != null) {
                inspection.setFollowupInspection(followupInspection);
              }
            }
          }
        } else {
          // Only create automatic follow-up if applicable interval exists
          InspectionType nextType;
          if (InspectionResult.SUCCESSFUL_WITH_INCIDENTS.equals(inspection.getResult())) {
            nextType = InspectionType.REGULAR_AFTER_INCIDENTS;
          } else if (InspectionResult.FAILED.equals(inspection.getResult())) {
            nextType = InspectionType.REVIEW;
          } else {
            nextType = InspectionType.REGULAR;
          }
          InspectionAppointment appt = computeFollowupAppointment(inspection, nextType);
          if (appt != null) {
            Inspection followupInspection = createFollowupInspectionIfApplicable(inspection);
            inspection.setFollowupInspection(followupInspection);
          }
          // If appt is null: no relevant interval configured -> do not create a follow-up
        }
      } else {
        Inspection followupInspection = createFollowupInspectionIfApplicable(inspection);
        inspection.setFollowupInspection(followupInspection);
      }
    }
    inspection.getReportTaskOrThrow().setTaskStatus(TaskStatus.CLOSED);
    inspection.getRelatedFacility().getFacility().setLastInspected(clock.instant());
    inspection.setPhase(InspectionPhase.CLOSED);
    inspection.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    inspectionUpdater.updateModified(inspection);
  }

  private InspectionSignature createSignature(
      FinalizeInspectionRequest request, MultipartFile signatureFile) {
    if (StringUtils.isNotBlank(request.signer()) && signatureFile != null) {
      MediaFile signatureImage =
          FileUtil.readFileAndValidate(
              signatureFile, List.of(MediaType.IMAGE_PNG), maxImageSignatureSideLength);
      InspectionSignature signature = new InspectionSignature();
      signature.setSigner(request.signer().trim());
      signature.setSignatureImage(signatureImage);
      return signature;
    } else if (StringUtils.isBlank(request.signer()) && signatureFile == null) {
      return null;
    } else {
      throw new BadRequestException("Both signer and signature file must be set or both empty");
    }
  }

  private void createReportPdf(Inspection inspection) {
    Report report = inspection.getReport();
    ZonedDateTime reportDate = ZonedDateTime.now(clock);
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    RepData reportData = inspectionReportBuilder.createReport(inspection, reportDate, baos);
    byte[] bytes = baos.toByteArray();

    PdfMetaData pdfMetaData = new PdfMetaData();
    pdfMetaData.setCreatedDate(reportDate.toInstant());
    pdfMetaData.setDescription(reportData.inspection().title());
    String filename = reportData.reportInfo().filename();
    Pdf pdf = FileFactory.createPdfWithMetaData(filename, bytes, pdfMetaData);

    report.setReportFile(pdf);
  }

  /**
   * Tries to create a follow-up inspection based on a preceding inspection. Returns null if no
   * automatic follow-up can be determined (e.g., missing interval).
   */
  public Inspection createFollowupInspectionIfApplicable(Inspection precedingInspection) {
    Inspection followupInspection = new Inspection();
    followupInspection.setModifiedBy(precedingInspection.getModifiedBy());
    followupInspection.setPhase(InspectionPhase.NEW);
    followupInspection.setProcedureType(ProcedureType.INSPECTION);
    followupInspection.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    followupInspection.setFileNumberSuffix(precedingInspection.getFileNumberSuffix());

    // create a new "sachstand" for the followup inspection
    UUID newFacilityFileState =
        facilityClient.createNewFacilityFileState(precedingInspection.getCentralFileStateId());
    InspectionRelatedFacility relatedFacility = new InspectionRelatedFacility();
    relatedFacility.setFacility(precedingInspection.getFacility());
    relatedFacility.setFacilityType(precedingInspection.getRelatedFacility().getFacilityType());
    relatedFacility.setCentralFileStateId(newFacilityFileState);
    followupInspection.addRelatedFacility(relatedFacility);

    // determine followupType
    FollowupType followupType = precedingInspection.getFollowupType();
    InspectionType type;
    if (followupType != null) {
      type = followupType.asInspectionType;
    } else {
      if (InspectionResult.SUCCESSFUL_WITH_INCIDENTS.equals(precedingInspection.getResult())) {
        type = InspectionType.REGULAR_AFTER_INCIDENTS;
      } else if (InspectionResult.FAILED.equals(precedingInspection.getResult())) {
        type = InspectionType.REVIEW;
      } else {
        type = InspectionType.REGULAR;
      }
    }
    followupInspection.setType(type);

    // determine followup appointment
    InspectionAppointment followupAppointment =
        computeFollowupAppointment(precedingInspection, type);

    if (inspectionFeatureToggle.isNewFeatureDisabled(InspectionFeature.OBJECT_TYPE_HIERARCHY)) {
      followupInspection.setPlannedAppointment(followupAppointment);
    }

    if (followupAppointment != null) {
      if (inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.OBJECT_TYPE_HIERARCHY)) {
        // set planned appointment only when it could be computed
        followupInspection.setPlannedAppointment(followupAppointment);
      }

      // create calendar event for followup appointment
      UUID calenderEventId =
          calendarClient.createEventInUserCalendar(
              followupAppointment.getAppointmentStart(), followupAppointment.getAppointmentEnd());
      followupInspection.setCalendarEventId(calenderEventId);
    } else {
      if (inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.OBJECT_TYPE_HIERARCHY)) {
        // If no appointment is computable, do not create a follow-up inspection
        return null;
      }
    }

    // copy checklists
    if (precedingInspection.getFollowupType() != null
        ||
        // Also copy checklist if last inspection failed and a new one is created
        precedingInspection.getResult().equals(InspectionResult.FAILED)
            && followupInspection.getType().equals(InspectionType.REVIEW)) {
      followupInspection.addChecklists(
          precedingInspection.getChecklists().stream().map(Checklist::getCopy).toList());

      List<ChecklistElement> oldChecklistsElementList =
          precedingInspection.getChecklists().stream()
              .filter(Objects::nonNull)
              .flatMap(c -> c.getSections().stream())
              .filter(Objects::nonNull)
              .flatMap(s -> s.getElements().stream())
              .filter(Objects::nonNull)
              .toList();

      List<ChecklistElement> newChecklistsElementList =
          followupInspection.getChecklists().stream()
              .filter(Objects::nonNull)
              .flatMap(c -> c.getSections().stream())
              .filter(Objects::nonNull)
              .flatMap(s -> s.getElements().stream())
              .filter(Objects::nonNull)
              .toList();

      Map<UUID, ChecklistElement> checklistElementCopyMap = new HashMap<>();
      for (int i = 0; i < oldChecklistsElementList.size(); i++) {
        checklistElementCopyMap.put(
            oldChecklistsElementList.get(i).getId(), newChecklistsElementList.get(i));
      }

      followupInspection.addIncidents(
          precedingInspection.getIncidents().stream()
              .map(incident -> incident.getCopy(checklistElementCopyMap))
              .toList());
    }

    followupInspection = inspectionRepository.saveAndFlush(followupInspection);

    return followupInspection;
  }

  private InspectionAppointment
      computeFollowupAppointment( // originally static -> removed for feature toggle
      Inspection precedingInspection, InspectionType followupInspectionType) {
    if (precedingInspection.getResult().equals(InspectionResult.FAILED)) {
      return null;
    }
    ObjectType objectType = precedingInspection.getRelatedFacility().getFacility().getObjectType();
    Instant followupStartDate;
    if (precedingInspection.getFollowupDate() != null) {
      followupStartDate = precedingInspection.getFollowupDate();
    } else {
      Integer interval;
      if (inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.OBJECT_TYPE_HIERARCHY)) {
        if (followupInspectionType == InspectionType.REGULAR_AFTER_INCIDENTS) {
          interval = objectType.getComplaintInterval();
        } else {
          interval = objectType.getRoutineInterval();
        }

        if (interval == null) {
          // No interval configured for the chosen follow-up type => no automatic follow-up
          // appointment
          return null;
        }
      } else {
        interval =
            (followupInspectionType == InspectionType.REGULAR_AFTER_INCIDENTS)
                ? objectType.getComplaintInterval()
                : objectType.getRoutineInterval();
      }

      Instant previousAppointmentStart =
          precedingInspection.getExecutionAppointment().getAppointmentStart();
      followupStartDate = previousAppointmentStart.plus(interval, ChronoUnit.DAYS);
    }

    Instant followupEndDate =
        followupStartDate.plus(objectType.getStandardDuration(), ChronoUnit.HOURS);
    InspectionAppointment appointment = new InspectionAppointment();
    appointment.setAppointmentStart(followupStartDate);
    appointment.setAppointmentEnd(followupEndDate);

    return appointment;
  }

  public ResponseEntity<Resource> downloadReport(UUID reportId) {
    Inspection inspection =
        inspectionRepository
            .findByReportId(reportId)
            .orElseThrow(() -> new NotFoundException("inspection not found for given reportId"));
    if (inspection.getPhase().ordinal() < InspectionPhase.CREATING_REPORT_AND_INVOICE.ordinal()) {
      throw new BadRequestException(
          "wrong phase; expected: "
              + InspectionPhase.CREATING_REPORT_AND_INVOICE
              + " or higher; actual: "
              + inspection.getPhase());
    }
    if (inspection.getReport() == null) {
      throw new BadRequestException("no report available for reportId: " + reportId);
    }
    if (inspection.getReport().getReportFile() != null) {
      return downloadReportFromDB(inspection);
    } else {
      return downloadReportCreatedOnTheFly(inspection);
    }
  }

  private ResponseEntity<Resource> downloadReportFromDB(Inspection inspection) {
    Pdf reportFile = inspection.getReport().getReportFile();
    String filename = reportFile.getFileName();
    byte[] bytes = reportFile.getFileContent().getContent();
    ByteArrayResource resource = new ByteArrayResource(bytes);
    return response(resource, filename);
  }

  private ResponseEntity<Resource> downloadReportCreatedOnTheFly(Inspection inspection) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ZonedDateTime now = ZonedDateTime.now(clock);
    RepData reportData = inspectionReportBuilder.createReport(inspection, now, baos);
    String filename = reportData.reportInfo().filename();
    ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());
    return response(resource, filename);
  }

  private static ResponseEntity<Resource> response(ByteArrayResource resource, String filename) {
    ContentDisposition contentDisposition =
        ContentDisposition.attachment().filename(filename, UTF_8).build();
    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_PDF)
        .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
        .body(resource);
  }
}
