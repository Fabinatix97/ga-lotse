/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.config.DepartmentConfigurationService;
import de.eshg.base.street.csv.CsvMapper;
import de.eshg.base.street.csv.StreetDirectoryCsvEntry;
import de.eshg.persistence.TransactionHelper;
import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.function.Predicate;
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

  private final TransactionHelper transactionHelper;
  private final DepartmentConfigurationService departmentConfigurationService;
  private PatriciaTrie<Map<String, StreetDirectoryEntry>> directory;
  private Map<String, Map<String, StreetDirectoryEntry>> streetNumberMap;

  @Autowired
  public StreetDirectoryService(
      DepartmentConfigurationService departmentConfigurationService,
      TransactionHelper transactionHelper) {
    this.transactionHelper = transactionHelper;
    this.departmentConfigurationService = departmentConfigurationService;
  }

  @PostConstruct
  public void init() {
    List<StreetDirectoryCsvEntry> csvEntries =
        CsvMapper.csvToBeans(
            transactionHelper.executeInTransaction(
                departmentConfigurationService::getStreetDirectory),
            StreetDirectoryCsvEntry.class);
    this.directory = convertToDirectoryMap(new ArrayList<>(csvEntries));
    this.streetNumberMap = convertToStreetNumberMap(new ArrayList<>(csvEntries));
  }

  public PatriciaTrie<Map<String, StreetDirectoryEntry>> parse(byte[] content) {
    return convertToDirectoryMap(
        new ArrayList<>(CsvMapper.csvToBeans(content, StreetDirectoryCsvEntry.class)));
  }

  @Override
  public Set<AdministrativeData> getAdministrativeDataByStreetName(String streetName) {
    return directory.prefixMap(normalizeStreetNameForAutocomplete(streetName)).values().stream()
        .map(Map::values)
        .flatMap(Collection::stream)
        .flatMap(entry -> entry.sequences.stream())
        .map(StreetSequence::administrativeData)
        .collect(StreamUtil.toLinkedHashSet());
  }

  @Override
  public Set<AdministrativeData> getAdministrativeDataByStreetNameAndHouseNumber(
      String streetName, String houseNumberString) {
    HouseNumber houseNumber = HouseNumber.parseHouseNumber(houseNumberString);
    Predicate<StreetSequence> streetNumberFilter =
        sequence ->
            oddEvenSequenceMatches(sequence, houseNumber)
                && houseNumberIsInRange(sequence, houseNumber);

    return directory.prefixMap(normalizeStreetNameForAutocomplete(streetName)).values().stream()
        .map(Map::values)
        .flatMap(Collection::stream)
        .flatMap(entry -> entry.sequences.stream())
        .filter(streetNumberFilter)
        .map(StreetSequence::administrativeData)
        .collect(StreamUtil.toLinkedHashSet());
  }

  @Override
  public Set<AdministrativeData> getAdministrativeDataByStreetNumber(String streetNumber) {
    return streetNumberMap.get(streetNumber).values().stream()
        .flatMap(entry -> entry.sequences.stream())
        .map(StreetSequence::administrativeData)
        .collect(StreamUtil.toLinkedHashSet());
  }

  private String normalizeStreetNameForAutocomplete(String streetName) {
    return streetName.toLowerCase(Locale.GERMAN);
  }

  private PatriciaTrie<Map<String, StreetDirectoryEntry>> convertToDirectoryMap(
      List<StreetDirectory.EntryFields> csvEntries) {
    Map<String, List<StreetDirectory.EntryFields>> streetMap =
        csvEntries.stream().collect(Collectors.groupingBy(StreetDirectory.EntryFields::streetName));

    Set<String> streetNames = streetMap.keySet();

    PatriciaTrie<Map<String, StreetDirectoryEntry>> result = new PatriciaTrie<>();

    assembleMap(streetMap, streetNames, result);

    return result;
  }

  private Map<String, Map<String, StreetDirectoryEntry>> convertToStreetNumberMap(
      List<StreetDirectory.EntryFields> csvEntries) {
    Map<String, List<StreetDirectory.EntryFields>> streetMap =
        csvEntries.stream()
            .collect(Collectors.groupingBy(StreetDirectory.EntryFields::streetNumber));

    Set<String> streetNumbers = streetMap.keySet();

    Map<String, Map<String, StreetDirectoryEntry>> result = new HashMap<>();

    assembleMap(streetMap, streetNumbers, result);

    return result;
  }

  private void assembleMap(
      Map<String, List<StreetDirectory.EntryFields>> streetMap,
      Set<String> keys,
      Map<String, Map<String, StreetDirectoryEntry>> result) {
    for (String key : keys) {
      List<StreetDirectory.EntryFields> streetSequences = streetMap.get(key);
      Map<String, StreetDirectoryEntry> newEntry = convertMultipleEntries(key, streetSequences);
      String normalizedStreetName = normalizeStreetNameForAutocomplete(key);

      Map<String, StreetDirectoryEntry> entry =
          result.computeIfAbsent(normalizedStreetName, k -> new LinkedHashMap<>());
      if (canBeMerged(entry, newEntry)) {
        entry.putAll(newEntry);
      } else {
        throw new IllegalStateException("Duplicate street entry found for '" + key + "'");
      }
    }
  }

  private boolean canBeMerged(
      Map<String, StreetDirectoryEntry> oldEntry, Map<String, StreetDirectoryEntry> newEntry) {
    return oldEntry.keySet().stream().noneMatch(newEntry.keySet()::contains);
  }

  private Map<String, StreetDirectoryEntry> convertMultipleEntries(
      String streetName, List<StreetDirectory.EntryFields> inputData) {
    Map<String, List<StreetSequence>> postalCodeToSequences =
        inputData.stream()
            .map(this::convertToStreetSequence)
            .collect(Collectors.groupingBy(StreetDirectoryService::getNonNullPostalCode));
    return postalCodeToSequences.entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .collect(
            StreamUtil.toLinkedHashMap(
                Map.Entry::getKey,
                entry -> new StreetDirectoryEntry(streetName, entry.getValue())));
  }

  private static String getNonNullPostalCode(StreetSequence sequence) {
    return StringUtils.isEmpty(sequence.administrativeData().postalCode())
        ? ""
        : sequence.administrativeData().postalCode();
  }

  private StreetSequence convertToStreetSequence(StreetDirectory.EntryFields inputData) {
    return new StreetSequence(
        getOddEven(inputData.evenOddSequence()),
        parseHouseNumber(inputData.houseNumberFrom(), inputData.houseNumberFromAddition()),
        convertToHouseNumberTo(inputData),
        convertToAdministrativeData(inputData));
  }

  private static HouseNumber parseHouseNumber(String houseNumber, String addition) {
    if (StringUtils.isBlank(houseNumber)) {
      return null;
    }

    if (StringUtils.isBlank(addition) || !houseNumber.matches("\\d+")) {
      return HouseNumber.parseHouseNumber(houseNumber);
    } else {
      return new HouseNumber(Integer.parseInt(houseNumber), StringUtils.normalizeSpace(addition));
    }
  }

  private AdministrativeData convertToAdministrativeData(StreetDirectory.EntryFields inputData) {
    return new AdministrativeData(
        StringUtils.normalizeSpace(inputData.streetNumber()),
        StringUtils.normalizeSpace(inputData.streetName()),
        StringUtils.normalizeSpace(inputData.localDistrict()),
        StringUtils.normalizeSpace(inputData.districtName()),
        StringUtils.normalizeSpace(inputData.cityDistrict()),
        inputData.postalCode());
  }

  private static HouseNumber convertToHouseNumberTo(
      StreetDirectory.EntryFields onlyStreetSequence) {
    if (StringUtils.isBlank(onlyStreetSequence.houseNumberTo())) {
      return parseHouseNumber(
          onlyStreetSequence.houseNumberFrom(), onlyStreetSequence.houseNumberFromAddition());
    }

    return parseHouseNumber(
        onlyStreetSequence.houseNumberTo(), onlyStreetSequence.houseNumberToAddition());
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
    Map<String, StreetDirectoryEntry> entryMap =
        directory.get(normalizeStreetNameForAutocomplete(streetName));
    if (entryMap == null) {
      return Set.of();
    }
    return entryMap.values().stream()
        .map(StreetDirectoryEntry::sequences)
        .flatMap(Collection::stream)
        .filter(sequence -> matches(sequence, houseNumber, postalCode))
        .map(StreetSequence::administrativeData)
        .collect(StreamUtil.toLinkedHashSet());
  }

  @Override
  public Set<String> getFullStreetNamesForPrefix(String streetName) {
    return directory.prefixMap(normalizeStreetNameForAutocomplete(streetName)).values().stream()
        .map(Map::values)
        .flatMap(Collection::stream)
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
