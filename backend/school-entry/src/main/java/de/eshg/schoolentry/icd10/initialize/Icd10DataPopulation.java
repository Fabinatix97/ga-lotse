/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.icd10.initialize;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.persistence.TransactionHelper;
import de.eshg.schoolentry.domain.model.Icd10Code;
import de.eshg.schoolentry.domain.model.Icd10Group;
import de.eshg.schoolentry.domain.repository.Icd10CodeRepository;
import de.eshg.schoolentry.domain.repository.Icd10GroupRepository;
import de.eshg.schoolentry.icd10.parser.Icd10Data;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class Icd10DataPopulation {

  private static final Logger log = LoggerFactory.getLogger(Icd10DataPopulation.class);

  private final Icd10CodeRepository icd10CodeRepository;
  private final Icd10GroupRepository icd10GroupRepository;
  private final TransactionHelper transactionHelper;
  private final ObjectMapper objectMapper;
  private final Resource icd10DataResource;

  public Icd10DataPopulation(
      Icd10CodeRepository icd10CodeRepository,
      Icd10GroupRepository icd10GroupRepository,
      TransactionHelper transactionHelper,
      ObjectMapper objectMapper,
      @Value("classpath:/icd10Data.json") Resource icd10DataResource) {
    this.icd10CodeRepository = icd10CodeRepository;
    this.icd10GroupRepository = icd10GroupRepository;
    this.transactionHelper = transactionHelper;
    this.objectMapper = objectMapper;
    this.icd10DataResource = icd10DataResource;
  }

  @PostConstruct
  public void populateIcd10DataIfNecessary() {
    transactionHelper.executeInTransaction(
        () -> {
          if (icd10CodeRepository.count() == 0) {
            log.info("ICD-10 codes will be regenerated from {}", icd10DataResource);
            Icd10Data icd10Data = parseData();

            for (Icd10Data.Icd10Group group : icd10Data.groups()) {
              Icd10Group persistentGroup = new Icd10Group();
              persistentGroup.setGroupStart(group.start());
              persistentGroup.setGroupEnd(group.end());
              persistentGroup.setTitle(group.title());
              icd10GroupRepository.save(persistentGroup);
            }

            for (Icd10Data.Icd10Code code : icd10Data.codes()) {
              Icd10Code persistentCode = new Icd10Code();
              persistentCode.setCode(code.code());
              persistentCode.setCodeWithoutDot(code.codeWithoutDot());
              persistentCode.setTitle(code.title());
              persistentCode.setGroup(
                  icd10GroupRepository
                      .findById(code.group())
                      .orElseThrow(
                          () -> new IllegalArgumentException("Found no group for " + code)));
              icd10CodeRepository.save(persistentCode);
            }
            log.info("Inserted {} ICD-10 codes", icd10Data.codes().size());
          }
        });
  }

  private Icd10Data parseData() throws IOException {
    try (InputStream inputStream = icd10DataResource.getInputStream()) {
      return objectMapper.readerFor(Icd10Data.class).readValue(inputStream);
    }
  }
}
