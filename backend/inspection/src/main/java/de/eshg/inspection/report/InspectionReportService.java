/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report;

import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.report.mapper.ChecklistReportMapper;
import de.eshg.inspection.report.mapper.IncidentReportMapper;
import de.eshg.inspection.report.persistence.InspectionReportElementRepository;
import de.eshg.inspection.report.persistence.InspectionReportRepository;
import de.eshg.inspection.report.persistence.InspectionSignature;
import de.eshg.inspection.report.persistence.Report;
import de.eshg.inspection.report.persistence.element.ReportElement;
import de.eshg.inspection.report.persistence.element.ReportElementAnswer;
import de.eshg.inspection.report.persistence.element.ReportElementFullTextBlock;
import de.eshg.inspection.report.persistence.element.ReportElementQA;
import de.eshg.inspection.report.persistence.element.ReportElementText;
import de.eshg.inspection.report.persistence.element.ReportElementTextBlock;
import de.eshg.lib.editor.api.model.MoveOperation;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class InspectionReportService {

  private static final Logger log = LoggerFactory.getLogger(InspectionReportService.class);

  private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy");

  private final InspectionReportRepository inspectionReportRepository;
  private final InspectionReportElementRepository inspectionReportElementRepository;
  private final UserHelper userHelper;
  private final Clock clock;

  public InspectionReportService(
      InspectionReportRepository inspectionReportRepository,
      InspectionReportElementRepository inspectionReportElementRepository,
      UserHelper userHelper,
      Clock clock) {
    this.inspectionReportRepository = inspectionReportRepository;
    this.inspectionReportElementRepository = inspectionReportElementRepository;
    this.userHelper = userHelper;
    this.clock = clock;
  }

  public Report loadReport(UUID reportId) {
    return inspectionReportRepository
        .findById(reportId)
        .map(Report::validateSignature)
        .orElseThrow(() -> new NotFoundException("Report not found"));
  }

  /**
   * creates the report and attaches it to the inspection.
   *
   * @return the created report
   */
  public Report createReport(Inspection inspection, InspectionSignature signature) {
    Report report = new Report();
    report.setSignature(signature);
    report.setInspection(inspection);
    inspection.setReport(report);

    ChecklistReportMapper.addTopLevelTitle(report);
    addInitialParticipants(report, inspection);
    addDateOfInspection(report, inspection, clock);

    for (Checklist checklist : inspection.getChecklists()) {
      ChecklistReportMapper.addChecklist(report, checklist);
    }

    IncidentReportMapper.addIncidents(report, inspection.getIncidents());

    // renumber all elements
    List<ReportElement> reportElements = report.getReportElements();
    adjustPosition(reportElements, 0);

    // flush to enforce creation of UUIDs
    return inspectionReportRepository.saveAndFlush(report);
  }

  public static void addDateOfInspection(Report report, Inspection inspection, Clock clock) {
    Instant appointmentEnd = inspection.getExecutionAppointment().getAppointmentEnd();
    ChecklistReportMapper.addTextBlock(
        report,
        "Datum der Begehung",
        appointmentEnd.atZone(clock.getZone()).format(DATE_FORMAT),
        false,
        false);
  }

  private void addInitialParticipants(Report report, Inspection inspection) {
    StringBuilder participants = new StringBuilder();
    if (report.getSignature() != null) {
      participants.append(report.getSignature().getSigner());
    }

    UUID assigneeId = inspection.getExecutionTaskOrThrow().getAssigneeId();
    Map<UUID, UserHelper.UserFirstAndLastName> inspectionEmployee =
        userHelper.resolveUsersFirstNamesAndLastNamesByUserUuids(List.of(assigneeId));
    if (inspectionEmployee.containsKey(assigneeId)) {
      participants
          .append('\n')
          .append(inspectionEmployee.get(assigneeId).asFullName())
          .append(", Sachbearbeiter:in");
    } else {
      log.error("Could not resolve assignee while determining participants");
    }

    if (!participants.isEmpty()) {
      ChecklistReportMapper.addTextBlock(
          report, "Beteiligte Personen", participants.toString(), false, true);
    }
  }

  public ReportElement insertReportElement(
      UUID editorId, ReportElement reportElement, Integer insertAfter) {
    Report report = loadReport(editorId);
    List<ReportElement> reportElements = report.getReportElements();
    int pos;
    if (insertAfter == null) {
      // add at end
      reportElements.add(reportElement);
      pos = reportElements.size() - 1;
    } else {
      // insert after position `insertAfter`
      if (insertAfter < 0 || insertAfter >= report.getReportElements().size()) {
        throw new BadRequestException("insertAfter out of range: " + insertAfter);
      }
      pos = insertAfter + 1;
      reportElements.add(pos, reportElement);
    }
    // adjust positions
    adjustPosition(reportElements, pos);
    // ensure that child elements are properly persisted
    inspectionReportElementRepository.saveAndFlush(reportElement);
    // save to enforce creation of new ids
    report = inspectionReportRepository.saveAndFlush(report);
    return report.getReportElements().get(pos);
  }

  public ReportElement updateReportElement(
      UUID reportId,
      UUID elementId,
      UUID answerId,
      String title,
      String text,
      MoveOperation moveOperation) {
    Report report = loadReport(reportId);
    ReportElement element = getReportElement(report, elementId);

    if (title != null || text != null) {
      element = updateReportElementText(element, answerId, title, text);
    }
    if (moveOperation != null) {
      element = moveReportElement(report, element, moveOperation);
    }
    return element;
  }

  private ReportElement updateReportElementText(
      ReportElement reportElement, UUID answerId, String title, String text) {

    if (!reportElement.isEditable()) {
      throw new BadRequestException("Element is not editable");
    }

    ReportElement updatedElement =
        switch (reportElement.getType()) {
          case TEXT -> updateText((ReportElementText) reportElement, text);
          case TEXT_BLOCK -> updateTextBlock((ReportElementTextBlock) reportElement, text);
          case FULL_TEXT_BLOCK ->
              updateFullTextBlock((ReportElementFullTextBlock) reportElement, title, text);
          case QUESTION_AND_ANSWERS ->
              updateAnswer((ReportElementQA) reportElement, answerId, text);
          default ->
              throw new BadRequestException("Unsupported element type: " + reportElement.getType());
        };
    return inspectionReportElementRepository.saveAndFlush(updatedElement);
  }

  private ReportElement updateText(ReportElementText reportElement, String text) {
    reportElement.setText(text);
    return reportElement;
  }

  private ReportElement updateTextBlock(ReportElementTextBlock reportElement, String text) {
    reportElement.setText(text);
    return reportElement;
  }

  private ReportElement updateFullTextBlock(
      ReportElementFullTextBlock reportElement, String title, String text) {
    reportElement.setTitle(title);
    reportElement.setText(text);
    return reportElement;
  }

  private ReportElement updateAnswer(ReportElementQA reportElement, UUID answerId, String text) {
    ReportElementAnswer answer =
        reportElement.getAnswers().stream()
            .filter(answerElement -> answerElement.getExternalId().equals(answerId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Answer not found"));
    answer.setExtraText(text);
    return reportElement;
  }

  private ReportElement moveReportElement(
      Report report, ReportElement reportElement, MoveOperation moveOperation) {

    if (!reportElement.isMoveable()) {
      throw new BadRequestException("Element is not moveable");
    }

    int oldPosition = reportElement.getPosition();

    if (moveOperation == MoveOperation.UP) {
      switchPosition(report, reportElement, oldPosition, oldPosition - 1);
    } else if (moveOperation == MoveOperation.DOWN) {
      switchPosition(report, reportElement, oldPosition, oldPosition + 1);
    } else {
      throw new UnsupportedOperationException("Move operation not supported");
    }

    return inspectionReportElementRepository.saveAndFlush(reportElement);
  }

  public void deleteReportElement(UUID reportId, UUID elementId) {
    Report report = loadReport(reportId);
    ReportElement reportElement = getReportElement(report, elementId);

    if (!reportElement.isDeletable()) {
      throw new BadRequestException("Element is not deletable");
    }
    List<ReportElement> reportElements = report.getReportElements();
    int deletedPosition = reportElement.getPosition();
    reportElements.remove(deletedPosition);
    adjustPosition(reportElements, deletedPosition);
  }

  public static void adjustPositions(Report report) {
    adjustPosition(report.getReportElements(), 0);
  }

  private static void adjustPosition(List<ReportElement> reportElements, int fromPosition) {
    for (int i = fromPosition; i < reportElements.size(); i++) {
      reportElements.get(i).setPosition(i);
    }
  }

  private ReportElement switchPosition(
      Report report, ReportElement reportElement, int oldPosition, int switchPosition) {
    ReportElement switchElement = getReportElementByPosition(report, switchPosition);
    switchElement.setPosition(oldPosition);
    reportElement.setPosition(switchPosition);
    return inspectionReportElementRepository.saveAndFlush(switchElement);
  }

  private static ReportElement getReportElementByPosition(Report report, int position) {
    return report.getReportElements().stream()
        .filter(el -> position == el.getPosition())
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Element not found by position"));
  }

  private static ReportElement getReportElement(Report report, UUID elementId) {
    return report.getReportElements().stream()
        .filter(el -> el.getExternalId().equals(elementId))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Element not found"));
  }
}
