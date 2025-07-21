/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.security;

import static de.eshg.servicedirectory.util.X509Utils.getSignatureAlgorithm;

import de.eshg.servicedirectory.util.X509Utils;
import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.Security;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.security.auth.x500.X500Principal;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.BasicConstraints;
import org.bouncycastle.asn1.x509.ExtendedKeyUsage;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.GeneralName;
import org.bouncycastle.asn1.x509.GeneralNames;
import org.bouncycastle.asn1.x509.KeyPurposeId;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.cert.CertIOException;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509ExtensionUtils;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.pkcs.PKCS10CertificationRequestBuilder;
import org.bouncycastle.pkcs.jcajce.JcaPKCS10CertificationRequestBuilder;
import org.bouncycastle.util.IPAddress;

public class CertificateBuilder {

  private final String subject;
  private final Set<String> subjectAlternativeNames = new HashSet<>();
  private String subjectLocation;
  private Duration maxAge = Duration.of(30, ChronoUnit.DAYS);
  private Date notBefore = new Date(System.currentTimeMillis());
  private String keyAlgorithm = DefaultKeyParameters.RSA.keyAlgorithm;
  private int keySize = DefaultKeyParameters.RSA.keySize;
  private boolean ca = false;
  private CertificateBuild signingCA;

  private CertificateBuilder(String subject) {
    this.subject = subject;
  }

  public static CertificateBuilder forHost(String host) {
    return new CertificateBuilder("CN=" + host).withAltName(host);
  }

  public static CertificateBuilder forSubject(String subject) {
    return new CertificateBuilder(subject);
  }

  public CertificateBuilder withAltName(String altName, String... altNames) {
    subjectAlternativeNames.add(altName);
    subjectAlternativeNames.addAll(Arrays.asList(altNames));
    return this;
  }

  public CertificateBuilder withAltName(Collection<String> altNames) {
    subjectAlternativeNames.addAll(altNames);
    return this;
  }

  public CertificateBuilder withLocation(String location) {
    subjectLocation = location;
    return this;
  }

  public CertificateBuilder maxAge(Duration maxAge) {
    this.maxAge = maxAge;
    return this;
  }

  public CertificateBuilder notBefore(Instant notBefore) {
    this.notBefore = Date.from(notBefore);
    return this;
  }

  public CertificateBuilder keyParameters(String keyAlgorithm, int keySize) {
    this.keyAlgorithm = keyAlgorithm;
    this.keySize = keySize;
    return this;
  }

  public CertificateBuilder keyParameters(DefaultKeyParameters keyParameters) {
    return keyParameters(keyParameters.keyAlgorithm, keyParameters.keySize);
  }

  public CertificateBuilder certificateAuthority(boolean ca) {
    this.ca = ca;
    return this;
  }

  public CertificateBuilder signedBy(CertificateBuild ca) {
    this.signingCA = ca;
    return this;
  }

  CertificateBuild buildSignedByCa() {
    try {
      BouncyCastleProvider provider = new BouncyCastleProvider();
      Security.addProvider(provider);

      X500Principal principal = new X500Principal(getSubject());
      KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(keyAlgorithm);
      keyPairGenerator.initialize(keySize, new SecureRandom());
      KeyPair keyPair = keyPairGenerator.generateKeyPair();

      Date notAfter = Date.from(notBefore.toInstant().plus(maxAge));

      PKCS10CertificationRequestBuilder p10Builder =
          new JcaPKCS10CertificationRequestBuilder(principal, keyPair.getPublic());
      JcaContentSignerBuilder csrBuilder =
          new JcaContentSignerBuilder(signingCA.certificate().getSigAlgName())
              .setProvider(provider);

      // Sign the new KeyPair with the root cert Private Key
      ContentSigner csrContentSigner = csrBuilder.build(signingCA.keyPair().getPrivate());
      PKCS10CertificationRequest csr = p10Builder.build(csrContentSigner);

      // Use the Signed KeyPair and CSR to generate an issued Certificate
      // Here serial number is randomly generated. In general, CAs use
      // a sequence to generate Serial number and avoid collisions
      X509v3CertificateBuilder certBuilder =
          new X509v3CertificateBuilder(
              X500Name.getInstance(signingCA.certificate().getIssuerX500Principal().getEncoded()),
              BigInteger.valueOf(new SecureRandom().nextLong()),
              notBefore,
              notAfter,
              csr.getSubject(),
              csr.getSubjectPublicKeyInfo());

      certBuilder.addExtension(Extension.basicConstraints, true, new BasicConstraints(ca));
      certBuilder.addExtension(Extension.keyUsage, true, getKeyUsage());
      certBuilder.addExtension(Extension.extendedKeyUsage, false, getExtendedKeyUsage());
      certBuilder.addExtension(Extension.subjectAlternativeName, false, getGeneralNames());
      certBuilder.addExtension(
          Extension.subjectKeyIdentifier,
          false,
          new JcaX509ExtensionUtils().createSubjectKeyIdentifier(keyPair.getPublic()));

      X509Certificate certificate =
          new JcaX509CertificateConverter()
              .setProvider(provider)
              .getCertificate(certBuilder.build(csrContentSigner));

      return new CertificateBuild(keyPair, certificate, X509Utils.toPem(certificate), signingCA);
    } catch (NoSuchAlgorithmException
        | CertIOException
        | OperatorCreationException
        | CertificateException e) {
      throw new UnsupportedOperationException(e);
    }
  }

