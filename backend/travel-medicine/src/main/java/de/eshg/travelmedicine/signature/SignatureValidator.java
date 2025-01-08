/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.signature;

import de.eshg.travelmedicine.signature.persistence.entity.TravelMedicineSignature;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.SequenceInputStream;
import java.nio.charset.StandardCharsets;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.UUID;
import org.bouncycastle.jcajce.provider.digest.Blake2b;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SignatureValidator {
  private static final Logger log = LoggerFactory.getLogger(SignatureValidator.class);
  private static final HashAlgorithm hashAlgorithm = HashAlgorithm.BLAKE2B_512;
  private static final int BUFFER_SIZE = 8192;

  private SignatureValidator() {}

  public static void generateSignatureHash(TravelMedicineSignature signature) {

    if (signature != null) {
      UUID signatureId = signature.getId();
      try (InputStream stringInputStream =
              new ByteArrayInputStream(
                  ("%s;%s;".formatted(signatureId, signature.getSigner()))
                      .getBytes(StandardCharsets.UTF_8));
          InputStream combinedInputStream =
              new SequenceInputStream(
                  stringInputStream, new ByteArrayInputStream(signature.getSignatureImage()))) {
        String signatureHash = hash(combinedInputStream, hashAlgorithm);
        signature.setHashAlgorithm(hashAlgorithm);
        signature.setHashValue(signatureHash);
      } catch (IOException exception) {
        log.error("Failed to create hash for signature", exception);
      }
    }
  }

  public static boolean verifySignature(TravelMedicineSignature signature) {
    if (signature != null) {
      UUID signatureId = signature.getId();
      try (InputStream stringInputStream =
              new ByteArrayInputStream(
                  ("%s;%s;".formatted(signatureId, signature.getSigner()))
                      .getBytes(StandardCharsets.UTF_8));
          InputStream combinedInputStream =
              new SequenceInputStream(
                  stringInputStream, new ByteArrayInputStream(signature.getSignatureImage()))) {
        return verify(combinedInputStream, signature.getHashValue(), signature.getHashAlgorithm());
      } catch (IOException e) {
        log.error("Failed to create hash for signature", e);
        return false;
      }
    } else {
      return true;
    }
  }

  public static String hash(InputStream toConvert, HashAlgorithm algorithm) throws IOException {
    return switch (algorithm) {
      case BLAKE2B_512 -> hash(toConvert, new Blake2b.Blake2b512());
    };
  }

  private static String hash(InputStream inputStream, MessageDigest messageDigest)
      throws IOException {
    try (DigestInputStream digestInputStream = new DigestInputStream(inputStream, messageDigest)) {
      byte[] buffer = new byte[BUFFER_SIZE];
      while (true) {
        if (digestInputStream.read(buffer) < 0) break;
      }
      return HexFormat.of().formatHex(messageDigest.digest());
    }
  }

  public static boolean verify(InputStream inputStream, String hashValue, HashAlgorithm algorithm)
      throws IOException {
    return hashValue.equals(hash(inputStream, algorithm));
  }
}
