/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "PartnerRiskFactors",
    description = "Known risk factors associated with a patient’s sexual partners.")
public enum PartnerRiskFactorDto {
  HOMOSEXUAL,
  BISEXUAL_MALE,
  HIV_POSITIVE,
  STI_POSITIVE,
  INJECTED_DRUGS,
  SEX_WORKER
}
