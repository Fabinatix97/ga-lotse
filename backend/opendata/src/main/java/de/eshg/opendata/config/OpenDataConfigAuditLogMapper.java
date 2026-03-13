/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import static de.eshg.config.HashUtil.hashOf;

import de.eshg.base.util.MapUtils;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.rest.service.i18n.Language;
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
    for (Language language : Language.values()) {
      if (termsOfUse.get(language) != null) {
        relevantFields.put(
            "termsOfUse." + Language.LANGUAGE_TO_LANGUAGE_TAG.get(language),
            hashOf(termsOfUse.get(language).getContent()));
      }
    }
    return relevantFields;
  }
}
