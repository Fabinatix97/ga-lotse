/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.api.CitizenAndEmployeeMarkdownInfo;
import de.eshg.base.config.api.InternationalMarkdownInfo;
import de.eshg.base.config.api.MarkdownInfo;
import de.eshg.base.department.CitizenPortalMarkdownName;
import de.eshg.base.department.EmployeePortalMarkdownName;
import de.eshg.base.department.LanguageDto;
import de.eshg.base.department.MarkdownName;
import de.eshg.config.domain.MultiLangDocument;

public class MarkdownMapper {

  private MarkdownMapper() {}

  public static CitizenAndEmployeeMarkdownInfo mapToAccessibilityInfo(
      DepartmentConfiguration config) {
    if (config.isAccessibilityStatementMarkdownsInitialized()) {
      return new CitizenAndEmployeeMarkdownInfo(
          mapToInternationalMarkdownInfo(
              config.getCitizenPortalAccessibilityStatementMarkdown(),
              CitizenPortalMarkdownName.ACCESSIBILITY),
          mapToInternationalMarkdownInfo(
              config.getEmployeePortalAccessibilityStatementMarkdown(),
              EmployeePortalMarkdownName.ACCESSIBILITY));
    } else {
      return null;
    }
  }

  public static InternationalMarkdownInfo mapToAcknowledgementInfo(DepartmentConfiguration config) {
    if (config.isAcknowledgementsMarkdownsInitialized()) {
      return mapToInternationalMarkdownInfo(
          config.getAcknowledgementsMarkdown(), CitizenPortalMarkdownName.ACKNOWLEDGEMENTS);
    } else {
      return null;
    }
  }

  public static InternationalMarkdownInfo mapToContactInfo(DepartmentConfiguration config) {
    if (config.isContactMarkdownsInitialized()) {
      return mapToInternationalMarkdownInfo(
          config.getContactMarkdown(), EmployeePortalMarkdownName.CONTACT);
    } else {
      return null;
    }
  }

  public static InternationalMarkdownInfo mapToImprintInfo(DepartmentConfiguration config) {
    if (config.isImprintMarkdownsInitialized()) {
      return mapToInternationalMarkdownInfo(
          config.getImprintMarkdown(), CitizenPortalMarkdownName.IMPRINT);
    } else {
      return null;
    }
  }

  public static CitizenAndEmployeeMarkdownInfo mapToPrivacyInfo(DepartmentConfiguration config) {
    if (config.isPrivacyPolicyMarkdownsInitialized()) {
      return new CitizenAndEmployeeMarkdownInfo(
          mapToInternationalMarkdownInfo(
              config.getCitizenPortalPrivacyPolicyMarkdown(), CitizenPortalMarkdownName.PRIVACY),
          mapToInternationalMarkdownInfo(
              config.getEmployeePortalPrivacyPolicyMarkdown(), EmployeePortalMarkdownName.PRIVACY));
    } else {
      return null;
    }
  }

  public static String mapToFileName(MarkdownName markdownName, LanguageDto language) {
    return markdownName.fileNameRoot() + language.fileNameSuffix() + ".md";
  }

  private static InternationalMarkdownInfo mapToInternationalMarkdownInfo(
      MultiLangDocument document, MarkdownName markdownName) {
    return new InternationalMarkdownInfo(
        mapToGermanMarkdownInfo(document, markdownName),
        mapToEnglishMarkdownInfo(document, markdownName));
  }

  private static MarkdownInfo mapToGermanMarkdownInfo(
      MultiLangDocument document, MarkdownName markdownName) {
    return new MarkdownInfo(
        mapToFileName(markdownName, LanguageDto.GERMAN), document.getDeFileSizeBytes());
  }

  private static MarkdownInfo mapToEnglishMarkdownInfo(
      MultiLangDocument document, MarkdownName markdownName) {
    if (document.getEnFileSizeBytes() == null) {
      return null;
    } else {
      return new MarkdownInfo(
          mapToFileName(markdownName, LanguageDto.ENGLISH), document.getEnFileSizeBytes());
    }
  }
}
