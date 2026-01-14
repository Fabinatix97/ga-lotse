/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.pdf.identification;

import de.eshg.lib.document.generator.department.DepartmentLogo;

public record DocumentSender(
    Department department,
    String documentDate,
    DepartmentLogo departmentLogo,
    String referenceNumber) {

  public DocumentSender(Department department, String documentDate, DepartmentLogo departmentLogo) {
    this(department, documentDate, departmentLogo, null);
  }
}
