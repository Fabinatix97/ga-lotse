/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import de.eshg.base.config.DepartmentConfigurationService;
import de.eshg.base.street.csv.CsvMapper;
import de.eshg.base.street.csv.MunicipalityDirectoryCsvEntry;
import java.util.List;
import org.apache.commons.lang3.Range;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class MunicipalityDirectory {

  private record DirectoryEntry(String key, String municipality, Range<String> range) {

    public static DirectoryEntry from(MunicipalityDirectoryCsvEntry csvEntry) {
      return new DirectoryEntry(
          csvEntry.municipalityKey(),
          csvEntry.municipality(),
          Range.of(csvEntry.postalCodeFrom(), csvEntry.postalCodeTo()));
    }
  }

  private final List<DirectoryEntry> entries;

  public MunicipalityDirectory(DepartmentConfigurationService departmentConfigurationService) {
    List<MunicipalityDirectoryCsvEntry> csvEntries =
        CsvMapper.csvToBeans(
            departmentConfigurationService.getMunicipalityDirectory(),
            MunicipalityDirectoryCsvEntry.class);
    this.entries = convertToDirectoryStructure(csvEntries);
  }

  private List<DirectoryEntry> convertToDirectoryStructure(
      List<MunicipalityDirectoryCsvEntry> entries) {
    return entries.stream().map(DirectoryEntry::from).toList();
  }

  public AdministrativeData getAdministrativeDataBy(String postalCode) {
    Assert.notNull(postalCode, "postalCode must not be null");

    return entries.stream()
        .filter(directoryEntry -> directoryEntry.range.contains(postalCode))
        .findFirst()
        .map(
            directoryEntry ->
                new AdministrativeData(directoryEntry.key, directoryEntry.municipality))
        .orElse(new AdministrativeData(null, null));
  }

  public record AdministrativeData(String municipalityKey, String municipality) {}
}
