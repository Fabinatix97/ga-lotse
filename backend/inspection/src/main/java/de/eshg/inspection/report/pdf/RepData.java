/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.pdf;

import de.eshg.lib.document.generator.department.DepartmentLogo;

/** Data for the inspection report "inspection-report.ftlx". */
public record RepData(
    DepartmentLogo departmentLogo,
    RepAddress office,
    RepFacility facility,
    RepInspection inspection,
    RepInfo reportInfo) {}
