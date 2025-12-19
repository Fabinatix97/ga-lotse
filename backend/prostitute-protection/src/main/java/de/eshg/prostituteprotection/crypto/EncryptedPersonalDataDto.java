/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.crypto;

public record EncryptedPersonalDataDto(byte[] hashedPersonIdentifier, byte[] data, byte[] nonce) {}
