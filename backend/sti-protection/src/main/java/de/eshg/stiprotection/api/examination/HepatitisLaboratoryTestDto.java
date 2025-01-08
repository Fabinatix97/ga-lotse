/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "HepatitisLaboratoryTest")
public record HepatitisLaboratoryTestDto(
    Boolean infection, Boolean vaccineTitre, String value, String remark) {}
