/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.invitation;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentClient;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.lib.procedure.domain.model.FileType;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.file.FileFactory;
import de.eshg.schoolentry.business.model.ChildData;
import de.eshg.schoolentry.pdf.Address;
import de.eshg.schoolentry.pdf.QrCodeGenerator;
import de.eshg.schoolentry.pdf.ReportGeneratorConstants;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.List;
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
public class InvitationGenerator {

  static final String INVITATION_TEMPLATE = "/templates/invitation.ftlx";

  private static final String CITIZEN_PORTAL_LANDING_PAGE_PATH = "esu";

  private final ClassPathResource invitationTemplate;
  private final DepartmentClient departmentClient;
  private final String citizenPortalUrl;
  private final DocumentGenerator documentGenerator;
  private final Clock clock;

  public InvitationGenerator(
      @Value(INVITATION_TEMPLATE) ClassPathResource invitationTemplate,
      DepartmentClient departmentClient,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") String citizenPortalUrl,
      DocumentGenerator documentGenerator,
      Clock clock) {
    Assert.isTrue(invitationTemplate.exists(), () -> invitationTemplate + " does not exist");
    this.invitationTemplate = invitationTemplate;
    this.departmentClient = departmentClient;
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
  InvitationData buildInvitationData(String accessCode, ChildData child, Instant appointmentStart) {
    String url = buildQrCodeUrl(accessCode);
    String qrCode =
        Base64.getEncoder()
            .encodeToString(QrCodeGenerator.createQrCode(url).getBytes(StandardCharsets.UTF_8));

    Address departmentAddress = fetchDepartmentAddress();
    DepartmentLogo departmentLogo = departmentClient.getDepartmentLogo();

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
            formatAccessCode(accessCode));
    InvitationInfo invitationInfo =
        new InvitationInfo(
            "Frankfurt am Main",
            ZonedDateTime.now(clock).format(ReportGeneratorConstants.DATE_FORMAT_DE),
            buildLandingPageUrl());
    return new InvitationData(
        departmentLogo,
        departmentAddress,
        childAddress,
        examination,
        invitationInfo,
        "#21BBEF",
        "#EBEBEB");
  }

  private Address fetchDepartmentAddress() {
    GetDepartmentInfoResponse departmentInfo = departmentClient.getDepartmentInfo();
    return new Address(
        departmentInfo.name(),
        departmentInfo.street() + " " + departmentInfo.houseNumber(),
        departmentInfo.postalCode(),
        departmentInfo.city(),
        departmentInfo.phoneNumber(),
        departmentInfo.homepage(),
        null,
        departmentInfo.email());
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

  public Pdf generateInvitation(String accessCode, ChildData childData, Instant start) {
    InvitationData invitationData = buildInvitationData(accessCode, childData, start);
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
    return FileFactory.createPdfWithMetaData(filename, FileType.PDF, bytes, pdfMetaData, false);
  }
}
