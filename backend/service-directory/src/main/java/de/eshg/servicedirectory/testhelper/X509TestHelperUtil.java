/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.testhelper;

import de.eshg.servicedirectory.util.X509Utils;
import java.io.IOException;
import java.io.StringWriter;
import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.util.Date;
import org.apache.commons.lang3.time.DateUtils;
import org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x509.BasicConstraints;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.DefaultAlgorithmNameFinder;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.util.io.pem.PemObject;

public class X509TestHelperUtil {

  private static final String RSA =
      new DefaultAlgorithmNameFinder().getAlgorithmName(PKCSObjectIdentifiers.rsaEncryption);

  private X509TestHelperUtil() {}

  public static String generateCertPem(String commonName)
      throws NoSuchAlgorithmException, IOException, CertificateException {
    Certificate cert = generateCert(generateRsaKeyPair(), commonName);

    return generateCertPem(cert);
  }

  public static String generateCertPem(Certificate cert) throws CertificateException {

    PemObject pemObject = new PemObject(PEMParser.TYPE_CERTIFICATE, cert.getEncoded());

    return serialize(pemObject);
  }

  public static CertKeyPair generateKeyStore(String commonName)
      throws CertificateException, IOException, NoSuchAlgorithmException {

    KeyPair kp = generateRsaKeyPair();
    Certificate cert = generateCert(kp, commonName);

    PemObject certPem = new PemObject(PEMParser.TYPE_CERTIFICATE, cert.getEncoded());

    return new CertKeyPair(serialize(certPem), kp.getPrivate());
  }

  private static String serialize(Object pemObject) {
    try (StringWriter writer = new StringWriter()) {
      try (JcaPEMWriter pemWriter = new JcaPEMWriter(writer)) {
        pemWriter.writeObject(pemObject);
      }
      return writer.toString();

    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private static KeyPair generateRsaKeyPair() throws NoSuchAlgorithmException {
    KeyPairGenerator gen = KeyPairGenerator.getInstance(RSA);
    gen.initialize(1024);
    return gen.generateKeyPair();
  }

  private static Certificate generateCert(KeyPair keyPair, String commonName)
      throws CertificateException, IOException {
    X500Name dnName = new X500NameBuilder().addRDN(BCStyle.CN, commonName).build();
    BigInteger certSerialNumber = BigInteger.ONE;

    Date startDate = new Date();
    Date endDate = DateUtils.addYears(startDate, 1);

    JcaX509v3CertificateBuilder certBuilder =
        new JcaX509v3CertificateBuilder(
            dnName, certSerialNumber, startDate, endDate, dnName, keyPair.getPublic());

    certBuilder.addExtension(Extension.basicConstraints, true, new BasicConstraints(true));
    certBuilder.addExtension(Extension.keyUsage, true, getKeyUsage());

    ContentSigner contentSigner = getContentSigner(keyPair);
    return new JcaX509CertificateConverter().getCertificate(certBuilder.build(contentSigner));
  }

  private static KeyUsage getKeyUsage() {
    int keyUsage =
        KeyUsage.digitalSignature
            + KeyUsage.keyEncipherment
            + KeyUsage.keyCertSign
            + KeyUsage.cRLSign;
    return new KeyUsage(keyUsage);
  }

  private static ContentSigner getContentSigner(KeyPair keyPair) {
    try {
      return new JcaContentSignerBuilder(X509Utils.SIGNATURE_ALGORITHM).build(keyPair.getPrivate());
    } catch (OperatorCreationException e) {
      throw new UnsupportedOperationException(e);
    }
  }
}
