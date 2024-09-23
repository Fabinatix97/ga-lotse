/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.pdf;

/** Data for the inspection report "inspection-report.ftlx". */
public record RepInspection(
    String title, String objectType, String executingPerson, RepContent content) {}
