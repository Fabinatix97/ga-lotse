/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.schoolentry.pdf.Address;

public record SchoolInfoLetterData(
    String date,
    DepartmentLogo departmentLogo,
    Address office,
    Address school,
    SchoolInfoLetterExaminationDto examination) {}