  private String getSubject() {
    if (subjectLocation == null || subjectLocation.isBlank()) {
      return subject;
    } else {
      return String.format("%s,L=%s", subject, subjectLocation);
    }
  }

  CertificateBuild buildSelfSigned() {
    try {
      BouncyCastleProvider provider = new BouncyCastleProvider();
      Security.addProvider(provider);

      X500Principal principal = new X500Principal(getSubject());
      KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(keyAlgorithm);
      keyPairGenerator.initialize(keySize, new SecureRandom());
      KeyPair keyPair = keyPairGenerator.generateKeyPair();

      Date notAfter = Date.from(notBefore.toInstant().plus(maxAge));

      X509v3CertificateBuilder certBuilder =
          new JcaX509v3CertificateBuilder(
              principal, BigInteger.ONE, notBefore, notAfter, principal, keyPair.getPublic());

      certBuilder.addExtension(Extension.basicConstraints, true, new BasicConstraints(ca));
      certBuilder.addExtension(Extension.keyUsage, true, getKeyUsage());
      certBuilder.addExtension(Extension.extendedKeyUsage, false, getExtendedKeyUsage());
      certBuilder.addExtension(Extension.subjectAlternativeName, false, getGeneralNames());
      certBuilder.addExtension(
          Extension.subjectKeyIdentifier,
          false,
          new JcaX509ExtensionUtils().createSubjectKeyIdentifier(keyPair.getPublic()));

      String signatureAlgorithm = getSignatureAlgorithm(keyPair);
      final ContentSigner signer =
          new JcaContentSignerBuilder(signatureAlgorithm).build(keyPair.getPrivate());

      X509Certificate certificate =
          new JcaX509CertificateConverter()
              .setProvider(provider)
              .getCertificate(certBuilder.build(signer));

      return new CertificateBuild(keyPair, certificate, X509Utils.toPem(certificate), null);
    } catch (NoSuchAlgorithmException
        | CertIOException
        | OperatorCreationException
        | CertificateException e) {
      throw new UnsupportedOperationException(e);
    }
  }

  public CertificateBuild build() {
    if (signingCA != null) {
      return buildSignedByCa();
    } else {
      return buildSelfSigned();
    }
  }

  private KeyUsage getKeyUsage() {
    int keyUsage = KeyUsage.digitalSignature + KeyUsage.keyEncipherment;
    if (ca) {
      keyUsage += KeyUsage.keyCertSign + KeyUsage.cRLSign;
    }
    return new KeyUsage(keyUsage);
  }

  private static ExtendedKeyUsage getExtendedKeyUsage() {
    KeyPurposeId[] purposes =
        new KeyPurposeId[] {KeyPurposeId.id_kp_serverAuth, KeyPurposeId.id_kp_clientAuth};
    return new ExtendedKeyUsage(purposes);
  }

  private GeneralNames getGeneralNames() {
    GeneralName[] encodableAltNames =
        subjectAlternativeNames.stream()
            .map(
                s ->
                    IPAddress.isValid(s)
                        ? new GeneralName(GeneralName.iPAddress, s)
                        : new GeneralName(GeneralName.dNSName, s))
            .toArray(GeneralName[]::new);
    return new GeneralNames(encodableAltNames);
  }
}
