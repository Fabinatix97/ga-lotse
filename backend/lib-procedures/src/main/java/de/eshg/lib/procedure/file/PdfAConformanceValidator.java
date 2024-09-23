/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import org.verapdf.core.EncryptedPdfException;
import org.verapdf.core.ModelParsingException;
import org.verapdf.core.ValidationException;
import org.verapdf.gf.foundry.VeraGreenfieldFoundryProvider;
import org.verapdf.pdfa.Foundries;
import org.verapdf.pdfa.PDFAParser;
import org.verapdf.pdfa.PDFAValidator;
import org.verapdf.pdfa.VeraPDFFoundry;
import org.verapdf.pdfa.results.ValidationResult;

class PdfAConformanceValidator {

  private PdfAConformanceValidator() {}

  static {
    VeraGreenfieldFoundryProvider.initialise();
  }

  static void validate(byte[] fileContent) {
    try (VeraPDFFoundry foundry = Foundries.defaultInstance();
        PDFAParser parser = foundry.createParser(new ByteArrayInputStream(fileContent));
        PDFAValidator validator = foundry.createValidator(parser.getFlavour(), false)) {

      ValidationResult result = validator.validate(parser);
      if (!result.isCompliant()) {
        throw createPdfAConformanceException();
      }

    } catch (IOException
        | ValidationException
        | ModelParsingException
        | EncryptedPdfException exception) {
      throw createPdfAConformanceException();
    }
  }

  private static BadRequestException createPdfAConformanceException() {
    return new BadRequestException(
        ErrorCode.NONCONFORM_PDF, "Uploaded pdf did not pass conformance level check");
  }
}
