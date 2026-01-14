/*
 * Copyright 2026 cronn GmbH
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
import java.security.cert.CertificateParsingException;
import java.security.cert.PKIXParameters;
import java.security.cert.TrustAnchor;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class X509Utils {
  private static final Logger logger = LoggerFactory.getLogger(X509Utils.class);

  public static final String ESHGACTOR_BUNDLE_NAME = "eshgactor";

  private static final String BEGIN_CERT = "-----BEGIN CERTIFICATE-----";
  private static final String END_CERT = "-----END CERTIFICATE-----";

  // We want to use LF line breaks, as otherwise the validation files will vary depending on the OS
  public static final String LINE_SEPARATOR = "\n";
  private static final Decoder b64Decoder = Base64.getDecoder();

  private X509Utils() {}

  public static Stream<X509Certificate> parseMultiPem(String pem) {
    return Arrays.stream(pem.split(END_CERT))
        .filter(Predicate.not(String::isBlank))
        .map(s -> s + END_CERT)
        .map(String::trim)
        .map(X509Utils::parsePem);
  }

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

  public static String extractSanOrCommonName(X509Certificate cert) {
    Collection<List<?>> SANs;
    try {
      SANs = extractSubjectAlternativeNames(cert);
    } catch (RuntimeException e) {
      return extractCommonName(cert.getSubjectX500Principal().getName());
    }
    if (SANs.size() > 1) {
      logger.warn("More than one SAN found for certificate: {}", cert);
    }
    return getFirstDnsSan(SANs);
  }

  public static String extractLocation(X509Certificate cert) {
    return extractLocation(cert.getSubjectX500Principal().getName());
  }

  private static String extractCommonName(String s) {
    return extractSubjectComponent(s, "cn").orElseThrow();
  }

  private static String extractLocation(String s) {
    return extractSubjectComponent(s, "l").orElse(null);
  }

  private static Optional<String> extractSubjectComponent(String s, String component) {
    LdapName name = parseRfc2253(s);
    return name.getRdns().stream()
        .filter(rdn -> rdn.getType().equalsIgnoreCase(component))
        .map(rdn -> rdn.getValue().toString())
        .findFirst();
  }

  public static Map<String, String> parseSubject(String s) {
    LdapName name = parseRfc2253(s);
    TreeMap<String, String> result = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
    name.getRdns().forEach(rdn -> result.put(rdn.getType(), rdn.getValue().toString()));
    return result;
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

  public static String getCertificateInfo(String name, String certificate) {
    String info = "";
    if (name != null) {
      info += name;
    }
    if (certificate != null) {
      info +=
          X509Utils.parseMultiPem(certificate)
              .map(x -> x.getSubjectX500Principal().getName())
              .toList();
    }
    return info;
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

  public static boolean isCaCertificate(X509Certificate certificate) {
    return certificate.getBasicConstraints() != -1;
  }

  public static boolean isValidSignature(
      String dataThatWasSigned, String base64EncodedSignature, String signatoryAsPemCertificate) {
    PublicKey publicKey = X509Utils.parsePem(signatoryAsPemCertificate).getPublicKey();
    Signature sig = getSignature(getSignatureAlgorithm(publicKey));
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
    return sign(data, privateKey, getSignatureAlgorithm(privateKey));
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

  public static void assertOnlySanIsCn(X509Certificate certificate) {
    Collection<List<?>> SANs = extractSubjectAlternativeNames(certificate);
    if (SANs.size() > 1) {
      throw new IllegalArgumentException(
          "Certificate contains more than one subject alternative names");
    }
    String CN = extractCommonName(certificate.getSubjectX500Principal().getName());
    String SAN = getFirstDnsSan(SANs);
    if (!SAN.equals(CN)) {
      throw new IllegalArgumentException(
          "Certificate's subject alternative name" + SAN + " does not match common name " + CN);
    }
  }

  private static Collection<List<?>> extractSubjectAlternativeNames(X509Certificate certificate) {
    Collection<List<?>> SANs;
    try {
      SANs = certificate.getSubjectAlternativeNames();
    } catch (CertificateParsingException e) {
      throw new IllegalArgumentException(e);
    }
    if (SANs == null || SANs.isEmpty()) {
      throw new IllegalArgumentException(
          "Certificate does not contain any subject alternative names");
    }
    return SANs;
  }

  private static String getFirstDnsSan(Collection<List<?>> SANs) {
    return (String)
        SANs.stream()
            .filter((SAN) -> SAN.getFirst().equals(2))
            .findFirst()
            .orElseThrow(
                () -> new IllegalArgumentException("Expected at least one dNSName(2) SAN entry."))
            .getLast();
  }

  public static String getSignatureAlgorithm(Key privateKey) {
    String keyAlgorithm = privateKey.getAlgorithm();

    return switch (keyAlgorithm.toUpperCase()) {
      case "RSA" -> "SHA384withRSA";
      case "EC" -> "SHA384withECDSA";
      default -> throw new IllegalArgumentException("Unsupported key algorithm: " + keyAlgorithm);
    };
  }

  public static String getSignatureAlgorithm(KeyPair keyPair) {
    return getSignatureAlgorithm(keyPair.getPrivate());
  }
}
