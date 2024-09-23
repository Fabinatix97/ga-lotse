/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.centralrepository.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;

@Schema(name = "MetadataRequest")
public record MetadataRequestDto(
    @NotBlank String category,
    @NotBlank String name,
    // using @NotBlank with ^((?!,).)*$ leads to non-deterministic behavior: sometimes the violation
    // is from the @Pattern and sometimes "must not be blank" - possibly a bug in the validator?
    List<
            @Pattern(regexp = "^(?!\\s*$)[^,]+$", message = "must not be blank or contain commas")
            String>
        tags,
    String description,
    String changeLog,
    String contact) {}
