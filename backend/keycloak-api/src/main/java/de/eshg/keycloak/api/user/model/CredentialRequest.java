/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.api.user.model;

public record CredentialRequest(CredentialTypeDto type, String rawSecret) {}
