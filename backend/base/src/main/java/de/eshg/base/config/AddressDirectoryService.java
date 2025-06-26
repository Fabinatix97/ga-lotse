/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import com.google.common.collect.Sets;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.CSVWriter;
import com.opencsv.ICSVWriter;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import com.opencsv.exceptions.CsvValidationException;
import de.eshg.base.street.MunicipalityDirectory;
import de.eshg.base.street.StreetDirectoryService;
import de.eshg.base.street.csv.MunicipalityDirectoryCsvEntry;
import de.eshg.base.street.csv.StreetDirectoryCsvEntry;
import de.eshg.base.street.csv.opencsv.CsvBindByNameMappingStrategy;
import de.eshg.base.street.csv.opencsv.CsvWritePositionOrderComparator;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.UncheckedIOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.UncheckedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AddressDirectoryService {

  private static final Logger log = LoggerFactory.getLogger(AddressDirectoryService.class);
  private final StreetDirectoryService streetDirectoryService;
  private final MunicipalityDirectory municipalityDirectory;

  public AddressDirectoryService(
      StreetDirectoryService streetDirectoryService, MunicipalityDirectory municipalityDirectory) {
    this.streetDirectoryService = streetDirectoryService;
    this.municipalityDirectory = municipalityDirectory;
  }

  public byte[] validateStreetRegistry(byte[] content) {
    validateHeaders(mapToStringIfNotEmpty(content), Sets.newHashSet(getStreetRegistryHeaders()));
    try {
      streetDirectoryService.parse(content);
    } catch (RuntimeException e) {
      log.error("Error parsing street registry csv", e);
      throw new BadRequestException("Error parsing street registry csv");
    }
    return content;
  }

  public byte[] validateMunicipalityRegistry(byte[] content) {
    validateHeaders(
        mapToStringIfNotEmpty(content), Sets.newHashSet(getMunicipalityRegistryHeaders()));
    try {
      municipalityDirectory.parse(content);
    } catch (RuntimeException e) {
      log.error("Error parsing municipality registry csv", e);
      throw new BadRequestException("Error parsing municipality registry csv");
    }
    return content;
  }

  public void refresh() {
    streetDirectoryService.init();
    municipalityDirectory.init();
  }

  public static String getStreetRegistryTemplate() {
    return writeAsCsv(getStreetRegistryHeaders());
  }

  public static String getMunicipalityRegistryTemplate() {
    return writeAsCsv(getMunicipalityRegistryHeaders());
  }

  private static String[] getStreetRegistryHeaders() {
    return getHeaders(new StreetDirectoryCsvEntry(), StreetDirectoryCsvEntry.class);
  }

  private static String[] getMunicipalityRegistryHeaders() {
    return getHeaders(new MunicipalityDirectoryCsvEntry(), MunicipalityDirectoryCsvEntry.class);
  }

  private static String mapToStringIfNotEmpty(byte[] csvContent) {
    if (csvContent != null && csvContent.length > 0) {
      String str = new String(csvContent);
      if (!StringUtils.isBlank(str)) {
        return str;
      }
    }
    throw new BadRequestException("CSV is empty");
  }

  private static void validateHeaders(String content, Set<String> expectedHeaders) {
    Set<String> actualHeaders = getHeaders(content);
    List<String> errors =
        Stream.concat(
                Sets.difference(actualHeaders, expectedHeaders).stream()
                    .map(unexpected -> "unexpected header: " + unexpected),
                Sets.difference(expectedHeaders, actualHeaders).stream()
                    .map(missingHeader -> "missing header: " + missingHeader))
            .toList();
    if (!errors.isEmpty()) {
      throw new BadRequestException(
          ErrorCode.CSV_INVALID_HEADER, "Invalid header line: (" + String.join(",", errors) + ")");
    }
  }

  private static Set<String> getHeaders(String content) {
    try (CSVReader reader =
        new CSVReaderBuilder(new StringReader(content))
            .withCSVParser(new CSVParserBuilder().withSeparator(';').withQuoteChar('"').build())
            .build()) {
      return Sets.newHashSet(Optional.ofNullable(reader.readNext()).orElse(new String[0]));
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    } catch (CsvValidationException e) {
      throw new UncheckedException(e);
    }
  }

  private static String writeAsCsv(String[] line) {
    StringWriter sw = new StringWriter();
    CSVWriter csvWriter =
        new CSVWriter(
            sw,
            ';',
            ICSVWriter.DEFAULT_QUOTE_CHARACTER,
            ICSVWriter.DEFAULT_ESCAPE_CHARACTER,
            ICSVWriter.DEFAULT_LINE_END);
    csvWriter.writeNext(line, false);
    return sw.toString();
  }

  private static <T> String[] getHeaders(T bean, Class<T> clazz) {
    CsvBindByNameMappingStrategy<T> strategy = new CsvBindByNameMappingStrategy<>();
    strategy.setType(clazz);
    strategy.setColumnOrderOnWrite(new CsvWritePositionOrderComparator(clazz));
    try {
      return strategy.generateHeader(bean);
    } catch (CsvRequiredFieldEmptyException e) {
      throw new UncheckedException(e);
    }
  }
}
