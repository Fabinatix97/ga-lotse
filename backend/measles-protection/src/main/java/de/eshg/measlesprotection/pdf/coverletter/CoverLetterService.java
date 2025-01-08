/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.pdf.coverletter;

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
public class CoverLetterService {

  public static final String COVER_LETTERS_ROOT = "/templates/coverletters/";

  private final DocumentGenerator reportBuilder;
  private final Clock clock;

  private static final DateTimeFormatter FILENAME_TIMESTAMP_SUFFIX =
      DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss", Locale.GERMANY);

  public CoverLetterService(DocumentGenerator reportBuilder, Clock clock) {
    this.reportBuilder = reportBuilder;
    this.clock = clock;
  }

  public Pdf createCoverLetter(CoverLetterData data) {
    byte[] bytes = createPdfFromTemplate(data);
    ZonedDateTime now = ZonedDateTime.now(clock);
    String name = name(data);
    return FileFactory.createPdfWithMetaData(filename(name, now), bytes, pdfMetaData(now, name));
  }

  private static String name(CoverLetterData data) {
    CoverLetterPerson person = data.affectedPerson();
    return person.firstName() + " " + person.lastName();
  }

  private static PdfMetaData pdfMetaData(ZonedDateTime now, String name) {
    PdfMetaData pdfMetaData = new PdfMetaData();
    pdfMetaData.setCreatedDate(now.toInstant());
    pdfMetaData.setDescription("Anschreiben " + name);
    return pdfMetaData;
  }

  private static String filename(String name, ZonedDateTime now) {
    return "Anschreiben_%s_%s.pdf"
        .formatted(name.replace(" ", "_"), now.format(FILENAME_TIMESTAMP_SUFFIX));
  }

  private byte[] createPdfFromTemplate(CoverLetterData data) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    String template = COVER_LETTERS_ROOT + data.coverLetterType().getTemplate();
    reportBuilder.createPdfFromTemplate(new ClassPathResource(template), data, baos);
    return baos.toByteArray();
  }
}
