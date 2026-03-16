/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import de.eshg.schoolentry.api.pdf.Address;
import de.eshg.schoolentry.api.pdf.EmployeeInfoDto;

public record SchoolInfoLetterData(
    String date,
    DepartmentLogo departmentLogo,
    Address office,
    EmployeeInfoDto employeeInfo,
    Address school,
    SchoolInfoLetterExaminationDto examination) {}
