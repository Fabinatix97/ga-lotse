/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "FinalizeInspectionRequest")
public record FinalizeInspectionRequest(String signer) {}
