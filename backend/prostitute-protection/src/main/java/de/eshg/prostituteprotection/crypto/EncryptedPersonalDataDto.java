/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.crypto;

public record EncryptedPersonalDataDto(byte[] hashedPersonIdentifier, byte[] data, byte[] nonce) {}
