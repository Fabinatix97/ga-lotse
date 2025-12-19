/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.invitation;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.person.PersonDetails;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserProfileDto;
import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
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
import de.eshg.schoolentry.api.pdf.Address;
import de.eshg.schoolentry.business.model.ChildData;
import de.eshg.schoolentry.client.DepartmentInfoClient;
import de.eshg.schoolentry.pdf.AbstractGenerator;
import de.eshg.schoolentry.pdf.ReportGeneratorConstants;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.List;
import java.util.StringJoiner;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.util.Strings;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.VisibleForTesting;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class InvitationGenerator extends AbstractGenerator {

  static final String INVITATION_TEMPLATE = "/templates/invitation.ftlx";

  private static final String CITIZEN_PORTAL_LANDING_PAGE_PATH = "esu";

  private static final Logger log = LoggerFactory.getLogger(InvitationGenerator.class);

  private final ClassPathResource invitationTemplate;
  private final String citizenPortalUrl;
  private final DocumentGenerator documentGenerator;
  private final Clock clock;
  private final DepartmentLogoClient departmentLogoClient;
  private final SchoolEntryConfigService schoolEntryConfigService;
  private final AppointmentBlockConfig appointmentBlockConfig;
  private final UserApi userClient;

  public InvitationGenerator(
      @Value(INVITATION_TEMPLATE) ClassPathResource invitationTemplate,
      DepartmentInfoClient departmentInfoClient,
      DepartmentLogoClient departmentLogoClient,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") String citizenPortalUrl,
      DocumentGenerator documentGenerator,
      Clock clock,
      AppointmentBlockConfig appointmentBlockConfig,
      ContactClient contactClient,
      SchoolEntryConfigService schoolEntryConfigService,
      UserApi userClient) {
    super(departmentInfoClient, contactClient);
    this.departmentLogoClient = departmentLogoClient;
    this.schoolEntryConfigService = schoolEntryConfigService;
    this.appointmentBlockConfig = appointmentBlockConfig;
    Assert.isTrue(invitationTemplate.exists(), () -> invitationTemplate + " does not exist");
    this.invitationTemplate = invitationTemplate;
    this.citizenPortalUrl = citizenPortalUrl;
    this.documentGenerator = documentGenerator;
    this.clock = clock;
    this.userClient = userClient;
  }

  private static String formatAccessCode(String accessCode) {
    List<String> symbols = List.of(accessCode.trim().split(""));
    return ListUtils.partition(symbols, 4).stream()
        .map(list -> String.join("", list))
        .collect(Collectors.joining(" "));
  }

  @VisibleForTesting
  InvitationData buildInvitationData(
      String accessCode,
      ChildDataWithPersonIdAndCustodian childDataWithPersonIdAndCustodian,
      Instant appointmentStart,
      UUID locationId,
      UUID examinerId,
      String room) {
    String url = buildQrCodeUrl(accessCode);
    String qrCode =
        Base64.getEncoder()
            .encodeToString(QrCodeGenerator.createQrCode(url).getBytes(StandardCharsets.UTF_8));

    Address departmentAddress = getDepartmentAddress();
    DepartmentLogo departmentLogo = departmentLogoClient.getDepartmentLogo();
    Address examinationExecutionLocation;
    LocationSelectionMode locationSelectionMode = appointmentBlockConfig.getLocationSelectionMode();
    if (locationSelectionMode != LocationSelectionMode.NONE && locationId != null) {
      examinationExecutionLocation = getAddressOfInstitution(locationId);
      if (locationSelectionMode == LocationSelectionMode.HEALTH_DEPARTMENT) {
        departmentAddress = examinationExecutionLocation;
      }
    } else {
      examinationExecutionLocation = departmentAddress;
    }

    ChildData child = childDataWithPersonIdAndCustodian.childData();

    Address childAddress = buildAddress(child.address(), child.firstName(), child.lastName());
    Address custodianAddress =
        getCustodianAddressIfExists(childDataWithPersonIdAndCustodian.custodian());

    ZonedDateTime zonedAppointmentStart = appointmentStart.atZone(clock.getZone());

    String examiner = null;
    if (schoolEntryConfigService.isInvitationIncludePerson() && examinerId != null) {
      examiner = getUserName(examinerId);
    }

    String roomName = null;
    if (schoolEntryConfigService.isInvitationIncludeRoom() && Strings.isNotEmpty(room)) {
      roomName = room.replaceFirst("(?i)^raum\\s*", "");
    }

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
        custodianAddress,
        childDataWithPersonIdAndCustodian.personId(),
        examination,
        invitationInfo,
        schoolEntryConfigService.getPdfDocumentAccentColor(),
        "#EBEBEB",
        examiner,
        roomName);
  }

  private String getUserName(UUID userId) {
    UserProfileDto user = getUser(userId);
    if (user == null) return null;
    StringJoiner name = new StringJoiner(" ");
    if (user.title() != null) {
      name.add(user.title());
    }
    name.add(user.user().firstName());
    name.add(user.user().lastName());
    return name.toString();
  }

  private UserProfileDto getUser(UUID userid) {
    try {
      return userClient.getUserProfile(userid);
    } catch (HttpClientErrorException.NotFound ex) {
      log.error("Could not find user with id {}.", userid);
      return null;
    }
  }

  private Address getCustodianAddressIfExists(PersonDetails custodian) {
    if (custodian == null) {
      return null;
    }

    return buildAddress(custodian.contactAddress(), custodian.firstName(), custodian.lastName());
  }

  private static @NotNull Address buildAddress(
      AddressDto address, String firstName, String lastName) {
    return switch (address) {
      case DomesticAddressDto domesticAddress ->
          new Address(
              concat(firstName, lastName),
              concat(domesticAddress.street(), domesticAddress.houseNumber()),
              address.postalCode(),
              address.city(),
              null,
              null,
              domesticAddress.addressAddition(),
              null);
      case PostboxAddressDto postboxAddress ->
          new Address(
              concat(firstName, lastName),
              "Postfach " + postboxAddress.postbox(),
              address.postalCode(),
              address.city(),
              null,
              null,
              null,
              null);
    };
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
      String accessCode,
      ChildDataWithPersonIdAndCustodian childDataWithPersonIdAndCustodian,
      Instant start,
      UUID locationId,
      UUID examinerId,
      String room) {
    InvitationData invitationData =
        buildInvitationData(
            accessCode, childDataWithPersonIdAndCustodian, start, locationId, examinerId, room);
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
