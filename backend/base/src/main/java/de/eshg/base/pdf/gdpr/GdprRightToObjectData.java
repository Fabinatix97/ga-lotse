/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.pdf.gdpr;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.base.pdf.data.FieldSet;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import java.util.List;

public record GdprRightToObjectData(
    String date,
    DepartmentLogo departmentLogo,
    GetDepartmentInfoResponse department,
    String entityName,
    String entity,
    String matterOfConcern,
    List<FieldSet> datasets) {}
