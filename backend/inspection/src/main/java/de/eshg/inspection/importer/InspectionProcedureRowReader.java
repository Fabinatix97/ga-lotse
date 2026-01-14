/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import static de.eshg.base.address.DomesticAddressDto.MAX_CITY_LENGTH;
import static de.eshg.base.address.DomesticAddressDto.MAX_HOUSE_NUMBER_LENGTH;
import static de.eshg.base.address.DomesticAddressDto.MAX_POSTAL_CODE_LENGTH;
import static de.eshg.base.address.DomesticAddressDto.MAX_STREET_LENGTH;
import static de.eshg.base.centralfile.api.facility.FacilityContactPersonDto.MAX_ROLE_LENGTH;
import static de.eshg.base.gdpr.api.GdprPersonDto.MAX_FIRST_NAME_LENGTH;
import static de.eshg.base.gdpr.api.GdprPersonDto.MAX_LAST_NAME_LENGTH;
import static de.eshg.base.gdpr.api.GdprPersonDto.MAX_PHONE_NUMBER_LENGTH;
import static de.eshg.base.gdpr.api.GdprPersonDto.MAX_TITLE_LENGTH;
import static de.eshg.inspection.importer.InspectionListColumn.CONTACT_EMAIL;
import static de.eshg.inspection.importer.InspectionListColumn.CONTACT_FIRSTNAME;
import static de.eshg.inspection.importer.InspectionListColumn.CONTACT_LASTNAME;
import static de.eshg.inspection.importer.InspectionListColumn.CONTACT_PHONENUMBER;
import static de.eshg.inspection.importer.InspectionListColumn.CONTACT_ROLE;
import static de.eshg.inspection.importer.InspectionListColumn.CONTACT_SALUTATION;
import static de.eshg.inspection.importer.InspectionListColumn.CONTACT_TITLE;
import static de.eshg.inspection.importer.InspectionListColumn.FACILITY_CITY;
import static de.eshg.inspection.importer.InspectionListColumn.FACILITY_EMAIL;
import static de.eshg.inspection.importer.InspectionListColumn.FACILITY_HOUSENUMBER;
import static de.eshg.inspection.importer.InspectionListColumn.FACILITY_NAME;
import static de.eshg.inspection.importer.InspectionListColumn.FACILITY_PHONENUMBER;
import static de.eshg.inspection.importer.InspectionListColumn.FACILITY_STREET;
import static de.eshg.inspection.importer.InspectionListColumn.FACILITY_ZIPCODE;
import static de.eshg.inspection.importer.InspectionListColumn.ID;
import static de.eshg.inspection.importer.InspectionListColumn.INSPECTED_AT;
import static de.eshg.inspection.importer.InspectionListColumn.INSPECTION_INCIDENTS;
import static de.eshg.inspection.importer.InspectionListColumn.INSPECTION_RESULT;
import static de.eshg.inspection.importer.InspectionListColumn.OBJECTTYPE;
import static de.eshg.inspection.importer.InspectionListColumn.PROCEDURE_ID;
import static de.eshg.inspection.importer.InspectionListColumn.STATUS;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import de.eshg.base.centralfile.api.facility.FacilityDetailsDto;
import de.eshg.inspection.inspection.api.InspectionResult;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.ErrorHandler;
import de.eshg.lib.xlsximport.RowReader;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;

class InspectionProcedureRowReader extends RowReader<InspectionImporterRow, InspectionListColumn> {

  private final ImportPersister importPersister;
  private final Clock clock;

  InspectionProcedureRowReader(
      Sheet sheet,
      List<InspectionListColumn> actualColumns,
      ImportPersister importPersister,
      Clock clock) {
    super(sheet, actualColumns, InspectionImporterRow::new, clock);
    this.importPersister = importPersister;
    this.clock = clock;
  }

  @Override
  protected void read(
      InspectionImporterRow result,
      ColumnAccessor<InspectionListColumn> col,
      ErrorHandler errorHandler) {
    result.setFacility(readFacilityData(col, errorHandler));
    result.setInspection(readInspectionData(col, errorHandler));
    result.setStatus(readStatus(col, STATUS, errorHandler));
    result.setEntityId(readUuid(col, PROCEDURE_ID, errorHandler));
  }

  private ImportInspectionFacility readFacilityData(
      ColumnAccessor<InspectionListColumn> col, ErrorHandler errorHandler) {
    String importId = cellAsString(col, ID, true, true, errorHandler);

    String objectTypeName = cellAsString(col, OBJECTTYPE, errorHandler);
    Optional<ObjectType> objectType = importPersister.findObjectType(objectTypeName);
    if (objectType.isEmpty()) {
      errorHandler.handleError(col.get(OBJECTTYPE), "Unbekannter Objekttyp");
    }

    FacilityDetailsDto facilityDetailsDto = readFacilityDetails(col, errorHandler);

    return new ImportInspectionFacility(importId, objectType.orElse(null), facilityDetailsDto);
  }

