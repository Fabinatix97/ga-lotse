/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.crypto;

import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public final class SymmetricEncryption {

  public static final String KEY_ALGORITHM = "AES";
  private static final String AES_GCM_ALGORITHM = "AES_256/GCM/NoPadding";
  private static final int GCM_AUTHENTICATION_TAG_LENGTH_BITS = 128;
  private static final int GCM_INITIALIZATION_VECTOR_LENGTH_BITS = 96;
  public static final String VERSION = "1";

  private static final SecureRandom SECURE_RANDOM = new SecureRandom();

  private SymmetricEncryption() {}

  public static EncryptedPayload encrypt(byte[] input) throws GeneralSecurityException {
    byte[] ivBytes = createSecureRandomBytes(GCM_INITIALIZATION_VECTOR_LENGTH_BITS / 8);
    GCMParameterSpec ivParameterSpec = createGcmParameterSpecFromIv(ivBytes);

    SecretKey secretKey = KeyGenerator.getInstance(KEY_ALGORITHM).generateKey();
    byte[] keyBytes = secretKey.getEncoded();

    byte[] cipherTextBytes = encrypt(input, secretKey, ivParameterSpec);
    return new EncryptedPayload(cipherTextBytes, keyBytes, ivBytes);
  }

  private static GCMParameterSpec createGcmParameterSpecFromIv(byte[] ivBytes) {
    return new GCMParameterSpec(GCM_AUTHENTICATION_TAG_LENGTH_BITS, ivBytes);
  }

  private static byte[] createSecureRandomBytes(int numberOfBytes) {
    byte[] bytes = new byte[numberOfBytes];
    SECURE_RANDOM.nextBytes(bytes);
    return bytes;
  }

  private static byte[] encrypt(
      byte[] inputBytes, SecretKey secretKey, GCMParameterSpec gcmParameterSpec)
      throws GeneralSecurityException {
    Cipher cipher = Cipher.getInstance(AES_GCM_ALGORITHM);
    cipher.init(Cipher.ENCRYPT_MODE, secretKey, gcmParameterSpec);
    return cipher.doFinal(inputBytes);
  }

  public static byte[] decrypt(EncryptedPayload encryptedPayload) throws GeneralSecurityException {
    Cipher cipher = Cipher.getInstance(AES_GCM_ALGORITHM);
    byte[] key = encryptedPayload.key;
    SecretKey secretKey = new SecretKeySpec(key, KEY_ALGORITHM);
    GCMParameterSpec gcmParameterSpec = createGcmParameterSpecFromIv(encryptedPayload.iv);
    cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmParameterSpec);
    return cipher.doFinal(encryptedPayload.cipherText);
  }

  public record EncryptedPayload(byte[] cipherText, byte[] key, byte[] iv) {}
}
