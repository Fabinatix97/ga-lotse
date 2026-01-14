/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.pdf;

/** Data for the inspection report "inspection-report.ftlx". */
public record RepFacility(RepAddress address, String contactPerson, String fileNumber) {}
