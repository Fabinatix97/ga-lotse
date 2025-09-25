/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.centralrepository.api;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;

@Schema(name = "MetadataRequest")
public record MetadataRequestDto(
    @Parameter @NotBlank(message = "category must not be blank") String category,
    @Parameter @NotBlank(message = "name must not be blank") String name,
    @Parameter
        List<
                @Pattern(
                    regexp = "^(?!\\s*$)[^,]+$",
                    message = "tags must not be blank or contain commas")
                String>
            tags,
    @Parameter String description,
    @Parameter String changeLog,
    @Parameter String contact) {}
