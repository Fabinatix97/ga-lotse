/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.invitation;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockConfig;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.lib.document.generator.department.DepartmentLogoClient;
import de.eshg.lib.document.generator.qrcode.QrCodeGenerator;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.file.FileFactory;
import de.eshg.schoolentry.SchoolEntryConfigService;
import de.eshg.schoolentry.business.model.ChildData;
import de.eshg.schoolentry.client.DepartmentInfoClient;
import de.eshg.schoolentry.pdf.AbstractGenerator;
import de.eshg.schoolentry.pdf.Address;
import de.eshg.schoolentry.pdf.ReportGeneratorConstants;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class InvitationGenerator extends AbstractGenerator {

  static final String INVITATION_TEMPLATE = "/templates/invitation.ftlx";

  private static final String CITIZEN_PORTAL_LANDING_PAGE_PATH = "esu";

  private final ClassPathResource invitationTemplate;
  private final String citizenPortalUrl;
  private final DocumentGenerator documentGenerator;
  private final Clock clock;
  private final DepartmentLogoClient departmentLogoClient;
  private final SchoolEntryConfigService schoolEntryConfigService;
  private final AppointmentBlockConfig appointmentBlockConfig;

  public InvitationGenerator(
      @Value(INVITATION_TEMPLATE) ClassPathResource invitationTemplate,
      DepartmentInfoClient departmentInfoClient,
      DepartmentLogoClient departmentLogoClient,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") String citizenPortalUrl,
      DocumentGenerator documentGenerator,
      Clock clock,
      AppointmentBlockConfig appointmentBlockConfig,
      ContactClient contactClient,
      SchoolEntryConfigService schoolEntryConfigService) {
    super(departmentInfoClient, contactClient);
    this.departmentLogoClient = departmentLogoClient;
    this.schoolEntryConfigService = schoolEntryConfigService;
    this.appointmentBlockConfig = appointmentBlockConfig;
    Assert.isTrue(invitationTemplate.exists(), () -> invitationTemplate + " does not exist");
    this.invitationTemplate = invitationTemplate;
    this.citizenPortalUrl = citizenPortalUrl;
    this.documentGenerator = documentGenerator;
    this.clock = clock;
  }

  private static String formatAccessCode(String accessCode) {
    List<String> symbols = List.of(accessCode.trim().split(""));
    return ListUtils.partition(symbols, 4).stream()
        .map(list -> String.join("", list))
        .collect(Collectors.joining(" "));
  }

  @VisibleForTesting
  InvitationData buildInvitationData(
      String accessCode, ChildData child, Instant appointmentStart, UUID locationId) {
    String url = buildQrCodeUrl(accessCode);
    String qrCode =
        Base64.getEncoder()
            .encodeToString(QrCodeGenerator.createQrCode(url).getBytes(StandardCharsets.UTF_8));

    Address departmentAddress = getDepartmentAddress();
    DepartmentLogo departmentLogo = departmentLogoClient.getDepartmentLogo();
    Address examinationExecutionLocation;
    if (appointmentBlockConfig.getLocationSelectionMode() != LocationSelectionMode.NONE
        && locationId != null) {
      examinationExecutionLocation = getAddressOfInstitution(locationId);
    } else {
      examinationExecutionLocation = departmentAddress;
    }

    AddressDto address = child.address();
    Address childAddress =
        switch (address) {
          case DomesticAddressDto domesticAddress ->
              new Address(
                  concat(child.firstName(), child.lastName()),
                  concat(
                      domesticAddress.street(),
                      domesticAddress.houseNumber() == null ? "" : domesticAddress.houseNumber()),
                  address.postalCode(),
                  address.city(),
                  null,
                  null,
                  domesticAddress.addressAddition(),
                  null);
          case PostboxAddressDto postboxAddress ->
              new Address(
                  concat(child.firstName(), child.lastName()),
                  "Postfach " + postboxAddress.postbox(),
                  address.postalCode(),
                  address.city(),
                  null,
                  null,
                  null,
                  null);
        };

    ZonedDateTime zonedAppointmentStart = appointmentStart.atZone(clock.getZone());

    InvitationExamination examination =
        new InvitationExamination(
            zonedAppointmentStart.format(ReportGeneratorConstants.DATE_FORMAT_DE),
            zonedAppointmentStart.format(ReportGeneratorConstants.TIME_FORMAT_DE),
            qrCode,
            formatAccessCode(accessCode),
            examinationExecutionLocation);
    InvitationInfo invitationInfo =
        new InvitationInfo(
            examinationExecutionLocation.city(),
            ZonedDateTime.now(clock).format(ReportGeneratorConstants.DATE_FORMAT_DE),
            buildLandingPageUrl());
    return new InvitationData(
        departmentLogo,
        departmentAddress,
        childAddress,
        examination,
        invitationInfo,
        schoolEntryConfigService.getPdfDocumentAccentColor(),
        "#EBEBEB");
  }

  private static String concat(String... strings) {
    return String.join(" ", strings);
  }

  private String buildQrCodeUrl(String accessCode) {
    return UriComponentsBuilder.fromUriString(citizenPortalUrl)
        .pathSegment(CITIZEN_PORTAL_LANDING_PAGE_PATH)
        .queryParam("access_code", accessCode)
        .build()
        .toUriString();
  }

  private String buildLandingPageUrl() {
    String landingPageUrlWithoutScheme =
        UriComponentsBuilder.fromUriString(citizenPortalUrl)
            .pathSegment(CITIZEN_PORTAL_LANDING_PAGE_PATH)
            .scheme(null)
            .build()
            .toUriString();
    return StringUtils.substringAfter(landingPageUrlWithoutScheme, "//");
  }

  public Pdf generateInvitation(
      String accessCode, ChildData childData, Instant start, UUID locationId) {
    InvitationData invitationData = buildInvitationData(accessCode, childData, start, locationId);
    return generateInvitation(invitationData);
  }

  private Pdf generateInvitation(InvitationData invitationData) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    documentGenerator.createPdfFromTemplate(invitationTemplate, invitationData, baos);
    byte[] bytes = baos.toByteArray();

    PdfMetaData pdfMetaData = new PdfMetaData();
    ZonedDateTime now = ZonedDateTime.now(clock);
    pdfMetaData.setCreatedDate(now.toInstant());
    pdfMetaData.setDescription("Einladung " + invitationData.child().name());
    String filename =
        "Einladung_%s_%s.pdf"
            .formatted(
                invitationData.child().name().replace(" ", "_"),
                now.format(ReportGeneratorConstants.FILENAME_TIMESTAMP_FORMAT));
    return FileFactory.createPdfWithMetaData(filename, bytes, pdfMetaData);
  }
}
