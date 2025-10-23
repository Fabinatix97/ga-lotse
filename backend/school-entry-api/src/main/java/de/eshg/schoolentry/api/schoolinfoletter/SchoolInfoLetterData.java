/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import de.eshg.schoolentry.api.pdf.Address;

public record SchoolInfoLetterData(
    String date,
    DepartmentLogo departmentLogo,
    Address office,
    Address school,
    SchoolInfoLetterExaminationDto examination) {}
