/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.common;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.KeyPair;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.PKIXParameters;
import java.security.cert.TrustAnchor;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundleKey;
import org.springframework.boot.ssl.SslManagerBundle;
import org.springframework.boot.ssl.SslOptions;
import org.springframework.boot.ssl.SslStoreBundle;

public class SslBundleFactory {
  private static final Logger logger = LoggerFactory.getLogger(SslBundleFactory.class);

  private final Lock lock = new ReentrantLock();
  private final Collection<X509Certificate> fixedCertificates;
  private final SslOptions sslOptions;
  private KeyStore serverKeyStore;
  private Collection<X509Certificate> dynamicRemoteCertificates;

  public SslBundleFactory(
      KeyStore trustStore,
      SslOptions sslOptions,
      KeyStore serverKeyStore,
      List<X509Certificate> dynamicRemoteCertificates) {
    try {
      this.fixedCertificates =
          trustStore == null
              ? Collections.emptyList()
              : new PKIXParameters(trustStore)
                  .getTrustAnchors().stream().map(TrustAnchor::getTrustedCert).toList();
      this.sslOptions = sslOptions;
      this.serverKeyStore = serverKeyStore;
      this.dynamicRemoteCertificates = dynamicRemoteCertificates;
    } catch (KeyStoreException | InvalidAlgorithmParameterException e) {
      throw new UnsupportedOperationException(e);
    }
  }

  public SslBundle buildWithNewDynamicRemoteCertificates(
      List<X509Certificate> dynamicCertificates) {
    lock.lock();
    try {
      this.dynamicRemoteCertificates = dynamicCertificates;
      return buildInternal();
    } catch (CertificateException | IOException | NoSuchAlgorithmException | KeyStoreException e) {
      throw new UnsupportedOperationException(e);
    } finally {
      lock.unlock();
    }
  }

  public SslBundle buildWithNewServerCertificate(
      KeyPair serverKeys, X509Certificate serverCertificate) {
    lock.lock();
    try {
      this.serverKeyStore = createKeyStore(serverKeys, serverCertificate);
      return buildInternal();
    } catch (CertificateException | IOException | NoSuchAlgorithmException | KeyStoreException e) {
      throw new UnsupportedOperationException(e);
    } finally {
      lock.unlock();
    }
  }

  public SslBundle build() {
    lock.lock();
    try {
      return buildInternal();
    } catch (CertificateException | IOException | NoSuchAlgorithmException | KeyStoreException e) {
      throw new UnsupportedOperationException(e);
    } finally {
      lock.unlock();
    }
  }

  private SslBundle buildInternal()
      throws CertificateException, IOException, NoSuchAlgorithmException, KeyStoreException {

    SslBundleKey key = serverKeyStore == null ? SslBundleKey.NONE : SslBundleKey.of(null, "ssl");

    // create truststore
    KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
    trustStore.load(null);

    List<X509Certificate> allTrustStores = new ArrayList<>(fixedCertificates);
    allTrustStores.addAll(dynamicRemoteCertificates);
    for (int i = 0; i < allTrustStores.size(); i++) {
      X509Certificate certificate = allTrustStores.get(i);
      String entryAlias = "ssl" + ((allTrustStores.size() == 1) ? "" : "-" + i);
      trustStore.setCertificateEntry(entryAlias, certificate);
    }

    logger.debug(
        "creating new SslBundle with {} server certificate, {} fixed trust entries, {} dynamic trust entries",
        serverKeyStore == null ? "empty" : "fixed",
        fixedCertificates.size(),
        dynamicRemoteCertificates.size());

    return new SslBundle() {
      @Override
      public SslStoreBundle getStores() {
        return SslStoreBundle.of(serverKeyStore, null, trustStore);
      }

      @Override
      public SslBundleKey getKey() {
        return key;
      }

      @Override
      public SslOptions getOptions() {
        return sslOptions;
      }

      @Override
      public String getProtocol() {
        return SslBundle.DEFAULT_PROTOCOL;
      }

      @Override
      public SslManagerBundle getManagers() {
        return SslManagerBundle.from(getStores(), getKey());
      }
    };
  }

  private KeyStore createKeyStore(KeyPair serverKeys, X509Certificate serverCertificate)
      throws KeyStoreException, IOException, NoSuchAlgorithmException, CertificateException {
    if (serverKeys == null) {
      return null;
    }
    KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
    keyStore.load(null);
    keyStore.setKeyEntry(
        "ssl", serverKeys.getPrivate(), null, new Certificate[] {serverCertificate});
    return keyStore;
  }
}
