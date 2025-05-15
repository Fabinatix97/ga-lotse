/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import static de.eshg.config.HashUtil.hashOf;

import de.eshg.base.util.MapUtils;
import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import java.util.LinkedHashMap;
import java.util.SequencedMap;

public class OpenDataConfigAuditLogMapper {

  private OpenDataConfigAuditLogMapper() {}

  static LinkedHashMap<String, String> getRelevantFieldsForLogging(OpenDataConfiguration config) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    relevantFields.put("author", config.getAuthor());
    relevantFields.put("fallbackLicenseUrl", config.getFallbackLicenseUrl());
    relevantFields.putAll(getRelevantFieldsForLogging(config.getTermsOfUse()));
    return relevantFields;
  }

  private static SequencedMap<String, String> getRelevantFieldsForLogging(
      MultiLangDocument termsOfUse) {
    if (termsOfUse == null) {
      return MapUtils.orderedMapOfEntries();
    }
    SequencedMap<String, String> relevantFields = new LinkedHashMap<>();
    relevantFields.put("termsOfUse.de", hashOf(termsOfUse.getDe().getContent()));
    Document en = termsOfUse.getEn();
    if (en != null) {
      relevantFields.put("termsOfUse.en", hashOf(en.getContent()));
    }
    return relevantFields;
  }
}
