/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.informationstatementtemplate;

import de.eshg.lib.editor.EditorService;
import de.eshg.lib.editor.api.model.EditorDto;
import de.eshg.lib.editor.api.model.ModifyEditorElementResponse;
import de.eshg.lib.editor.api.model.MoveOperation;
import de.eshg.lib.editor.api.model.element.EditorElementDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeature;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class InformationStatementTemplateEditorService implements EditorService {

  private final InformationStatementTemplateService informationStatementTemplateService;
  private final TravelMedicineFeatureToggle featureToggle;

  public InformationStatementTemplateEditorService(
      InformationStatementTemplateService informationStatementTemplateService,
      TravelMedicineFeatureToggle featureToggle) {
    this.informationStatementTemplateService = informationStatementTemplateService;
    this.featureToggle = featureToggle;
  }

  @Override
  public EditorDto loadEditor(UUID templateId) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    return informationStatementTemplateService.loadEditor(templateId);
  }

  @Override
  public ModifyEditorElementResponse insertEditorElement(
      UUID templateId,
      EditorElementDto editorElementDto,
      Integer insertBefore,
      Integer insertAfter) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    if (insertBefore != null && insertAfter != null) {
      throw new BadRequestException("Both insertBefore and insertAfter cannot be set");
    }
    if (insertBefore != null) {
      throw new BadRequestException("InsertEditorRequest.insertBefore is not supported");
    }

    EditorElementDto element =
        informationStatementTemplateService.insertReportElement(
            templateId,
            InformationStatementTemplateEditorMapper.elementToReportElement(editorElementDto),
            insertAfter);
    return new ModifyEditorElementResponse(element);
  }

  @Override
  public ModifyEditorElementResponse updateEditorElement(
      UUID editorId,
      UUID elementId,
      UUID answerId,
      String title,
      String text,
      MoveOperation moveOperation) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    if ((title == null && text == null) && moveOperation == null) {
      throw new BadRequestException("one of moveOperation, title or text must be set");
    }
    EditorElementDto element =
        informationStatementTemplateService.updateReportElement(
            editorId, elementId, answerId, title, text, moveOperation);

    return new ModifyEditorElementResponse(element);
  }

  @Override
  public void deleteEditorElement(UUID editorId, UUID elementId) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    informationStatementTemplateService.deleteReportElement(editorId, elementId);
  }
}
