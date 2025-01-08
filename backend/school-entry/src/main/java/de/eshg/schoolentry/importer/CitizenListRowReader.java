/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.schoolentry.importer.CitizenListColumn.*;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.ErrorHandler;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.lib.xlsximport.model.AddressData;
import de.eshg.schoolentry.business.model.ImportChildData;
import de.eshg.schoolentry.business.model.ImportCustodianData;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.apache.poi.ss.usermodel.Sheet;

public class CitizenListRowReader extends RowReader<CitizenListRow, CitizenListColumn> {

  private static final AddressColumns<CitizenListColumn> CHILD_ADDRESS_COLUMNS =
      new AddressColumns<>(STREET, HOUSE_NUMBER, POSTAL_CODE, CITY, ADDRESS_ADDITION);

  private static final List<CustodianColumns> CUSTODIAN_COLUMNS =
      List.of(
          new CustodianColumns(
              LAST_NAME_CUSTODIAN_1,
              FIRST_NAME_CUSTODIAN_1,
              new AddressColumns<>(
                  STREET_CUSTODIAN_1,
                  HOUSE_NUMBER_CUSTODIAN_1,
                  POSTAL_CODE_CUSTODIAN_1,
                  CITY_CUSTODIAN_1,
                  ADDRESS_ADDITION_CUSTODIAN_1),
              DATE_OF_BIRTH_CUSTODIAN_1,
              TITLE_CUSTODIAN_1,
              SALUTATION_CUSTODIAN_1,
              GENDER_CUSTODIAN_1),
          new CustodianColumns(
              LAST_NAME_CUSTODIAN_2,
              FIRST_NAME_CUSTODIAN_2,
              new AddressColumns<>(
                  STREET_CUSTODIAN_2,
                  HOUSE_NUMBER_CUSTODIAN_2,
                  POSTAL_CODE_CUSTODIAN_2,
                  CITY_CUSTODIAN_2,
                  ADDRESS_ADDITION_CUSTODIAN_2),
              DATE_OF_BIRTH_CUSTODIAN_2,
              TITLE_CUSTODIAN_2,
              SALUTATION_CUSTODIAN_2,
              GENDER_CUSTODIAN_2));

  public CitizenListRowReader(Sheet sheet, List<CitizenListColumn> actualColumns) {
    super(sheet, actualColumns, CitizenListRow::new);
  }

  @Override
  protected void read(
      CitizenListRow result, ColumnAccessor<CitizenListColumn> col, ErrorHandler errorHandler) {
    result.setChild(readChildData(col, errorHandler));
    if (col.hasColumn(INFORMATION_BLOCK)) {
      result.setInformationBlock(cellAsFlag(col, INFORMATION_BLOCK, errorHandler));
    }
    result.setCustodians(readCustodiansData(col, errorHandler));
    result.setStatus(readStatus(col, STATUS, errorHandler));
    result.setEntityId(readUuid(col, PROCEDURE_ID, errorHandler));
  }

  private ImportChildData readChildData(
      ColumnAccessor<CitizenListColumn> col, ErrorHandler errorHandler) {
    String lastName = cellAsString(col, LAST_NAME, errorHandler);
    String firstName = cellAsString(col, FIRST_NAME, errorHandler);
    AddressData addressData = readAddressData(col, CHILD_ADDRESS_COLUMNS, errorHandler, true);
    LocalDate birthDate = cellAsDate(col, DATE_OF_BIRTH, errorHandler);
    String placeOfBirth = cellAsString(col, PLACE_OF_BIRTH, true, false, errorHandler);
    CountryCode countryCode = cellAsCountryCode(col, COUNTRY_OF_BIRTH, errorHandler);
    GenderDto genderDto = cellAsGender(col, GENDER, errorHandler);
    return new ImportChildData(
        firstName, lastName, birthDate, placeOfBirth, countryCode, genderDto, addressData);
  }

  private List<ImportCustodianData> readCustodiansData(
      ColumnAccessor<CitizenListColumn> col, ErrorHandler errorHandler) {
    List<ImportCustodianData> custodians = new ArrayList<>();

    for (CustodianColumns custodian : CUSTODIAN_COLUMNS) {
      if (anyValueInRange(col, custodian, errorHandler)) {
        String firstName = cellAsString(col, custodian.firstName(), errorHandler);
        String lastName = cellAsString(col, custodian.lastName(), errorHandler);
        AddressData address = readAddressData(col, custodian.address(), errorHandler, false);
        LocalDate dateOfBirth = cellAsDate(col, custodian.dateOfBirth(), errorHandler);
        String title = cellAsString(col, custodian.title(), true, false, errorHandler);
        SalutationDto salutation = cellAsSalutation(col, custodian.salutation(), errorHandler);
        GenderDto gender = cellAsGender(col, custodian.gender(), errorHandler);

        custodians.add(
            new ImportCustodianData(
                firstName, lastName, address, dateOfBirth, title, salutation, gender));
      }
    }
    return custodians;
  }

  private static boolean anyValueInRange(
      ColumnAccessor<CitizenListColumn> col,
      CustodianColumns custodianColumns,
      ErrorHandler errorHandler) {
    return anyValueInRange(
        col.getRange(custodianColumns.lastName(), custodianColumns.gender()), errorHandler);
  }

  private record CustodianColumns(
      CitizenListColumn lastName,
      CitizenListColumn firstName,
      AddressColumns<CitizenListColumn> address,
      CitizenListColumn dateOfBirth,
      CitizenListColumn title,
      CitizenListColumn salutation,
      CitizenListColumn gender) {}
}
