/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.medicalreport;

import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.schoolentry.api.pdf.Address;
import de.eshg.schoolentry.api.pdf.EmployeeInfoDto;

public record MedicalReportData(
    DepartmentLogo departmentLogo,
    Address office,
    EmployeeInfoDto employeeInfo,
    MedicalReportChild child,
    String remark,
    Boolean isVisio) {}
