/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.config;

import static de.eshg.config.HashUtil.hashOf;

import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import java.util.LinkedHashMap;
import java.util.SequencedMap;

public class OmsConfigAuditLogMapper {

  private OmsConfigAuditLogMapper() {}

  public static LinkedHashMap<String, String> getRelevantFieldsForLogging(
      IOmsConfiguration config) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();

    addRelevantFieldsOfDocument(relevantFields, "concerns", config.getConcerns());

    addRelevantFieldsOfMultiLangDoc(relevantFields, "landingContent", config.getLandingContent());

    addRelevantFieldsOfMultiLangDoc(
        relevantFields, "selectConcernInfobox", config.getSelectConcernInfobox());

    relevantFields.put(
        "keycloakUserCleanupJobOverdueDuration",
        Integer.toString(config.getKeycloakUserCleanupJobOverdueDuration()));
    relevantFields.put(
        "medicalOpinionCutOffDateLeadTime",
        Integer.toString(config.getMedicalOpinionCutOffDateLeadTime()));
    relevantFields.put(
        "citizenPortalAnamnesisEnabled",
        Boolean.toString(config.isCitizenPortalAnamnesisEnabled()));

    return relevantFields;
  }

  public static void addRelevantFieldsOfDocument(
      SequencedMap<String, String> relevantFields, String fieldKey, Document document) {
    if (document != null) {
      relevantFields.put(fieldKey, hashOf(document.getContent()));
    }
  }

  public static void addRelevantFieldsOfMultiLangDoc(
      SequencedMap<String, String> relevantFields,
      String fieldKey,
      MultiLangDocument multiLangDocument) {
    if (multiLangDocument != null) {
      addRelevantFieldsOfDocument(relevantFields, fieldKey + ".de", multiLangDocument.getDe());
      addRelevantFieldsOfDocument(relevantFields, fieldKey + ".en", multiLangDocument.getEn());
    }
  }
}
