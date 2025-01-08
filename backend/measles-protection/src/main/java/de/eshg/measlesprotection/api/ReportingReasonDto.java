/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "ReportingReason",
    description =
        "Indicates the reason why the person was reported to the health care departement by the facility.")
public enum ReportingReasonDto {
  NO_PROOF,
  FIRST_VACCINE,
  MEDICAL_CONTRAINDICATION,
  UNASSESSABLE_PROOF,
  OTHER
}
