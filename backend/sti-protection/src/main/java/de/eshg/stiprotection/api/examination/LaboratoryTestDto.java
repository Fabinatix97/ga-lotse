/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LaboratoryTest")
public record LaboratoryTestDto(Boolean result, String value, String remark) {}
