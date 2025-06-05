/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.api.CitizenAndEmployeeMarkdownInfoDto;
import de.eshg.base.department.CitizenPortalMarkdownName;
import de.eshg.base.department.EmployeePortalMarkdownName;
import de.eshg.config.api.MultiLangDocumentDto;
import de.eshg.config.mapper.MultiLangDocumentMapper;

public class MarkdownMapper {

  private MarkdownMapper() {}

  public static CitizenAndEmployeeMarkdownInfoDto mapToAccessibilityInfo(
      DepartmentConfiguration config) {
    if (config.isAccessibilityStatementMarkdownsInitialized()) {
      return new CitizenAndEmployeeMarkdownInfoDto(
          MultiLangDocumentMapper.mapToDto(
              config.getCitizenPortalAccessibilityStatementMarkdown(),
              CitizenPortalMarkdownName.ACCESSIBILITY.getFileName()),
          MultiLangDocumentMapper.mapToDto(
              config.getEmployeePortalAccessibilityStatementMarkdown(),
              EmployeePortalMarkdownName.ACCESSIBILITY.getFileName()));
    } else {
      return null;
    }
  }

  public static MultiLangDocumentDto mapToAcknowledgementInfo(DepartmentConfiguration config) {
    if (config.isAcknowledgementsMarkdownsInitialized()) {
      return MultiLangDocumentMapper.mapToDto(
          config.getAcknowledgementsMarkdown(),
          CitizenPortalMarkdownName.ACKNOWLEDGEMENTS.getFileName());
    } else {
      return null;
    }
  }

  public static MultiLangDocumentDto mapToContactInfo(DepartmentConfiguration config) {
    if (config.isContactMarkdownsInitialized()) {
      return MultiLangDocumentMapper.mapToDto(
          config.getContactMarkdown(), EmployeePortalMarkdownName.CONTACT.getFileName());
    } else {
      return null;
    }
  }

  public static MultiLangDocumentDto mapToImprintInfo(DepartmentConfiguration config) {
    if (config.isImprintMarkdownsInitialized()) {
      return MultiLangDocumentMapper.mapToDto(
          config.getImprintMarkdown(), CitizenPortalMarkdownName.IMPRINT.getFileName());
    } else {
      return null;
    }
  }

  public static CitizenAndEmployeeMarkdownInfoDto mapToPrivacyInfo(DepartmentConfiguration config) {
    if (config.isPrivacyPolicyMarkdownsInitialized()) {
      return new CitizenAndEmployeeMarkdownInfoDto(
          MultiLangDocumentMapper.mapToDto(
              config.getCitizenPortalPrivacyPolicyMarkdown(),
              CitizenPortalMarkdownName.PRIVACY.getFileName()),
          MultiLangDocumentMapper.mapToDto(
              config.getEmployeePortalPrivacyPolicyMarkdown(),
              EmployeePortalMarkdownName.PRIVACY.getFileName()));
    } else {
      return null;
    }
  }
}
