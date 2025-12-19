/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.crypto;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.prostituteprotection.domain.model.EncryptedPersonalData;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDate;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.bouncycastle.crypto.generators.Argon2BytesGenerator;
import org.bouncycastle.crypto.params.Argon2Parameters;
import org.springframework.stereotype.Service;

@Service
public class PersonalDataEncryptionService {

  private static final int ARGON2_ITERATIONS = 5;
  private static final int ARGON2_MEMORY_KB = 7 * 1024;
  private static final int ARGON2_PARALLELISM = 1;
  private static final int ARGON2_OUTPUT_LENGTH_BITS = 256;

  private static final String HASH_ALGORITHM = "SHA3-256";
  private static final String KEY_ALGORITHM = "AES";
  private static final String AES_GCM_ALGORITHM = "AES_256/GCM/NoPadding";
  private static final int GCM_AUTHENTICATION_TAG_LENGTH_BITS = 128;
  private static final int GCM_INITIALIZATION_VECTOR_LENGTH_BITS = 96;

  private static final SecureRandom SECURE_RANDOM = new SecureRandom();

  private final RandomSaltService randomSaltService;
  private final SerializationHelper serializationHelper;

  public PersonalDataEncryptionService(
      RandomSaltService randomSaltService, ObjectMapper objectMapper) {
    this.randomSaltService = randomSaltService;
    this.serializationHelper = new SerializationHelper(objectMapper);
  }

  public byte[] generateEncryptionKey(String firstName, String lastName, LocalDate dateOfBirth) {
    byte[] salt = randomSaltService.getSalt();
    byte[] input = normalizedPersonalDataAsByteArray(firstName, lastName, dateOfBirth);

    Argon2Parameters params =
        new Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)
            .withSalt(salt)
            .withParallelism(ARGON2_PARALLELISM)
            .withMemoryAsKB(ARGON2_MEMORY_KB)
            .withIterations(ARGON2_ITERATIONS)
            .build();

    Argon2BytesGenerator generator = new Argon2BytesGenerator();
    generator.init(params);

    byte[] hash = new byte[ARGON2_OUTPUT_LENGTH_BITS / 8];
    generator.generateBytes(input, hash);

    return hash;
  }

  public EncryptedPersonalDataDto encrypt(DecryptedPersonalDataDto decryptedPersonalData) {
    if (decryptedPersonalData == null) {
      throw new IllegalArgumentException("Data for encryption is null");
    }
    byte[] nonce = generateNonce();
    byte[] encryptionKey =
        generateEncryptionKey(
            decryptedPersonalData.firstName(),
            decryptedPersonalData.lastName(),
            decryptedPersonalData.dateOfBirth());
    byte[] hashedPersonIdentifier = generateHashedPersonIdentifier(encryptionKey);
    byte[] decryptedData = serializationHelper.serialize(decryptedPersonalData);
    try {
      byte[] encryptedData = encrypt(decryptedData, encryptionKey, nonce);
      return new EncryptedPersonalDataDto(hashedPersonIdentifier, encryptedData, nonce);
    } catch (GeneralSecurityException e) {
      throw new PersonalDataEncryptionException("Personal data encryption failed", e);
    }
  }

  public DecryptedPersonalDataDto decrypt(
      EncryptedPersonalDataDto encryptedPersonalData, byte[] encryptionKey) {
    if (encryptedPersonalData == null) {
      throw new IllegalArgumentException("Data for decryption is null");
    }
    try {
      byte[] decryptedData =
          decrypt(encryptedPersonalData.data(), encryptionKey, encryptedPersonalData.nonce());
      return serializationHelper.deserialize(decryptedData);
    } catch (GeneralSecurityException e) {
      throw new PersonalDataDecryptionException("Personal data decryption failed", e);
    }
  }

  public DecryptedPersonalDataDto decrypt(
      EncryptedPersonalData encryptedPersonalData,
      String firstName,
      String lastName,
      LocalDate dateOfBirth) {
    byte encryptionKey[] = generateEncryptionKey(firstName, lastName, dateOfBirth);
    return decrypt(
        new EncryptedPersonalDataDto(
            encryptedPersonalData.getHashedPersonIdentifier(),
            encryptedPersonalData.getEncryptedData(),
            encryptedPersonalData.getNonce()),
        encryptionKey);
  }

  private byte[] normalizedPersonalDataAsByteArray(
      String firstName, String lastName, LocalDate dateOfBirth) {
    return PersonalDataNormalizer.createNormalizedPersonalData(firstName, lastName, dateOfBirth)
        .getBytes(StandardCharsets.UTF_8);
  }

  public byte[] generateHashedPersonIdentifier(byte[] encryptionKey) {
    try {
      MessageDigest digest = MessageDigest.getInstance(HASH_ALGORITHM);
      return digest.digest(encryptionKey);
    } catch (NoSuchAlgorithmException e) {
      throw new PersonalDataEncryptionException("hashedPersonIdentifier generation failed", e);
    }
  }

  private byte[] generateNonce() {
    byte[] nonce = new byte[GCM_INITIALIZATION_VECTOR_LENGTH_BITS / 8];
    SECURE_RANDOM.nextBytes(nonce);
    return nonce;
  }

  private byte[] encrypt(byte[] decryptedData, byte[] encryptionKey, byte[] nonce)
      throws GeneralSecurityException {
    return applyCipher(Cipher.ENCRYPT_MODE, decryptedData, encryptionKey, nonce);
  }

  private byte[] decrypt(byte[] encryptedData, byte[] encryptionKey, byte[] nonce)
      throws GeneralSecurityException {
    return applyCipher(Cipher.DECRYPT_MODE, encryptedData, encryptionKey, nonce);
  }

  private byte[] applyCipher(int cipherMode, byte[] inputData, byte[] encryptionKey, byte[] nonce)
      throws GeneralSecurityException {
    SecretKey secretKey = new SecretKeySpec(encryptionKey, KEY_ALGORITHM);
    GCMParameterSpec gcmParameterSpec =
        new GCMParameterSpec(GCM_AUTHENTICATION_TAG_LENGTH_BITS, nonce);
    Cipher cipher = Cipher.getInstance(AES_GCM_ALGORITHM);
    cipher.init(cipherMode, secretKey, gcmParameterSpec);
    return cipher.doFinal(inputData);
  }
}
