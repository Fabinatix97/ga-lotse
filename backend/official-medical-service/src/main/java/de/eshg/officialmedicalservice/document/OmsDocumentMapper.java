/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.document;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.officialmedicalservice.document.api.DocumentDto;
import de.eshg.officialmedicalservice.document.api.DocumentStatusDto;
import de.eshg.officialmedicalservice.document.api.DocumentUploadedByDto;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocument;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocumentStatus;
import de.eshg.officialmedicalservice.file.OmsFileMapper;
import de.eshg.rest.service.i18n.Language;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class OmsDocumentMapper {
  private final OmsFileMapper omsFileMapper;

  public OmsDocumentMapper(OmsFileMapper omsFileMapper) {
    this.omsFileMapper = omsFileMapper;
  }

  public List<DocumentDto> toInterfaceType(List<OmsDocument> documentList) {
    if (documentList == null) {
      return Collections.emptyList();
    }
    return documentList.stream()
        .sorted(
            (doc1, doc2) ->
                doc1.getDocumentType(Language.GERMAN)
                    .compareToIgnoreCase(doc2.getDocumentType(Language.GERMAN)))
        .map(this::toInterfaceType)
        .toList();
  }

  public DocumentDto toInterfaceType(OmsDocument document) {
    if (document == null) {
      return null;
    }
    return new DocumentDto(
        document.getId(),
        Arrays.stream(Language.values())
            .collect(StreamUtil.toLinkedHashMap(l -> l, document::getDocumentType)),
        Arrays.stream(Language.values())
            .collect(StreamUtil.toLinkedHashMap(l -> l, document::getHelpText)),
        toInterfaceType(document.getDocumentStatus()),
        document.getLastDocumentUpload(),
        omsFileMapper.toInterfaceType(document.getFiles()),
        document.getNote(),
        document.isMandatoryDocument(),
        document.isUploadInCitizenPortal(),
        document.getReasonForRejection(),
        document.getUploadedBy() != null
            ? DocumentUploadedByDto.valueOf(document.getUploadedBy().name())
            : null,
        document.getLabCode());
  }

  public DocumentStatusDto toInterfaceType(OmsDocumentStatus documentStatus) {
    if (documentStatus == null) {
      return null;
    }
    return DocumentStatusDto.valueOf(documentStatus.name());
  }
}
