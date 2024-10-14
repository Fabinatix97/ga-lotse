/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.schoolentry.importer.CitizenListColumn.*;

import de.eshg.base.CountryCodeDto;
import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.business.model.AddressData;
import de.eshg.schoolentry.business.model.ImportChildData;
import de.eshg.schoolentry.business.model.ImportCustodianData;
import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;
import de.eshg.schoolentry.mapper.PersonMapper;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.BiConsumer;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;

public class CitizenListRowProcessor extends RowProcessor<CitizenListRowValues, CitizenListColumn> {

  private static final AddressColumns<CitizenListColumn> CHILD_ADDRESS_COLUMNS =
      new AddressColumns<>(STREET, HOUSE_NUMBER, POSTAL_CODE, CITY, ADDRESS_ADDITION);

  private static final List<CustodianColumns> CUSTODIAN_COLUMNS =
      List.of(
          new CustodianColumns(
              LAST_NAME_CUSTODIAN_1,
              FIST_NAME_CUSTODIAN_1,
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
              FIST_NAME_CUSTODIAN_2,
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

  public CitizenListRowProcessor(Sheet sheet, List<CitizenListColumn> actualColumns) {
    super(sheet, actualColumns);
  }

  @Override
  protected CitizenListRowValues process(ColumnAccessor<CitizenListColumn> col) {
    CitizenListRowValues result = new CitizenListRowValues();
    BiConsumer<Cell, String> errorHandler = createErrorHandler(result);

    result.setChild(processChildData(col, errorHandler));
    if (col.hasColumn(INFORMATION_BLOCK)) {
      result.setInformationBlock(cellAsFlag(col, INFORMATION_BLOCK, errorHandler));
    }
    result.setCustodians(processCustodiansData(col, errorHandler));
    result.setStatus(processStatus(col, STATUS, errorHandler));
    result.setProcedureId(processProcedureId(col, PROCEDURE_ID, errorHandler));

    return result;
  }

  @Override
  public boolean equalRowValues(CitizenListRowValues values1, CitizenListRowValues values2) {
    return Objects.equals(values1.getChild(), values2.getChild())
        && Objects.equals(values1.getCustodians(), values2.getCustodians());
  }

  @Override
  public ImportProcedureData mapValuesToImportData(CitizenListRowValues values) {
    return new ImportProcedureData(
        PersonMapper.mapImportChildDataToCreatePersonDto(values.getChild()),
        values.getCustodians(),
        ProcedureType.DRAFT_CITIZEN_OFFICE_IMPORT,
        null,
        false,
        false,
        values.hasInformationBlock());
  }

  @Override
  public MergeProcedureData mapValuesToMergeData(CitizenListRowValues values) {
    return new MergeProcedureData(
        values.getProcedureId(),
        values.getChild().placeOfBirth(),
        values.getChild().countryOfBirth(),
        values.getCustodians(),
        values.getChild().phoneNumber(),
        null,
        null);
  }

  private ImportChildData processChildData(
      ColumnAccessor<CitizenListColumn> col, BiConsumer<Cell, String> errorHandler) {
    String lastName = cellAsString(col, LAST_NAME, errorHandler);
    String firstName = cellAsString(col, FIST_NAME, errorHandler);
    AddressData addressData = processAddressData(col, CHILD_ADDRESS_COLUMNS, errorHandler, true);
    LocalDate birthDate = cellAsDate(col, DATE_OF_BIRTH, errorHandler);
    String placeOfBirth = cellAsString(col, PLACE_OF_BIRTH, true, false, errorHandler);
    CountryCodeDto countryCodeDto = cellAsCountryCode(col, COUNTRY_OF_BIRTH, errorHandler);
    GenderDto genderDto = cellAsGender(col, GENDER, errorHandler);
    return new ImportChildData(
        firstName, lastName, birthDate, placeOfBirth, countryCodeDto, genderDto, addressData);
  }

  private List<ImportCustodianData> processCustodiansData(
      ColumnAccessor<CitizenListColumn> col, BiConsumer<Cell, String> errorHandler) {
    List<ImportCustodianData> custodians = new ArrayList<>();

    for (CustodianColumns custodian : CUSTODIAN_COLUMNS) {
      if (anyValueInRange(col, custodian, errorHandler)) {
        String firstName = cellAsString(col, custodian.firstName(), errorHandler);
        String lastName = cellAsString(col, custodian.lastName(), errorHandler);
        AddressData address = processAddressData(col, custodian.address(), errorHandler, false);
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
      BiConsumer<Cell, String> errorHandler) {
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
