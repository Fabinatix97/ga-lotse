/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.informationstatement;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.travelmedicine.document.api.DocumentContentDto;

public class InformationStatementPdfParameters {
  private final GetDepartmentInfoResponse departmentInfo;
  private final DepartmentLogo departmentLogo;

  private final String firstName;
  private final String lastName;
  private final String dateOfBirth;

  private final String title;
  private final DocumentContentDto documentContent;

  private final String signatureCreatedAt;
  private final String signature;

  public InformationStatementPdfParameters(
      GetDepartmentInfoResponse departmentInfo,
      DepartmentLogo departmentLogo,
      String firstName,
      String lastName,
      String dateOfBirth,
      String title,
      DocumentContentDto documentContent,
      String signatureCreatedAt,
      String signature) {
    this.departmentInfo = departmentInfo;
    this.departmentLogo = departmentLogo;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.title = title;
    this.documentContent = documentContent;
    this.signatureCreatedAt = signatureCreatedAt;
    this.signature = signature;
  }

  public GetDepartmentInfoResponse getDepartmentInfo() {
    return departmentInfo;
  }

  public DepartmentLogo getDepartmentLogo() {
    return departmentLogo;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public String getDateOfBirth() {
    return dateOfBirth;
  }

  public String getTitle() {
    return title;
  }

  public DocumentContentDto getDocumentContent() {
    return documentContent;
  }

  public String getSignatureCreatedAt() {
    return signatureCreatedAt;
  }

  public String getSignature() {
    return signature;
  }

  public String getFileName() {
    return "aufklaerungsbogen-%s.pdf".formatted(getLastName().toLowerCase());
  }
}