  private FacilityDetailsDto readFacilityDetails(
      ColumnAccessor<InspectionListColumn> col, ErrorHandler errorHandler) {
    String name =
        cellAsString(col, FACILITY_NAME, FacilityDetailsDto.MAX_NAME_LENGTH, errorHandler);
    String zipCode =
        cellAsString(col, FACILITY_ZIPCODE, false, true, MAX_POSTAL_CODE_LENGTH, errorHandler);
    String city = cellAsString(col, FACILITY_CITY, MAX_CITY_LENGTH, errorHandler);
    String street = cellAsString(col, FACILITY_STREET, MAX_STREET_LENGTH, errorHandler);
    String housenumber =
        cellAsString(col, FACILITY_HOUSENUMBER, true, true, MAX_HOUSE_NUMBER_LENGTH, errorHandler);
    String email = cellAsEmailString(col, FACILITY_EMAIL, true, errorHandler);
    String phonenumber =
        cellAsString(col, FACILITY_PHONENUMBER, true, true, MAX_PHONE_NUMBER_LENGTH, errorHandler);

    DomesticAddressDto contactAddress =
        new DomesticAddressDto(CountryCode.DE, city, zipCode, null, street, housenumber, null);

    FacilityContactPersonDto contactPerson = readFacilityContactPerson(col, errorHandler);

    return new FacilityDetailsDto(
        name,
        StringUtils.isBlank(email) ? List.of() : List.of(email),
        StringUtils.isBlank(phonenumber) ? List.of() : List.of(phonenumber),
        contactPerson == null ? List.of() : List.of(contactPerson),
        contactAddress,
        null);
  }

  private FacilityContactPersonDto readFacilityContactPerson(
      ColumnAccessor<InspectionListColumn> col, ErrorHandler errorHandler) {
    SalutationDto salutation = cellAsSalutation(col, CONTACT_SALUTATION, errorHandler);
    String title = cellAsString(col, CONTACT_TITLE, true, false, MAX_TITLE_LENGTH, errorHandler);
    String role = cellAsString(col, CONTACT_ROLE, true, false, MAX_ROLE_LENGTH, errorHandler);
    String firstName =
        cellAsString(col, CONTACT_FIRSTNAME, true, false, MAX_FIRST_NAME_LENGTH, errorHandler);
    String lastName =
        cellAsString(col, CONTACT_LASTNAME, true, false, MAX_LAST_NAME_LENGTH, errorHandler);
    String email = cellAsEmailString(col, CONTACT_EMAIL, true, errorHandler);
    String phonenumber =
        cellAsString(col, CONTACT_PHONENUMBER, true, true, MAX_PHONE_NUMBER_LENGTH, errorHandler);

    // If every contact field is empty then don't create a contact
    if (salutation == null
        && StringUtils.isBlank(title)
        && StringUtils.isBlank(role)
        && StringUtils.isBlank(firstName)
        && StringUtils.isBlank(lastName)
        && StringUtils.isBlank(email)
        && StringUtils.isBlank(phonenumber)) {
      return null;
    }

    // Some fields are filled. Ensure that lastName is given.
    if (StringUtils.isBlank(lastName)) {
      errorHandler.handleError(
          col.get(CONTACT_LASTNAME),
          "Kontakt Name muss festgelegt werden, wenn andere Kontakt-Felder angegeben sind.");
      return null;
    }

    return new FacilityContactPersonDto(
        email,
        phonenumber,
        role,
        lastName,
        firstName,
        title,
        salutation,
        GenderDto.NOT_SPECIFIED,
        false);
  }

  private ImportInspection readInspectionData(
      ColumnAccessor<InspectionListColumn> col, ErrorHandler errorHandler) {
    LocalDateTime inspectedAt = cellAsDateTime(col, INSPECTED_AT, errorHandler);
    InspectionResult inspectionResult = cellAsInspectionResult(col, errorHandler);
    String incidents = cellAsString(col, INSPECTION_INCIDENTS, true, true, errorHandler);
    return new ImportInspection(toInstant(inspectedAt), inspectionResult, incidents);
  }

  private InspectionResult cellAsInspectionResult(
      ColumnAccessor<InspectionListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(INSPECTION_RESULT);
    String result = cellAsString(col, INSPECTION_RESULT, false, false, errorHandler);
    return switch (result) {
      case "Erfolgreich" -> InspectionResult.SUCCESSFUL;
      case "Erfolgreich mit Beanstandungen" -> InspectionResult.SUCCESSFUL_WITH_INCIDENTS;
      case "Negativ" -> InspectionResult.FAILED;
      case null, default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Erwartet: \"Erfolgreich\", \"Erfolgreich mit Beanstandungen\", \"Negativ\"; Tatsächlich: \"%s\")"
                .formatted(result));
        yield null;
      }
    };
  }

  private Instant toInstant(LocalDateTime dateTime) {
    if (dateTime == null) return null;
    if (dateTime.getHour() == 0 && dateTime.getMinute() == 0 && dateTime.getSecond() == 0) {
      // if the time is 0:00h then there is no time set in the excel-sheet
      dateTime = dateTime.plusHours(10);
    }
    return dateTime.atZone(clock.getZone()).toInstant();
  }
}
