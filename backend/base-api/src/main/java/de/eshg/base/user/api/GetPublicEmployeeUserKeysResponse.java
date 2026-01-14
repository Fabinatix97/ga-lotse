/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(
    description =
"""
Contains the details on the public keys from users which have the right to decrypt audit log files
""")
public record GetPublicEmployeeUserKeysResponse(
    @NotNull @Valid List<PublicEmployeeUserKeyDto> publicUserKeys) {}
