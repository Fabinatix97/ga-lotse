/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.editor;

import de.eshg.inspection.report.InspectionReportService;
import de.eshg.inspection.report.mapper.ReportEditorMapper;
import de.eshg.inspection.report.persistence.Report;
import de.eshg.inspection.report.persistence.element.ReportElement;
import de.eshg.lib.editor.EditorService;
import de.eshg.lib.editor.api.model.EditorDto;
import de.eshg.lib.editor.api.model.ModifyEditorElementResponse;
import de.eshg.lib.editor.api.model.MoveOperation;
import de.eshg.lib.editor.api.model.element.EditorElementDto;
import de.eshg.rest.service.error.BadRequestException;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class InspectionEditorService implements EditorService {

  private final InspectionReportService inspectionReportService;
  private final ReportEditorMapper reportEditorMapper;

  public InspectionEditorService(
      InspectionReportService inspectionReportService, ReportEditorMapper reportEditorMapper) {
    this.inspectionReportService = inspectionReportService;
    this.reportEditorMapper = reportEditorMapper;
  }

  /**
   * @param editorId inspection externalID
   * @return EditorDto - complete inspection report
   */
  @Override
  public EditorDto loadEditor(UUID editorId) {
    Report report = inspectionReportService.loadReport(editorId);
    return reportEditorMapper.reportToEditorDto(report);
  }

  @Override
  public ModifyEditorElementResponse insertEditorElement(
      UUID editorId, EditorElementDto editorElementDto, Integer insertBefore, Integer insertAfter) {
    if (insertBefore != null && insertAfter != null) {
      throw new BadRequestException("Both insertBefore and insertAfter cannot be set");
    }
    if (insertBefore != null) {
      throw new BadRequestException("InsertEditorRequest.insertBefore is not supported");
    }

    ReportElement reportElement =
        inspectionReportService.insertReportElement(
            editorId,
            ReportEditorMapper.editorElementToReportElement(editorElementDto),
            insertAfter);
    return new ModifyEditorElementResponse(
        reportEditorMapper.reportElementToEditorElementDto(reportElement));
  }

  @Override
  public ModifyEditorElementResponse updateEditorElement(
      UUID editorId,
      UUID elementId,
      UUID answerId,
      String title,
      String text,
      MoveOperation moveOperation) {
    if ((title == null && text == null) && moveOperation == null) {
      throw new BadRequestException("one of moveOperation, title or text must be set");
    }
    ReportElement element =
        inspectionReportService.updateReportElement(
            editorId, elementId, answerId, title, text, moveOperation);

    return new ModifyEditorElementResponse(
        reportEditorMapper.reportElementToEditorElementDto(element));
  }

  @Override
  public void deleteEditorElement(UUID editorId, UUID elementId) {
    inspectionReportService.deleteReportElement(editorId, elementId);
  }
}
