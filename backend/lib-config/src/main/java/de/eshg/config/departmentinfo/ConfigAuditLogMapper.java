/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import static de.eshg.config.HashUtil.hashOf;

import de.eshg.config.domain.DepartmentInfo;
import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.SequencedMap;

public class ConfigAuditLogMapper {

  private ConfigAuditLogMapper() {}

  public static SequencedMap<String, String> getRelevantFieldsForLogging(
      MultiLangDocument document) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    if (document != null) {
      relevantFields.put("de", hashOf(document.getDe().getContent()));
      relevantFields.put(
          "en", document.getEn() == null ? null : hashOf(document.getEn().getContent()));
    }
    return relevantFields;
  }

  public static SequencedMap<String, String> getRelevantFieldsForLogging(
      Document streetDirectory, Document municipalityDirectory) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    relevantFields.put("streetDirectory", hashOf(streetDirectory.getContent()));
    relevantFields.put("municipalityDirectory", hashOf(municipalityDirectory.getContent()));
    return relevantFields;
  }

  static SequencedMap<String, String> getRelevantFieldsForLogging(DepartmentInfo departmentInfo) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    if (departmentInfo != null) {
      relevantFields.put("name", departmentInfo.getName());
      relevantFields.put("abbreviation", departmentInfo.getAbbreviation());
      relevantFields.put("street", departmentInfo.getStreet());
      relevantFields.put("houseNumber", departmentInfo.getHouseNumber());
      relevantFields.put("postalCode", departmentInfo.getPostalCode());
      relevantFields.put("city", departmentInfo.getCity());
      relevantFields.put("country", departmentInfo.getCountry().name());
      relevantFields.put("phoneNumber", departmentInfo.getPhoneNumber());
      relevantFields.put("homepage", departmentInfo.getHomepage());
      relevantFields.put("email", departmentInfo.getEmail());
      relevantFields.put("latitude", Double.toString(departmentInfo.getLatitude()));
      relevantFields.put("longitude", Double.toString(departmentInfo.getLongitude()));
    }
    return relevantFields;
  }

  static SequencedMap<String, String> getRelevantFieldsForLogging(
      List<String> de, List<String> en) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    for (int i = 0; i < de.size(); i++) {
      relevantFields.put("de[" + i + "]", de.get(i));
    }
    for (int i = 0; i < en.size(); i++) {
      relevantFields.put("en[" + i + "]", en.get(i));
    }
    return relevantFields;
  }
}
