/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.pdf;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.lib.document.generator.department.DepartmentLogoClient;
import de.eshg.prostituteprotection.crypto.DecryptedPersonalDataDto;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.Assert;

public abstract class AbstractGenerator {

  private final ClassPathResource template;
  private final DepartmentLogoClient departmentLogoClient;
  private final DepartmentInfoConfigService departmentInfoConfigService;
  private final DocumentGenerator documentGenerator;
  private final Clock clock;

  protected AbstractGenerator(
      ClassPathResource template,
      DepartmentLogoClient departmentLogoClient,
      DepartmentInfoConfigService departmentInfoConfigService,
      DocumentGenerator documentGenerator,
      Clock clock) {
    this.template = template;
    this.departmentLogoClient = departmentLogoClient;
    this.departmentInfoConfigService = departmentInfoConfigService;
    this.documentGenerator = documentGenerator;
    this.clock = clock;
    Assert.isTrue(template.exists(), () -> template + " does not exist");
  }

  protected ByteArrayResource generateByteArrayResource(
      Object templateData, PrintDocumentType printDocumentType) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    documentGenerator.createPdfFromTemplate(template, templateData, baos);
    ZonedDateTime now = ZonedDateTime.now(clock);

    return new ByteArrayResource(baos.toByteArray(), printDocumentType.getDescription()) {
      @Override
      public String getFilename() {
        return "%s_%s.pdf"
            .formatted(
                printDocumentType.getFileNamePrefix(),
                now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss", Locale.GERMANY)));
      }
    };
  }

  protected static PersonData getPersonData(
      ProstituteProtectionProcedure procedure,
      DecryptedPersonalDataDto decryptedPersonalDataDto,
      boolean withAlias) {
    return new PersonData(
        decryptedPersonalDataDto.firstName(),
        decryptedPersonalDataDto.lastName(),
        getFormattedDate(decryptedPersonalDataDto.dateOfBirth()),
        withAlias ? procedure.getPersonalData().getAlias() : null,
        procedure.getPersonalData().getNationality().name());
  }

  protected LocalDate toLocalDate(Instant instant) {
    return instant.atZone(clock.getZone()).toLocalDate();
  }

  protected static String getFormattedDate(LocalDate date) {
    return date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
  }

  protected DepartmentData getDepartmentData() {
    DepartmentLogo departmentLogo = departmentLogoClient.getDepartmentLogo();
    GetDepartmentInfoResponse departmentInfo = departmentInfoConfigService.getDepartmentInfo();
    return new DepartmentData(
        departmentInfo.name(),
        "%s %s".formatted(departmentInfo.street(), departmentInfo.houseNumber()),
        departmentInfo.postalCode(),
        departmentInfo.city(),
        departmentInfo.homepage(),
        departmentInfo.email(),
        departmentLogo.contentType(),
        departmentLogo.contentAsBase64());
  }
}
