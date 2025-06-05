/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.file.common.CustomMediaTypes;
import de.eshg.file.common.FileType;
import de.eshg.file.common.FileTypeDetector;
import de.eshg.file.common.FileValidator;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.rest.service.error.BadRequestException;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.multipart.MultipartFile;

@Component
public class SvgValidations {

  private static final ClassPathResource TEMPLATE_FILE =
      new ClassPathResource("document-with-svg-for-validation.ftlx");

  private final DocumentGenerator documentGenerator;
  private final BaseConfigurationProperties baseConfigurationProperties;

  public SvgValidations(
      DocumentGenerator documentGenerator,
      BaseConfigurationProperties baseConfigurationProperties) {
    this.documentGenerator = documentGenerator;
    this.baseConfigurationProperties = baseConfigurationProperties;
  }

  void validateSvg(byte[] svgBytes) {
    validateFileType(FileTypeDetector.getSupportedFileTypeOrThrow(svgBytes));
    validateFileSize(svgBytes.length);
  }

  void validateSvg(MultipartFile svgFile) {
    MediaType mediaType = FileValidator.validate(svgFile);
    validateFileType(mediaType);
    validateFileSize(svgFile.getSize());
  }

  void validateFileType(FileType fileType) {
    validateFileType(fileType.getMediaType());
  }

  void validateFileType(MediaType mediaType) {
    if (!FileType.SVG.getMediaType().isCompatibleWith(mediaType)) {
      throw new BadRequestException("Wrong media type " + mediaType);
    }
  }

  private void validateFileSize(long size) {
    if (size > baseConfigurationProperties.maxLogoSvgFileSizeBytes()) {
      throw new BadRequestException("File is too large");
    }
  }

  void validateThatPdfGenerationIsPossible(byte[] svgBytes) {
    try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
      DepartmentLogo departmentLogo =
          new DepartmentLogo(
              CustomMediaTypes.IMAGE_SVG_XML, Base64.getEncoder().encodeToString(svgBytes));
      TemplateData templateData = new TemplateData(departmentLogo);
      documentGenerator.createPdfFromTemplate(TEMPLATE_FILE, templateData, byteArrayOutputStream);
      Assert.isTrue(byteArrayOutputStream.toByteArray().length > 0, "Pdf generation failed");
    } catch (Exception e) {
      throw new BadRequestException("Pdf generation failed");
    }
  }

  // needs to be public for pdf generation to work
  public record TemplateData(DepartmentLogo departmentLogo) {}
}
