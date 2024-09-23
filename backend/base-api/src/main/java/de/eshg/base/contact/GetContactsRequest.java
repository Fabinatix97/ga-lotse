/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record GetContactsRequest(
    @ArraySchema(
            arraySchema =
                @Schema(
                    description = "A list of IDs of Contacts.",
                    example =
                        "['ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1','df384786-9f85-4404-a9fd-33391da2d2b4','8b93ac7d-a059-437a-9834-e12d1346d088']"))
        @NotNull
        @Size(min = 1)
        List<@NotNull UUID> ids) {}
