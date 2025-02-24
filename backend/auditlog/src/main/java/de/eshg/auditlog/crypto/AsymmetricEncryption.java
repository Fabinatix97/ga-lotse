/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.crypto;

import de.eshg.auditlog.crypto.PublicKeyService.UserPublicKey;
import java.security.Security;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.bouncycastle.crypto.InvalidCipherTextException;
import org.bouncycastle.crypto.hpke.HPKE;
import org.bouncycastle.crypto.hpke.HPKEContextWithEncapsulation;
import org.bouncycastle.crypto.params.AsymmetricKeyParameter;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class AsymmetricEncryption {

  private static final Logger log = LoggerFactory.getLogger(AsymmetricEncryption.class);

  public AsymmetricEncryption() {
    Security.addProvider(new BouncyCastleProvider());
  }

  public List<EncryptedKey> encrypt(byte[] symmetricKey, List<UserPublicKey> publicKeys) {
    HPKE hpke =
        new HPKE(HPKE.mode_base, HPKE.kem_P256_SHA256, HPKE.kdf_HKDF_SHA256, HPKE.aead_AES_GCM256);

    List<EncryptedKey> encryptedKeys = new ArrayList<>();
    for (UserPublicKey userPublicKey : publicKeys) {
      log.info("Encrypting symmetric key for user {}", userPublicKey.userId());
      encryptedKeys.add(encryptAsymmetricallyForUser(userPublicKey, hpke, symmetricKey));
    }
    return encryptedKeys;
  }

  private EncryptedKey encryptAsymmetricallyForUser(
      UserPublicKey userPublicKey, HPKE hpke, byte[] symmetricKey) {
    AsymmetricKeyParameter publicKey = hpke.deserializePublicKey(userPublicKey.publicKey());
    HPKEContextWithEncapsulation context = hpke.setupBaseS(publicKey, new byte[] {});

    try {
      byte[] encryptedSymmetricKey = context.seal(new byte[] {}, symmetricKey);
      byte[] encapsulatedKey = context.getEncapsulation();
      return new EncryptedKey(userPublicKey.userId(), encryptedSymmetricKey, encapsulatedKey);
    } catch (InvalidCipherTextException e) {
      throw new AuditLogEncryptionException("Unable to encrypt for user %s", e);
    }
  }

  public record EncryptedKey(UUID userId, byte[] encryptedSymmetricKey, byte[] encapsulatedKey) {}
}
