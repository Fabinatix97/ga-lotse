/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.icd10.parser;

import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.domain.repository.Icd10CodeRepository;
import de.eshg.schoolentry.domain.repository.Icd10GroupRepository;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;

@Service
public class Icd10CodesParser {
  private final Icd10CodeRepository icd10CodeRepository;
  private final Icd10GroupRepository icd10GroupRepository;
  private final CSVFormat csvFormat;

  public Icd10CodesParser(
      Icd10CodeRepository icd10CodeRepository, Icd10GroupRepository icd10GroupRepository) {
    this.icd10CodeRepository = icd10CodeRepository;
    this.icd10GroupRepository = icd10GroupRepository;
    this.csvFormat =
        CSVFormat.DEFAULT
            .builder()
            .setDelimiter(';')
            .setRecordSeparator('\n')
            .setIgnoreEmptyLines(true)
            .setAllowMissingColumnNames(true)
            .build();
  }

  public void parseIcd10DataAndPersistData(String fileName, Icd10Type icd10Type)
      throws IOException {
    try (CSVParser csvParser =
        CSVParser.parse(
            Objects.requireNonNull(this.getClass().getResourceAsStream("/" + fileName)),
            StandardCharsets.UTF_8,
            csvFormat)) {
      List<CSVRecord> records = csvParser.getRecords();

      if (icd10Type.equals(Icd10Type.GROUP)) {
        icd10GroupRepository.saveAll(records.stream().map(this::parseIcd10Group).toList());
      } else {
        icd10CodeRepository.saveAll(records.stream().map(this::parseIcd10Code).toList());
      }
    }
  }

  private Icd10Code parseIcd10Code(CSVRecord csvRecord) {
    Icd10Code icd10Code = new Icd10Code();
    icd10Code.setCode(csvRecord.get(5));
    icd10Code.setCodeWithoutDot(csvRecord.get(7));
    icd10Code.setTitle(csvRecord.get(8));
    Icd10Group icd10Group =
        icd10GroupRepository
            .findById(csvRecord.get(4))
            .orElseThrow(() -> new IllegalArgumentException("Found no group for " + csvRecord));
    icd10Code.setGroup(icd10Group);
    return icd10Code;
  }

  private Icd10Group parseIcd10Group(CSVRecord csvRecord) {
    Icd10Group icd10Group = new Icd10Group();
    icd10Group.setGroupStart(csvRecord.get(0));
    icd10Group.setGroupEnd(csvRecord.get(1));
    icd10Group.setTitle(csvRecord.get(3));
    return icd10Group;
  }
}
