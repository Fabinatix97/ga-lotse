/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.pdf;

import static de.eshg.inspection.report.pdf.RepChecklistElement.createChapter;
import static de.eshg.inspection.report.pdf.RepChecklistElement.createChoice;
import static de.eshg.inspection.report.pdf.RepChecklistElement.createFullTextBlock;
import static de.eshg.inspection.report.pdf.RepChecklistElement.createSection;
import static de.eshg.inspection.report.pdf.RepChecklistElement.createSeparator;
import static de.eshg.inspection.report.pdf.RepChecklistElement.createText;
import static de.eshg.inspection.report.pdf.RepChecklistElement.createTextBlock;
import static de.eshg.inspection.report.pdf.RepChecklistElement.createToplevelTitle;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.client.UserClient;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.report.persistence.element.ReportElement;
import de.eshg.inspection.report.persistence.element.ReportElementAudios;
import de.eshg.inspection.report.persistence.element.ReportElementChapter;
import de.eshg.inspection.report.persistence.element.ReportElementFullTextBlock;
import de.eshg.inspection.report.persistence.element.ReportElementImages;
import de.eshg.inspection.report.persistence.element.ReportElementQA;
import de.eshg.inspection.report.persistence.element.ReportElementSection;
import de.eshg.inspection.report.persistence.element.ReportElementText;
import de.eshg.inspection.report.persistence.element.ReportElementTextBlock;
import de.eshg.inspection.report.persistence.element.ReportElementTopLevelTitle;
import de.eshg.inspection.report.persistence.element.ReportElementType;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentClient;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import java.io.OutputStream;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class InspectionReportBuilder {
  public static final String REPORT_TEMPLATE = "/de/eshg/inspection/report/inspection-report.ftlx";

  private static final DateTimeFormatter DATE_FORMATTER_DE =
      DateTimeFormatter.ofPattern("dd.MM.yyyy", Locale.GERMAN);

  private static final DateTimeFormatter DATE_FORMATTER_EN =
      DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH);

  private final ClassPathResource reportTemplate;
  private final DocumentGenerator documentGenerator;
  private final UserClient userClient;
  private final DepartmentClient departmentClient;
  private final FacilityClient facilityClient;

  public InspectionReportBuilder(
      @Value(REPORT_TEMPLATE) ClassPathResource reportTemplate,
      DocumentGenerator documentGenerator,
      UserClient userClient,
      DepartmentClient departmentClient,
      FacilityClient facilityClient) {
    Assert.isTrue(reportTemplate.exists(), reportTemplate + " does not exist");
    this.reportTemplate = reportTemplate;
    this.documentGenerator = documentGenerator;
    this.userClient = userClient;
    this.departmentClient = departmentClient;
    this.facilityClient = facilityClient;
  }

  public RepData createReport(
      Inspection inspection, ZonedDateTime reportDate, OutputStream outputStream) {
    RepData templateData = createReportData(inspection, reportDate);
    documentGenerator.createPdfFromTemplate(reportTemplate, templateData, outputStream);
    return templateData;
  }

  private RepData createReportData(Inspection inspection, ZonedDateTime reportDate) {
    RepFacility facility = createReportFacility(inspection);

    String title = getReportTitle(inspection);
    String objectType = inspection.getFacility().getObjectType().getName();
    String executingPerson = getExecutingPerson(inspection);
    RepContent repContent = new RepContentCreator(inspection, facility).createRepContent();
    RepInspection repInspection = new RepInspection(title, objectType, executingPerson, repContent);

    String reportDateDe = reportDate.format(DATE_FORMATTER_DE);
    String filename = getReportFilename(title, reportDate);
    RepAddress officeAddress = getOfficeAddress();
    RepInfo reportInfo = new RepInfo(officeAddress.city(), reportDateDe, filename);

    DepartmentLogo departmentLogo = getDepartmentLogo();
    return new RepData(departmentLogo, officeAddress, facility, repInspection, reportInfo);
  }

  public DepartmentLogo getDepartmentLogo() {
    return departmentClient.getDepartmentLogo();
  }

  public RepAddress getOfficeAddress() {
    GetDepartmentInfoResponse departmentInfo = departmentClient.getDepartmentInfo();
    return new RepAddress(
        departmentInfo.name(),
        departmentInfo.street() + " " + departmentInfo.houseNumber(),
        null,
        departmentInfo.postalCode(),
        departmentInfo.city(),
        departmentInfo.phoneNumber(),
        null,
        departmentInfo.homepage());
  }

  private RepFacility createReportFacility(Inspection inspection) {
    GetFacilityFileStateResponse baseFacility =
        facilityClient.getFacilityFileState(
            inspection.getRelatedFacility().getCentralFileStateId());
    String street =
        switch (baseFacility.contactAddress()) {
          case DomesticAddressDto domesticAddress ->
              String.join(" ", domesticAddress.street(), domesticAddress.houseNumber());
          case PostboxAddressDto postboxAddress -> "Postfach " + postboxAddress;
        };
    String addressAddition =
        switch (baseFacility.contactAddress()) {
          case DomesticAddressDto domesticAddress -> domesticAddress.addressAddition();
          case PostboxAddressDto ignored -> null;
        };
    String phoneNumber = baseFacility.phoneNumbers().stream().findFirst().orElse(null);
    RepAddress facilityAddress =
        new RepAddress(
            baseFacility.name(),
            street,
            addressAddition,
            baseFacility.contactAddress().postalCode(),
            baseFacility.contactAddress().city(),
            phoneNumber,
            null,
            null);
    String contactPerson =
        baseFacility.contactPersons().stream()
            .findFirst()
            .map(person -> String.join(" ", person.title(), person.firstName(), person.lastName()))
            .orElse(null);
    return new RepFacility(facilityAddress, contactPerson);
  }

  private record RepContentCreator(Inspection inspection, RepFacility facility) {
    public RepContent createRepContent() {
      List<ReportElement> reportElements = inspection.getReport().getReportElements();
      List<RepChecklistElement> elements = reportElements.stream().map(this::mapElement).toList();
      return new RepContent(elements);
    }

    private RepChecklistElement mapElement(ReportElement element) {
      return switch (element.getType()) {
        case TOPLEVEL_TITLE -> mapTopLevelElement((ReportElementTopLevelTitle) element);
        case CHAPTER -> createChapter(((ReportElementChapter) element).getTitle());
        case SECTION -> createSection(((ReportElementSection) element).getTitle());
        case QUESTION_AND_ANSWERS -> mapQAElement((ReportElementQA) element);
        case TEXT -> createText(((ReportElementText) element).getText());
        case TEXT_BLOCK ->
            createTextBlock(
                ((ReportElementTextBlock) element).getTitle(),
                ((ReportElementTextBlock) element).getText());
        case FULL_TEXT_BLOCK ->
            createFullTextBlock(
                ((ReportElementFullTextBlock) element).getTitle(),
                ((ReportElementFullTextBlock) element).getText());
        case IMAGES -> mapImageElement((ReportElementImages) element);
        case SEPARATOR -> createSeparator();
        case AUDIOS -> mapAudioElement((ReportElementAudios) element);
      };
    }

    private RepChecklistElement mapTopLevelElement(ReportElementTopLevelTitle element) {
      String title = element.getTitle();
      String facilityName = facility.address().name();
      // special case: if the title does not already end with the facility name,
      // then we append it, JUST FOR THE PDF REPORT. But it's not stored in the
      // database (except as file, which gets encrypted eventually).
      String suffix = " für " + facilityName;
      if (!title.endsWith(suffix)) {
        title += suffix;
      }
      return createToplevelTitle(title);
    }

    private RepChecklistElement mapAudioElement(ReportElementAudios element) {
      int count = element.getAudioChecklistElementIds().size();
      String text =
          switch (count) {
            case 0 -> "Es wurden keine Audioaufnahmen gemacht.";
            case 1 -> "Es wurde eine Audioaufnahme gemacht.";
            default -> "Es wurden " + count + " Audioaufnahmen gemacht.";
          };

      return createTextBlock(element.getTitle(), text);
    }

    private RepChecklistElement mapQAElement(ReportElementQA element) {
      return createChoice(
          element.getTitle(),
          element.getAnswers().stream()
              .map(
                  answer ->
                      new RepChecklistElement.Choice(
                          answer.getText(), answer.isSelected(), answer.getExtraText()))
              .toList());
    }

    private RepChecklistElement mapImageElement(ReportElementImages element) {
      // for the time being images are not displayed in the report,
      // just an informational text block.
      int count = element.getImageChecklistElementIds().size();
      String text =
          switch (count) {
            case 0 -> "Es wurden keine Aufnahmen gemacht.";
            case 1 -> "Es wurde eine Aufnahme gemacht.";
            default -> "Es wurden " + count + " Aufnahmen gemacht.";
          };

      return createTextBlock(element.getTitle(), text);
    }
  }

  private static String getReportTitle(Inspection inspection) {
    return inspection.getReport().getReportElements().stream()
        .filter(e -> e.getType() == ReportElementType.TOPLEVEL_TITLE)
        .findFirst()
        .map(e -> ((ReportElementTopLevelTitle) e).getTitle())
        .orElse("Begehungsprotokoll");
  }

  private String getExecutingPerson(Inspection inspection) {
    UUID assigneeId = inspection.getExecutionTask().orElseThrow().getAssigneeId();
    UserDto user = userClient.getUserById(assigneeId);
    return String.join(" ", user.firstName(), user.lastName());
  }

  private static String getReportFilename(String title, ZonedDateTime reportDate) {
    String reportDateEn = reportDate.format(DATE_FORMATTER_EN);
    String filename = "%s-%s.pdf".formatted(title, reportDateEn);
    if (!filename.startsWith("Begehungsprotokoll-")) filename = "Begehungsprotokoll-" + filename;
    filename = sanitize(filename);
    return filename;
  }

  private static String sanitize(String filename) {
    // replace everything except latin chars, digits, '_', '.' and '-'
    return filename.replaceAll("(?U)[^\\p{IsLatin}\\d_.-]+", "-");
  }
}
