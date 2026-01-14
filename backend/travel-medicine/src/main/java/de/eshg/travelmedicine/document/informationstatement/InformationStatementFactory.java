/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.informationstatement;

import de.eshg.travelmedicine.document.TemplateToDocumentMapper;
import de.eshg.travelmedicine.document.informationstatement.persistence.entity.InformationStatement;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplate;
import org.springframework.stereotype.Component;

@Component
public class InformationStatementFactory {

  private final TemplateToDocumentMapper templateToDocumentMapper;

  public InformationStatementFactory(TemplateToDocumentMapper templateToDocumentMapper) {
    this.templateToDocumentMapper = templateToDocumentMapper;
  }

  public InformationStatement createInformationStatement(InformationStatementTemplate template) {
    String documentContent = templateToDocumentMapper.transferContent(template.getContent());
    InformationStatement informationStatement = new InformationStatement();
    informationStatement.setTitle(template.getTitle());
    informationStatement.setContent(documentContent);
    return informationStatement;
  }
}
