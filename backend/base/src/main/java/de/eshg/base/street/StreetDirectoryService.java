/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.config.DepartmentConfigurationService;
import de.eshg.base.street.csv.CsvMapper;
import de.eshg.base.street.csv.StreetDirectoryCsvEntry;
import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.collections4.trie.PatriciaTrie;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StreetDirectoryService implements StreetDirectory {

  private enum OddEven {
    ODD,
    EVEN
  }

  private record StreetDirectoryEntry(String streetName, List<StreetSequence> sequences) {}

  private record StreetSequence(
      OddEven oddEven, HouseNumber from, HouseNumber to, AdministrativeData administrativeData) {}

  private final PatriciaTrie<StreetDirectoryEntry> directory;

  @Autowired
  public StreetDirectoryService(DepartmentConfigurationService departmentConfigurationService) {
    this(
        CsvMapper.csvToBeans(
            departmentConfigurationService.getConfig().getStreetDirectory(),
            StreetDirectoryCsvEntry.class));
  }

  public StreetDirectoryService(List<StreetDirectoryCsvEntry> csvEntries) {
    this.directory = convertToDirectoryMap(new ArrayList<>(csvEntries));
  }

  public Set<AdministrativeData> getAdministrativeDataByStreetName(String streetName) {
    return directory.prefixMap(normalizeStreetNameForAutocomplete(streetName)).values().stream()
        .flatMap(enty -> enty.sequences.stream())
        .map(StreetSequence::administrativeData)
        .collect(StreamUtil.toLinkedHashSet());
  }

  private String normalizeStreetNameForAutocomplete(String streetName) {
    return streetName.toLowerCase(Locale.GERMAN);
  }

  private PatriciaTrie<StreetDirectoryEntry> convertToDirectoryMap(
      List<StreetDirectory.EntryFields> csvEntries) {
    Map<String, List<StreetDirectory.EntryFields>> streetMap =
        csvEntries.stream().collect(Collectors.groupingBy(StreetDirectory.EntryFields::streetName));

    Set<String> streetNames = streetMap.keySet();

    PatriciaTrie<StreetDirectoryEntry> result = new PatriciaTrie<>();

    for (String streetName : streetNames) {
      List<StreetDirectory.EntryFields> streetSequences = streetMap.get(streetName);
      StreetDirectoryEntry newEntry = convertMultipleEntries(streetName, streetSequences);
      StreetDirectoryEntry oldEntry =
          result.put(normalizeStreetNameForAutocomplete(streetName), newEntry);
      if (oldEntry != null && !oldEntry.sequences.equals(newEntry.sequences)) {
        throw new IllegalStateException("Duplicate street entry found for '" + streetName + "'");
      }
    }

    return result;
  }

  private StreetDirectoryEntry convertMultipleEntries(
      String streetName, List<StreetDirectory.EntryFields> inputData) {
    return new StreetDirectoryEntry(
        streetName, inputData.stream().map(this::convertToStreetSequence).toList());
  }

  private StreetSequence convertToStreetSequence(StreetDirectory.EntryFields inputData) {
    return new StreetSequence(
        getOddEven(inputData.evenOddSequence()),
        parseHouseNumber(inputData.houseNumberFrom()),
        convertToHouseNumberTo(inputData),
        convertToAdministrativeData(inputData));
  }

  private static HouseNumber parseHouseNumber(String houseNumber) {
    if (StringUtils.isBlank(houseNumber)) {
      return null;
    }

    return HouseNumber.parseHouseNumber(houseNumber);
  }

  private AdministrativeData convertToAdministrativeData(StreetDirectory.EntryFields inputData) {
    return new AdministrativeData(
        inputData.localDistrict(),
        inputData.districtName(),
        inputData.cityDistrict(),
        inputData.cityDistrictPrefecture(),
        inputData.arbitratorsDistrict(),
        inputData.socialTownHallName(),
        inputData.policeStation(),
        inputData.postalCode());
  }

  private static HouseNumber convertToHouseNumberTo(
      StreetDirectory.EntryFields onlyStreetSequence) {
    if (StringUtils.isBlank(onlyStreetSequence.houseNumberTo())) {
      return parseHouseNumber(onlyStreetSequence.houseNumberFrom());
    }

    return parseHouseNumber(onlyStreetSequence.houseNumberTo());
  }

  private OddEven getOddEven(String germanString) {
    return switch (germanString) {
      case null -> null;
      case "" -> null;
      case "gerade" -> OddEven.EVEN;
      case "ungerade" -> OddEven.ODD;
      default ->
          throw new IllegalArgumentException(
              "Could not determine odd/even value from %s".formatted(germanString));
    };
  }

  @Override
  public Set<AdministrativeData> getAdministrativeDataBy(
      String streetName, HouseNumber houseNumber, String postalCode) {
    StreetDirectoryEntry entry = directory.get(normalizeStreetNameForAutocomplete(streetName));
    if (entry == null) {
      return Set.of();
    }
    return entry.sequences().stream()
        .filter(sequence -> matches(sequence, houseNumber, postalCode))
        .map(StreetSequence::administrativeData)
        .collect(Collectors.toSet());
  }

  @Override
  public Set<String> getFullStreetNamesForPrefix(String streetName) {
    return directory.prefixMap(normalizeStreetNameForAutocomplete(streetName)).values().stream()
        .map(StreetDirectoryEntry::streetName)
        .collect(StreamUtil.toLinkedHashSet());
  }

  private static boolean matches(
      StreetSequence sequence, HouseNumber houseNumber, String postalCode) {
    if (postalCode == null) {
      return true;
    }
    return oddEvenSequenceMatches(sequence, houseNumber)
        && houseNumberIsInRange(sequence, houseNumber)
        && StringUtils.equals(sequence.administrativeData.postalCode(), postalCode);
  }

  private static boolean houseNumberIsInRange(StreetSequence sequence, HouseNumber houseNumber) {
    if (sequence.from() == null && sequence.to() == null) {
      return true;
    }

    if (houseNumber == null) {
      return true;
    }

    return isInRange(houseNumber, sequence.from(), sequence.to());
  }

  private static boolean isInRange(HouseNumber houseNumber, HouseNumber from, HouseNumber to) {
    return houseNumber.compareTo(from) >= 0 && houseNumber.compareTo(to) <= 0;
  }

  private static boolean oddEvenSequenceMatches(StreetSequence sequence, HouseNumber houseNumber) {
    if (oddEvenSequenceIsNull(sequence)) {
      return true;
    }

    if (houseNumber == null) {
      return true;
    }

    return isOddOrEven(houseNumber.number()) == sequence.oddEven();
  }

  private static boolean oddEvenSequenceIsNull(StreetSequence sequence) {
    return sequence.oddEven() == null;
  }

  static OddEven isOddOrEven(int number) {
    if (number % 2 == 0) {
      return OddEven.EVEN;
    }
    return OddEven.ODD;
  }
}
