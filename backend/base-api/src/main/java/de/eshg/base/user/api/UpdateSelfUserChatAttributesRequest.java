/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.Schema;

public record UpdateSelfUserChatAttributesRequest(
    @Schema(
            description =
                "Secret value used as a part of derive key used to encrypt user's local crypto store containing KeyBackup",
            example = "915685ed-b66a-47eb-b6ca-5da7a05ca041")
        String chatCryptoStoreDeriveKeySecret,
    @Schema(
            description = "Matrix User ID (MXID) of the gematik TI-Messenger (matrix chat)",
            example = "@username:matrix_homeserver_url")
        String externalChatUsername) {}
