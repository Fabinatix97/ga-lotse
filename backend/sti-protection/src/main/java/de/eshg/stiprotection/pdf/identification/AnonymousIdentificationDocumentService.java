/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.pdf.identification;

import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.file.FileFactory;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class AnonymousIdentificationDocumentService {
  public static final String IDENTIFICATION_TEMPLATES_ROOT = "/templates/identification/";

  private final DocumentGenerator reportBuilder;
  private final Clock clock;

  private static final DateTimeFormatter FILENAME_TIMESTAMP_SUFFIX =
      DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss", Locale.GERMANY);

  public AnonymousIdentificationDocumentService(DocumentGenerator reportBuilder, Clock clock) {
    this.reportBuilder = reportBuilder;
    this.clock = clock;
  }

  public Pdf createPdf(AnonymousIdentificationDocument data) {
    byte[] bytes = createPdfFromTemplate(data);
    String fileName = fileName();
    PdfMetaData pdfMetaData = pdfMetaData();
    return FileFactory.createPdfWithMetaData(fileName, bytes, pdfMetaData);
  }

  private String fileName() {
    return "Anonyme_Beratung_%s.pdf"
        .formatted(ZonedDateTime.now(clock).format(FILENAME_TIMESTAMP_SUFFIX));
  }

  private byte[] createPdfFromTemplate(AnonymousIdentificationDocument data) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    String template = IDENTIFICATION_TEMPLATES_ROOT + "anon_indent.ftlx";
    reportBuilder.createPdfFromTemplate(new ClassPathResource(template), data, baos);
    return baos.toByteArray();
  }

  private PdfMetaData pdfMetaData() {
    PdfMetaData pdfMetaData = new PdfMetaData();
    pdfMetaData.setCreatedDate(clock.instant());
    pdfMetaData.setDescription("Anonyme Beratung");
    return pdfMetaData;
  }
}
