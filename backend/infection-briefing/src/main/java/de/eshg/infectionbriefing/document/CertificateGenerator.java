/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.document;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.file.FileFactory;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class CertificateGenerator {

  public static final String CERTIFICATE_TEMPLATE = "/templates/de/certificate.ftlx";

  static final DateTimeFormatter TEXT_DATE_FORMATTER =
      DateTimeFormatter.ofPattern("dd.MMMM yyyy").localizedBy(Locale.GERMAN);
  private static final DateTimeFormatter FILENAME_DATE_TIME_FORMATTER =
      DateTimeFormatter.ofPattern("dd-MM-yyyy_HH-mm-ss");

  private final DocumentGenerator documentGenerator;
  private final ClassPathResource invitationTemplate;
  private final Clock clock;

  public CertificateGenerator(
      DocumentGenerator documentGenerator,
      @Value(CERTIFICATE_TEMPLATE) ClassPathResource invitationTemplate,
      Clock clock) {
    this.documentGenerator = documentGenerator;
    this.invitationTemplate = invitationTemplate;
    this.clock = clock;
  }

  public Pdf generate(GetPersonFileStateResponse person, LocalDate instructionDate) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    documentGenerator.createPdfFromTemplate(
        invitationTemplate, mapToCertificateData(person, instructionDate), baos);
    byte[] bytes = baos.toByteArray();

    PdfMetaData pdfMetaData = new PdfMetaData();
    ZonedDateTime now = ZonedDateTime.now(clock);
    pdfMetaData.setCreatedDate(now.toInstant());
    pdfMetaData.setDescription(
        "Bescheinigung %s %s".formatted(person.firstName(), person.lastName()));
    return FileFactory.createPdfWithMetaData(
        "Bescheinigung_%s.pdf".formatted(now.format(FILENAME_DATE_TIME_FORMATTER)),
        bytes,
        pdfMetaData);
  }

  private CertificateData mapToCertificateData(
      GetPersonFileStateResponse person, LocalDate instructionDate) {
    DomesticAddressDto address =
        Optional.ofNullable(person.contactAddress())
            .filter(DomesticAddressDto.class::isInstance)
            .map(DomesticAddressDto.class::cast)
            .orElseThrow(
                () ->
                    new IllegalArgumentException(
                        "Cannot generate certificate: No DomesticAddress in person data"));
    return new CertificateData(
        person.firstName(),
        person.lastName(),
        person.dateOfBirth().format(TEXT_DATE_FORMATTER),
        instructionDate.format(TEXT_DATE_FORMATTER),
        address.street(),
        address.houseNumber(),
        address.postalCode(),
        address.city());
  }
}
