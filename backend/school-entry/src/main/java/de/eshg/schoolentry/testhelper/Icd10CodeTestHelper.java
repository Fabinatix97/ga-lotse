/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.testhelper;

import de.eshg.schoolentry.domain.repository.Icd10CodeRepository;
import de.eshg.schoolentry.domain.repository.Icd10GroupRepository;
import de.eshg.schoolentry.icd10.initialize.Icd10DataPopulation;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@ConditionalOnTestHelperEnabled
@Component
public class Icd10CodeTestHelper {

  private final Icd10DataPopulation icd10DataPopulation;
  private final Icd10CodeRepository icd10CodeRepository;
  private final Icd10GroupRepository icd10GroupRepository;

  public Icd10CodeTestHelper(
      Icd10DataPopulation icd10DataPopulation,
      Icd10CodeRepository icd10CodeRepository,
      Icd10GroupRepository icd10GroupRepository) {
    this.icd10DataPopulation = icd10DataPopulation;
    this.icd10CodeRepository = icd10CodeRepository;
    this.icd10GroupRepository = icd10GroupRepository;
  }

  @Transactional
  public void repopulateIcd10CodesIfNecessary() {
    if (shouldDeleteIcd10Codes()) {
      deleteAllIcd10Codes();
    }
    icd10DataPopulation.populateIcd10DataIfNecessary();
  }

  @Transactional
  public void deleteAllIcd10Codes() {
    icd10CodeRepository.deleteAllInBatch();
    icd10GroupRepository.deleteAllInBatch();
  }

  private boolean shouldDeleteIcd10Codes() {
    long numberOfIcd10Codes = icd10CodeRepository.count();
    // If we have something between 1 and 1000 ICD-10 codes in our database, this is a left-over
    // from a previous test run, and we need to delete and repopulate the ICD-10 codes for the next
    // test.
    return numberOfIcd10Codes > 0 && numberOfIcd10Codes < 1000;
  }
}
