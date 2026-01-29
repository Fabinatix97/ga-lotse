/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.common;

import static de.eshg.spatz.config.SpatzConfigurationProperties.*;

import jakarta.annotation.Nonnull;
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
import org.springframework.boot.autoconfigure.ssl.PropertiesSslBundle;
import org.springframework.boot.autoconfigure.ssl.SslBundleProperties;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundleKey;
import org.springframework.boot.ssl.SslManagerBundle;
import org.springframework.boot.ssl.SslOptions;
import org.springframework.boot.ssl.SslStoreBundle;

public class SslBundleFactory {
  private static final Logger logger = LoggerFactory.getLogger(SslBundleFactory.class);

  private final Lock lock = new ReentrantLock();
  private final SslConfiguration serverConfiguration;
  private final SslConfiguration clientConfiguration;
  private KeyStore serverKeyStore;
  private final KeyStore clientKeyStore;
  private Collection<X509Certificate> dynamicRemoteCertificates = List.of();

  private SslBundleFactory(
      SslConfiguration serverConfiguration, SslConfiguration clientConfiguration) {
    this.serverConfiguration = serverConfiguration;
    serverKeyStore = extractKeyStore(serverConfiguration);

    this.clientConfiguration = clientConfiguration;
    clientKeyStore = extractKeyStore(clientConfiguration);
  }

  public static SslBundleFactory forDualUseCertificate(SslConfiguration configuration) {
    return new SslBundleFactory(configuration, null);
  }

  public static SslBundleFactory forSingleUseCertificates(
      SslConfiguration serverConfiguration, SslConfiguration clientConfiguration) {
    return new SslBundleFactory(serverConfiguration, clientConfiguration);
  }

  public SslBundle buildWithNewDynamicRemoteCertificates(
      List<X509Certificate> dynamicCertificates) {
    lock.lock();
    try {
      dynamicRemoteCertificates = dynamicCertificates;
      return buildInternal(serverConfiguration, serverKeyStore, "server");
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
      serverKeyStore = createKeyStore(serverKeys, serverCertificate);
      return buildInternal(serverConfiguration, serverKeyStore, "server");
    } catch (CertificateException | IOException | NoSuchAlgorithmException | KeyStoreException e) {
      throw new UnsupportedOperationException(e);
    } finally {
      lock.unlock();
    }
  }

  public SslBundle build() {
    lock.lock();
    try {
      return buildInternal(serverConfiguration, serverKeyStore, "server");
    } catch (CertificateException | IOException | NoSuchAlgorithmException | KeyStoreException e) {
      throw new UnsupportedOperationException(e);
    } finally {
      lock.unlock();
    }
  }

  public SslBundle buildClientBundle() {
    if (clientConfiguration == null) {
      return null;
    }
    lock.lock();
    try {
      return buildInternal(clientConfiguration, clientKeyStore, "client");
    } catch (CertificateException | IOException | NoSuchAlgorithmException | KeyStoreException e) {
      throw new UnsupportedOperationException(e);
    } finally {
      lock.unlock();
    }
  }

  private SslBundle buildInternal(
      SslConfiguration sslConfiguration, KeyStore keyStore, String certificateType)
      throws CertificateException, IOException, NoSuchAlgorithmException, KeyStoreException {

    SslBundle sslBundle = PropertiesSslBundle.get(sslConfiguration);
    SslOptions sslOptions = extractSslOptions(sslConfiguration);
    Collection<X509Certificate> fixedCertificates = getTrustedCertificates(sslBundle);
    SslBundleKey key = keyStore == null ? SslBundleKey.NONE : SslBundleKey.of(null, "ssl");

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
        "creating new SslBundle with {} {} certificate, {} fixed trust entries, {} dynamic trust entries",
        keyStore == null ? "empty" : "fixed",
        certificateType,
        fixedCertificates.size(),
        dynamicRemoteCertificates.size());

    return new SslBundle() {
      @Override
      public SslStoreBundle getStores() {
        return SslStoreBundle.of(keyStore, null, trustStore);
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

  @Nonnull
  private static Collection<X509Certificate> getTrustedCertificates(SslBundle sslBundle) {
    KeyStore trustStoreFromBundle = sslBundle.getStores().getTrustStore();
    try {
      return trustStoreFromBundle == null
          ? Collections.emptyList()
          : new PKIXParameters(trustStoreFromBundle)
              .getTrustAnchors().stream().map(TrustAnchor::getTrustedCert).toList();
    } catch (KeyStoreException | InvalidAlgorithmParameterException e) {
      throw new UnsupportedOperationException(e);
    }
  }

  private static KeyStore extractKeyStore(SslConfiguration sslConfiguration) {
    if (sslConfiguration == null) {
      return null;
    }
    SslBundle sslBundle = PropertiesSslBundle.get(sslConfiguration);
    return sslBundle.getStores().getKeyStore();
  }

  private static SslOptions extractSslOptions(SslConfiguration sslConfiguration) {
    SslBundleProperties.Options options = sslConfiguration.getOptions();
    return options != null
        ? SslOptions.of(options.getCiphers(), options.getEnabledProtocols())
        : SslOptions.NONE;
  }

  private static KeyStore createKeyStore(KeyPair serverKeys, X509Certificate serverCertificate)
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
