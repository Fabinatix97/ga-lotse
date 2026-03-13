/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import static de.eshg.config.HashUtil.hashOf;

import de.eshg.config.domain.AbstractOpeningHours;
import de.eshg.config.domain.DepartmentInfo;
import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.rest.service.i18n.Language;
import java.util.LinkedHashMap;
import java.util.SequencedMap;
import java.util.function.BiFunction;

public class ConfigAuditLogMapper {

  private ConfigAuditLogMapper() {}

  public static SequencedMap<String, String> getRelevantFieldsForLogging(
      MultiLangDocument document) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    if (document != null) {
      final BiFunction<String, Language, Void> putLanguage =
          (String languageTag, Language language) -> {
            relevantFields.put(
                languageTag,
                document.get(language) == null
                    ? null
                    : hashOf(document.get(language).getContent()));

            return null;
          };

      relevantFields.put("de", hashOf(document.get(Language.GERMAN).getContent()));
      putLanguage.apply(Language.ENGLISH_LANGUAGE_TAG, Language.ENGLISH);
      putLanguage.apply(Language.SPANISH_LANGUAGE_TAG, Language.SPANISH);
      putLanguage.apply(Language.TURKISH_LANGUAGE_TAG, Language.TURKISH);
      putLanguage.apply(Language.RUSSIAN_LANGUAGE_TAG, Language.RUSSIAN);
      putLanguage.apply(Language.ARABIC_LANGUAGE_TAG, Language.ARABIC);
      putLanguage.apply(Language.FRENCH_LANGUAGE_TAG, Language.FRENCH);
      putLanguage.apply(Language.ITALIAN_LANGUAGE_TAG, Language.ITALIAN);
      putLanguage.apply(Language.POLISH_LANGUAGE_TAG, Language.POLISH);
      putLanguage.apply(Language.ROMANIAN_LANGUAGE_TAG, Language.ROMANIAN);
      putLanguage.apply(Language.UKRAINIAN_LANGUAGE_TAG, Language.UKRAINIAN);
      putLanguage.apply(Language.CROATIAN_LANGUAGE_TAG, Language.CROATIAN);
      putLanguage.apply(Language.FARSI_LANGUAGE_TAG, Language.FARSI);
      putLanguage.apply(Language.DARI_LANGUAGE_TAG, Language.DARI);
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
      AbstractOpeningHours openingHours) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    for (Language language : Language.values()) {
      final var openingHoursForLanguage = openingHours.get(language);
      if (openingHoursForLanguage != null) {
        for (int i = 0; i < openingHoursForLanguage.size(); i++) {
          relevantFields.put(
              language.getLocale().getLanguage().toLowerCase() + "[" + i + "]",
              openingHoursForLanguage.get(i));
        }
      }
    }
    return relevantFields;
  }
}
