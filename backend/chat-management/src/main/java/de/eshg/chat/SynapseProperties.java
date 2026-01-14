/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "eshg.synapse")
@Validated
public record SynapseProperties(
    @Valid SynapseInternal internal,
    Duration refreshClockSkew,
    @NotNull String registrationSharedSecret,
    @Valid SynapseAdmin admin) {

  public record SynapseInternal(@NotNull URI url) {}

  public record SynapseAdmin(@NotNull String name, @NotNull String password) {}
}
