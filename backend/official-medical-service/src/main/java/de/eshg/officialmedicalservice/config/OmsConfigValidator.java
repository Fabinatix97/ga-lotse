/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.config;

import de.eshg.file.common.FileValidator;
import de.eshg.file.common.YamlValidator;
import de.eshg.officialmedicalservice.concern.ConcernMapper;
import de.eshg.officialmedicalservice.procedure.api.ConcernCategoryConfigDto;
import de.eshg.rest.service.error.BadRequestException;
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

    public OmsConfigValidatorException(String message) {
      super(message);
    }
  }

  private final OmsConfigurationProperties omsConfigurationProperties;

  public void validateConcerns(MultipartFile concerns) throws OmsConfigValidatorException {
    if (concerns != null) {
      try {
        YamlValidator.validate(concerns);
      } catch (BadRequestException bre) {
        throw new OmsConfigValidatorException(
            "invalid concerns file: " + bre.getLocalizedMessage());
      }

      if (concerns.getSize() > omsConfigurationProperties.maxYamlFileSizeBytes()) {
        throw new OmsConfigValidatorException("concerns file too large");
      }

      // schema validation: max. 5 categories containing max. 50 concerns each
      List<Map<String, Object>> yamlList;
      try {
        Yaml yaml = new Yaml();
        yamlList = yaml.load(concerns.getInputStream());
      } catch (IOException ioe) {
        throw new OmsConfigValidatorException(
            "failed to load the concerns file: " + ioe.getLocalizedMessage());
      } catch (ParserException ype) {
        throw new OmsConfigValidatorException(
            "failed to parse the concerns file: " + ype.getLocalizedMessage());
      }
      List<ConcernCategoryConfigDto> categories = ConcernMapper.mapToDto(yamlList);

      int numCategories = categories.size();
      if (numCategories > omsConfigurationProperties.concernsMaxCategories()) {
        throw new OmsConfigValidatorException(
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

  public void validateLandingContent(MultipartFile landingContent, String language)
      throws OmsConfigValidatorException {
    if (landingContent != null) {
      try {
        FileValidator.validateMarkdownFile(landingContent);
      } catch (BadRequestException bre) {
        throw new OmsConfigValidatorException(
            "invalid landing page file (" + language + "): " + bre.getLocalizedMessage());
      }
    }
  }

  private static String categoryName(ConcernCategoryConfigDto category) {
    return category.nameDe() + "/" + category.nameEn();
  }
}
