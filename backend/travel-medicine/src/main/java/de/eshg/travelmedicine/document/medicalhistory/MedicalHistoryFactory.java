/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.medicalhistory;

import de.eshg.travelmedicine.document.TemplateToDocumentMapper;
import de.eshg.travelmedicine.document.medicalhistory.persistence.entity.MedicalHistory;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity.MedicalHistoryTemplate;
import org.springframework.stereotype.Component;

@Component
public class MedicalHistoryFactory {

  private final TemplateToDocumentMapper templateToDocumentMapper;

  public MedicalHistoryFactory(TemplateToDocumentMapper templateToDocumentMapper) {
    this.templateToDocumentMapper = templateToDocumentMapper;
  }

  public MedicalHistory createMedicalHistory(MedicalHistoryTemplate template) {
    String documentContent = templateToDocumentMapper.transferContent(template.getContent());
    MedicalHistory medicalHistory = new MedicalHistory();
    medicalHistory.setContent(documentContent);
    return medicalHistory;
  }
}
