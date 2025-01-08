/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.medicalreport;

import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.schoolentry.pdf.Address;

public record MedicalReportData(
    DepartmentLogo departmentLogo,
    Address office,
    MedicalReportChild child,
    String remark,
    Boolean isVisio) {}
