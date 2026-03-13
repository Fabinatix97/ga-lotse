/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.config;

import de.eshg.file.common.FileValidator;
import de.eshg.file.common.YamlValidator;
import de.eshg.officialmedicalservice.concern.ConcernMapper;
import de.eshg.officialmedicalservice.procedure.api.ConcernCategoryConfigDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.i18n.Language;
import java.io.IOException;
import java.io.Serial;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.parser.ParserException;

@Component
public class OmsConfigValidator {
  public OmsConfigValidator(OmsConfigurationProperties omsConfigurationProperties) {
    this.omsConfigurationProperties = omsConfigurationProperties;
  }

  public static class OmsConfigValidatorException extends Exception {
    @Serial private static final long serialVersionUID = 1L;

    public static final String CONCERNS_DOCUMENT = "concerns";

    private final String whichDocument;

    public OmsConfigValidatorException(String whichDocument, String message) {
      super(message);
      this.whichDocument = whichDocument;
    }

    public String getWhichDocument() {
      return whichDocument;
    }
  }

  private final OmsConfigurationProperties omsConfigurationProperties;

  public void validateConcerns(MultipartFile concerns) throws OmsConfigValidatorException {
    if (concerns != null) {
      try {
        YamlValidator.validate(concerns);
      } catch (BadRequestException bre) {
        throw new OmsConfigValidatorException(
            OmsConfigValidatorException.CONCERNS_DOCUMENT, bre.getLocalizedMessage());
      }

      if (concerns.getSize() > omsConfigurationProperties.maxYamlFileSizeBytes()) {
        throw new OmsConfigValidatorException(
            OmsConfigValidatorException.CONCERNS_DOCUMENT,
            "file too large - maximum size is "
                + omsConfigurationProperties.maxYamlFileSizeBytes()
                + " bytes ");
      }

      // schema validation: max. 5 categories containing max. 50 concerns each
      List<Map<String, Object>> yamlList;
      try {
        Yaml yaml = new Yaml();
        yamlList = yaml.load(concerns.getInputStream());
      } catch (IOException ioe) {
        throw new OmsConfigValidatorException(
            OmsConfigValidatorException.CONCERNS_DOCUMENT,
            "failed to load the file: " + ioe.getLocalizedMessage());
      } catch (ParserException ype) {
        throw new OmsConfigValidatorException(
            OmsConfigValidatorException.CONCERNS_DOCUMENT,
            "failed to parse the file: " + ype.getLocalizedMessage());
      }
      List<ConcernCategoryConfigDto> categories = ConcernMapper.mapToDto(yamlList);

      int numCategories = categories.size();
      if (numCategories > omsConfigurationProperties.concernsMaxCategories()) {
        throw new OmsConfigValidatorException(
            OmsConfigValidatorException.CONCERNS_DOCUMENT,
            "too many categories: "
                + numCategories
                + " (up to "
                + omsConfigurationProperties.concernsMaxCategories()
                + " categories permitted)");
      }

      for (ConcernCategoryConfigDto category : categories) {
        int numConcerns = category.concerns().size();
        if (numConcerns > omsConfigurationProperties.concernsMaxConcernsPerCategory()) {
          throw new OmsConfigValidatorException(
              OmsConfigValidatorException.CONCERNS_DOCUMENT,
              "too many concerns in category "
                  + categoryName(category)
                  + ": "
                  + numConcerns
                  + " (up to "
                  + omsConfigurationProperties.concernsMaxConcernsPerCategory()
                  + " per category permitted)");
        }
      }
    }
  }

  public void validateContent(MultipartFile content, Language language, String name)
      throws OmsConfigValidatorException {
    if (content != null) {
      try {
        FileValidator.validateMarkdownFile(content);
      } catch (BadRequestException bre) {
        throw new OmsConfigValidatorException(
            "landing page (" + Language.LANGUAGE_TO_LANGUAGE_TAG.get(language) + ")",
            "invalid " + name + " file (" + language + "): " + bre.getLocalizedMessage());
      }
    }
  }

  private static String categoryName(ConcernCategoryConfigDto category) {
    return category.names().get(Language.GERMAN) + "/" + category.names().get(Language.ENGLISH);
  }
}
