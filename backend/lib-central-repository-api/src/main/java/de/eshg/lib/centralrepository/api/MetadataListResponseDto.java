/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.centralrepository.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.List;

@Schema(name = "MetadataListResponse")
public record MetadataListResponseDto(@Valid List<MetadataResponseDto> items) {}
