/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "PreviousIllness")
public record PreviousIllnessDto(
    Boolean hepA,
    Boolean hepB,
    Boolean hepC,
    Boolean hiv,
    Boolean syphilis,
    Boolean gonorrhea,
    Boolean chlamydia,
    Boolean other,
    String otherData) {}
