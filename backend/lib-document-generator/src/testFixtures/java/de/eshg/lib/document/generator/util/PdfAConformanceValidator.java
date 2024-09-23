/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.document.generator.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.verapdf.core.EncryptedPdfException;
import org.verapdf.core.ModelParsingException;
import org.verapdf.core.ValidationException;
import org.verapdf.gf.foundry.VeraGreenfieldFoundryProvider;
import org.verapdf.pdfa.Foundries;
import org.verapdf.pdfa.PDFAParser;
import org.verapdf.pdfa.PDFAValidator;
import org.verapdf.pdfa.VeraPDFFoundry;
import org.verapdf.pdfa.results.TestAssertion;
import org.verapdf.pdfa.results.ValidationResult;
import org.verapdf.pdfa.validation.profiles.RuleId;

// tbd: extract this class and the one of lib-procedures into a common library
class PdfAConformanceValidator {

  private static final Logger log = LoggerFactory.getLogger(PdfAConformanceValidator.class);

  private PdfAConformanceValidator() {}

  static {
    VeraGreenfieldFoundryProvider.initialise();
  }

  static void validate(InputStream inputStream) {
    try (VeraPDFFoundry foundry = Foundries.defaultInstance();
        PDFAParser parser = foundry.createParser(inputStream);
        PDFAValidator validator = foundry.createValidator(parser.getFlavour(), false)) {
      log.info("detected PDF/A flavour: {}", parser.getFlavour());
      ValidationResult result = validator.validate(parser);
      if (!result.isCompliant()) {
        throw new PdfAConformanceException(
            "PDF did not pass conformance level check; failures are:\n"
                + getValidationFailureMessage(result)
                + "\nSee https://github.com/veraPDF/veraPDF-validation-profiles/wiki/PDFA-Part-1-rules for details.");
      }
    } catch (IOException | ValidationException | ModelParsingException | EncryptedPdfException ex) {
      throw new PdfAConformanceException("pdf did not pass conformance level check", ex);
    }
  }

  private static String getValidationFailureMessage(ValidationResult result) {
    return result.getFailedChecks().keySet().stream()
        .map(rule -> ruleToString(rule, result))
        .collect(Collectors.joining("\n"));
  }

  private static String ruleToString(RuleId rule, ValidationResult result) {
    return String.format(
        "%s chapter %s, test %s: %s",
        rule.getSpecification(),
        rule.getClause(),
        rule.getTestNumber(),
        getRuleExplanation(rule, result));
  }

  private static String getRuleExplanation(RuleId rule, ValidationResult result) {
    return result.getTestAssertions().stream()
        .filter(a -> rule.equals(a.getRuleId()))
        .findFirst()
        .map(TestAssertion::getMessage)
        .orElse("<unknown>");
  }
}
