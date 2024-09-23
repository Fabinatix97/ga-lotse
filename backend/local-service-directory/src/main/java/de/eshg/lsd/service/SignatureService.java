/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.service;

import de.eshg.lsd.exception.SignatureServiceException;
import de.eshg.servicedirectory.util.X509Utils;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.UnrecoverableKeyException;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.stereotype.Service;

@Service
public class SignatureService {
  private final PrivateKey privateKey;
  private final String certificate;

  public SignatureService(SslBundles sslBundles) {
    SslBundle bundle = sslBundles.getBundle("lsd");

    try {
      KeyStore keyStore = bundle.getStores().getKeyStore();

      // seems to be the default alias
      String alias = "ssl";
      this.certificate = X509Utils.toPem(keyStore.getCertificate(alias));

      String password = bundle.getKey().getPassword();
      privateKey =
          (PrivateKey) keyStore.getKey(alias, password == null ? null : password.toCharArray());
    } catch (KeyStoreException | NoSuchAlgorithmException | UnrecoverableKeyException e) {
      throw new SignatureServiceException("could not load key or keyStore", e);
    }
  }

  public String getCertificate() {
    return certificate;
  }

  public String sign(String data) {
    return X509Utils.sign(data, privateKey);
  }
}
