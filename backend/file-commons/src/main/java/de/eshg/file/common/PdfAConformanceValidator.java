/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.function.Function;
import org.verapdf.core.EncryptedPdfException;
import org.verapdf.core.ModelParsingException;
import org.verapdf.core.ValidationException;
import org.verapdf.gf.foundry.VeraGreenfieldFoundryProvider;
import org.verapdf.pdfa.Foundries;
import org.verapdf.pdfa.PDFAParser;
import org.verapdf.pdfa.PDFAValidator;
import org.verapdf.pdfa.VeraPDFFoundry;
import org.verapdf.pdfa.results.ValidationResult;

public class PdfAConformanceValidator {

  private PdfAConformanceValidator() {}

  static {
    VeraGreenfieldFoundryProvider.initialise();
  }

  public static void validate(byte[] fileContent) {
    validate(fileContent, message -> new BadRequestException(ErrorCode.NONCONFORM_PDF, message));
  }

  public static void validate(
      byte[] fileContent, Function<String, RuntimeException> exceptionCreator) {
    try (VeraPDFFoundry foundry = Foundries.defaultInstance();
        PDFAParser parser = foundry.createParser(new ByteArrayInputStream(fileContent));
        PDFAValidator validator = foundry.createValidator(parser.getFlavour(), false)) {

      ValidationResult result = validator.validate(parser);
      if (!result.isCompliant()) {
        throw createPdfAConformanceException(exceptionCreator);
      }

    } catch (IOException
        | ValidationException
        | ModelParsingException
        | EncryptedPdfException exception) {
      throw createPdfAConformanceException(exceptionCreator);
    }
  }

  private static RuntimeException createPdfAConformanceException(
      Function<String, RuntimeException> exceptionCreator) {
    return exceptionCreator.apply("Uploaded pdf did not pass conformance level check");
  }
}
