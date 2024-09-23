/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.util;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.PKIXParameters;
import java.security.cert.TrustAnchor;
import java.security.cert.X509Certificate;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;

public class X509Utils {
  public static final String SIGNATURE_ALGORITHM = "SHA384withRSA";
  public static final String ESHGACTOR_BUNDLE_NAME = "eshgactor";

  private static final String BEGIN_CERT = "-----BEGIN CERTIFICATE-----";
  private static final String END_CERT = "-----END CERTIFICATE-----";

  // We want to use LF line breaks, as otherwise the validation files will vary depending on the OS
  public static final String LINE_SEPARATOR = "\n";
  private static final Decoder b64Decoder = Base64.getDecoder();

  private X509Utils() {}

  public static X509Certificate parsePem(String pem) {
    CertificateFactory cf = getCertificateFactory();
    ByteArrayInputStream is = new ByteArrayInputStream(pem.getBytes());
    try {
      return (X509Certificate) cf.generateCertificate(is);
    } catch (CertificateException e) {
      throw new IllegalArgumentException(e);
    }
  }

  public static String toPem(Certificate cert) {
    try {
      return BEGIN_CERT
          + LINE_SEPARATOR
          + Base64.getMimeEncoder(64, LINE_SEPARATOR.getBytes()).encodeToString(cert.getEncoded())
          + LINE_SEPARATOR
          + END_CERT;
    } catch (CertificateEncodingException e) {
      throw new IllegalStateException("Could not encode certificate", e);
    }
  }

  public static String extractCommonName(X509Certificate cert) {
    return extractCommonName(cert.getSubjectX500Principal().getName());
  }

  public static String extractCommonName(String s) {
    LdapName name = parseRfc2253(s);
    return name.getRdns().stream()
        .filter(rdn -> rdn.getType().equalsIgnoreCase("cn"))
        .map(rdn -> rdn.getValue().toString())
        .findFirst()
        .orElseThrow();
  }

  public static String normalizePem(String input) {
    String b64 = input.replace(BEGIN_CERT, "").replace(END_CERT, "").replaceAll("\\s+", "");
    try {
      b64Decoder.decode(b64);
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("Not a valid PEM certificate " + input, e);
    }
    return BEGIN_CERT
        + LINE_SEPARATOR
        + insertNewlineAfter66Characters(b64)
        + LINE_SEPARATOR
        + END_CERT;
  }

  private static String insertNewlineAfter66Characters(String input) {
    int chunks = (input.length() + (66 - 1)) / 66;
    return IntStream.range(0, chunks)
        .map(i -> i * 66)
        .mapToObj(i -> input.substring(i, Math.min(i + 66, input.length())))
        .collect(Collectors.joining(LINE_SEPARATOR));
  }

  private static LdapName parseRfc2253(String name) {
    try {
      return new LdapName(name);
    } catch (InvalidNameException e) {
      throw new IllegalArgumentException(e);
    }
  }

  private static CertificateFactory getCertificateFactory() {
    try {
      return CertificateFactory.getInstance("X.509");
    } catch (CertificateException e) {
      throw new IllegalArgumentException(e);
    }
  }

  public static boolean isValidSignature(
      String dataThatWasSigned, String base64EncodedSignature, String signatoryAsPemCertificate) {
    return isValidSignature(
        dataThatWasSigned, base64EncodedSignature, signatoryAsPemCertificate, SIGNATURE_ALGORITHM);
  }

  public static boolean isValidSignature(
      String dataThatWasSigned,
      String base64EncodedSignature,
      String signatoryAsPemCertificate,
      String signatureAlgorithm) {
    PublicKey publicKey = X509Utils.parsePem(signatoryAsPemCertificate).getPublicKey();
    Signature sig = getSignature(signatureAlgorithm);
    try {
      sig.initVerify(publicKey);
    } catch (InvalidKeyException e) {
      throw new IllegalStateException("public key was invalid", e);
    }

    try {
      sig.update(dataThatWasSigned.getBytes(StandardCharsets.UTF_8));

      byte[] signatureBytes = b64Decoder.decode(base64EncodedSignature);
      return sig.verify(signatureBytes);
    } catch (SignatureException e) {
      throw new IllegalStateException("could not create signature", e);
    }
  }

  public static String sign(String data, PrivateKey privateKey) {
    return sign(data, privateKey, SIGNATURE_ALGORITHM);
  }

  /**
   * @param data the data that should be signed
   * @param privateKey what is used to sign
   * @return the base64 encoded signature
   */
  public static String sign(String data, PrivateKey privateKey, String signatureAlgorithm) {
    byte[] signatureBytes;
    try {
      Signature sig = getSignature(signatureAlgorithm);
      sig.initSign(privateKey);
      sig.update(data.getBytes(StandardCharsets.UTF_8));
      signatureBytes = sig.sign();
    } catch (SignatureException | InvalidKeyException e) {
      throw new IllegalStateException("Could not sign certificate", e);
    }

    return Base64.getEncoder().encodeToString(signatureBytes);
  }

  private static Signature getSignature(String signatureAlgorithm) {
    try {
      return Signature.getInstance(signatureAlgorithm);
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException("Algorithm " + signatureAlgorithm + " not found", e);
    }
  }

  public static boolean inTrustStoreOrWasSignedByOneInTrustStore(KeyStore trustStore, String pem) {
    return inTrustStoreOrWasSignedByOneInTrustStore(trustStore, parsePem(pem));
  }

  public static boolean inTrustStoreOrWasSignedByOneInTrustStore(
      KeyStore trustStore, X509Certificate certificate) {
    try {
      PKIXParameters parameters = new PKIXParameters(trustStore);

      for (TrustAnchor trustAnchor : parameters.getTrustAnchors()) {
        X509Certificate trusted = trustAnchor.getTrustedCert();

        if (trusted.equals(certificate) || isSignedBy(certificate, trusted)) {
          return true;
        }
      }
    } catch (KeyStoreException | InvalidAlgorithmParameterException e) {
      throw new IllegalStateException(e);
    }

    return false;
  }

  public static boolean isSignedBy(X509Certificate certificate, X509Certificate supposedSignatory) {
    try {
      certificate.verify(supposedSignatory.getPublicKey());
    } catch (SignatureException e) {
      return false;
    } catch (CertificateException
        | NoSuchAlgorithmException
        | InvalidKeyException
        | NoSuchProviderException e) {
      throw new IllegalStateException("could not verify signature", e);
    }
    return true;
  }
}
