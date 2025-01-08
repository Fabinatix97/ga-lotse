/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.procedure.domain.model.PdfMetaData;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.Optional;
import org.apache.tika.Tika;
import org.apache.tika.metadata.Metadata;

class PdfMetaDataExtractor {
  private static final String PDF_DOCINFO_CREATED = "pdf:docinfo:created";
  private static final String XMP_CREATE_DATE = "xmp:CreateDate";

  private PdfMetaDataExtractor() {}

  static PdfMetaData fromFileContent(byte[] fileContent) throws IOException {
    Metadata metadata = new Metadata();

    try (InputStream inputStream = new ByteArrayInputStream(fileContent)) {
      new Tika().parse(inputStream, metadata);
    }

    Instant createdDate =
        getPdfDocInfoCreated(metadata).or(() -> getXmpCreatedDate(metadata)).orElse(null);

    PdfMetaData pdfMetaData = new PdfMetaData();
    pdfMetaData.setCreatedDate(createdDate);
    return pdfMetaData;
  }

  private static Optional<Instant> getPdfDocInfoCreated(Metadata metadata) {
    return Optional.ofNullable(metadata.get(PDF_DOCINFO_CREATED)).map(Instant::parse);
  }

  private static Optional<Instant> getXmpCreatedDate(Metadata metadata) {
    return Optional.ofNullable(metadata.get(XMP_CREATE_DATE)).map(Instant::parse);
  }
}
