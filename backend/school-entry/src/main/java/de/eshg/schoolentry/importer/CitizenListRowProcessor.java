/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.base.CountryCodeDto;
import de.eshg.base.GenderDto;
import de.eshg.schoolentry.api.ProcedureTypeDto;
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
import java.util.stream.IntStream;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;

public class CitizenListRowProcessor extends RowProcessor<CitizenListRowValues> {

  private static final int NUMBER_OF_ADDRESS_FIELDS = 5;
  private static final int NUMBER_OF_CUSTODIAN_FIELDS = 11;

  public CitizenListRowProcessor(Sheet sheet) {
    super(sheet);
  }

  @Override
  protected CitizenListRowValues process(ColumnAccessor col) {
    CitizenListRowValues result = new CitizenListRowValues();
    BiConsumer<Cell, String> errorHandler = createErrorHandler(result);

    result.setChild(processChildData(col, errorHandler));
    result.setCustodians(processCustodiansData(col, errorHandler));
    result.setStatus(processStatus(col.next(), errorHandler));
    result.setProcedureId(processProcedureId(col.next(), errorHandler));

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
        ProcedureTypeDto.DRAFT_CITIZEN_OFFICE_IMPORT,
        false,
        false);
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
      ColumnAccessor col, BiConsumer<Cell, String> errorHandler) {
    String lastName = cellAsString(col.next(), errorHandler);
    String firstName = cellAsString(col.next(), errorHandler);
    AddressData addressData = processAddressData(col, errorHandler, true);
    LocalDate birthDate = cellAsDate(col.next(), errorHandler);
    String placeOfBirth = cellAsString(col.next(), true, true, errorHandler);
    CountryCodeDto countryCodeDto = cellAsCountryCode(col.next(), errorHandler);
    GenderDto genderDto = cellAsGender(col.next(), errorHandler);

    return new ImportChildData(
        firstName, lastName, birthDate, placeOfBirth, countryCodeDto, genderDto, addressData);
  }

  private List<ImportCustodianData> processCustodiansData(
      ColumnAccessor col, BiConsumer<Cell, String> errorHandler) {
    List<ImportCustodianData> custodians = new ArrayList<>();
    while (col.hasNext()) {
      if (anyValueInRange(col, errorHandler, NUMBER_OF_CUSTODIAN_FIELDS)) {
        String firstName = cellAsString(col.next(), errorHandler);
        String lastName = cellAsString(col.next(), errorHandler);

        custodians.add(
            new ImportCustodianData(
                lastName,
                firstName,
                processAddressData(col, errorHandler, false),
                cellAsDate(col.next(), errorHandler),
                cellAsString(col.next(), true, true, errorHandler),
                cellAsSalutation(col.next(), errorHandler),
                cellAsGender(col.next(), errorHandler)));
      } else {
        col.skip(NUMBER_OF_CUSTODIAN_FIELDS);
      }
    }
    return custodians;
  }

  private AddressData processAddressData(
      ColumnAccessor col, BiConsumer<Cell, String> errorHandler, boolean mandatoryAddress) {
    if (anyValueInRange(col, errorHandler, NUMBER_OF_ADDRESS_FIELDS) || mandatoryAddress) {
      String street = cellAsString(col.next(), false, true, errorHandler);
      String houseNumber = cellAsString(col.next(), true, false, errorHandler);
      String postalCode = cellAsString(col.next(), false, false, errorHandler);
      String city = cellAsString(col.next(), false, true, errorHandler);
      String addressAddition = cellAsString(col.next(), true, false, errorHandler);
      return new AddressData(
          CountryCodeDto.DE, city, postalCode, street, houseNumber, addressAddition);
    }
    col.skip(NUMBER_OF_ADDRESS_FIELDS);
    return null;
  }

  private static boolean anyValueInRange(
      ColumnAccessor col, BiConsumer<Cell, String> errorHandler, int range) {
    return IntStream.range(0, range)
        .boxed()
        .map(field -> col.get(col.getCurrentColumn() + field))
        .map(cell -> cellAsString(cell, true, true, errorHandler))
        .anyMatch(org.apache.commons.lang3.StringUtils::isNotBlank);
  }
}
