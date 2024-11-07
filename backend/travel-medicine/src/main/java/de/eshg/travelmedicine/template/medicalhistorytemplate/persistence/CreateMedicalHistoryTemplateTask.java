/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.medicalhistorytemplate.persistence;

import static java.nio.charset.StandardCharsets.UTF_8;

import de.eshg.persistence.TransactionHelper;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity.MedicalHistoryTemplate;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity.MedicalHistoryTemplateRepository;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity.MedicalHistoryTemplateState;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

@Component
public class CreateMedicalHistoryTemplateTask {
  private final MedicalHistoryTemplateRepository medicalHistoryTemplateRepository;
  private final TransactionHelper transactionHelper;

  public CreateMedicalHistoryTemplateTask(
      MedicalHistoryTemplateRepository medicalHistoryTemplateRepository,
      TransactionHelper transactionHelper) {
    this.medicalHistoryTemplateRepository = medicalHistoryTemplateRepository;
    this.transactionHelper = transactionHelper;
  }

  @PostConstruct
  public void createMedicalHistoryTemplate() {
    if (!medicalHistoryTemplateRepository.findAll().isEmpty()) {
      return; // A template already exists
    }

    transactionHelper.executeInNewTransaction(
        () -> {
          String content = getInitialMedicalHistoryAsString();

          MedicalHistoryTemplate mainTemplate =
              new MedicalHistoryTemplate(
                  "Initiale Haupt-Anamnese", MedicalHistoryTemplateState.FINAL, content, null);
          mainTemplate.setMainFlag(true);
          mainTemplate.setFollowUpFlag(false);
          medicalHistoryTemplateRepository.save(mainTemplate);

          MedicalHistoryTemplate followUpTemplate =
              new MedicalHistoryTemplate(
                  "Initiale Folge-Anamnese", MedicalHistoryTemplateState.FINAL, content, null);
          followUpTemplate.setMainFlag(false);
          followUpTemplate.setFollowUpFlag(true);
          medicalHistoryTemplateRepository.save(followUpTemplate);
        });
  }

  public static String getInitialMedicalHistoryAsString() throws IOException {
    InputStream resourceAsStream =
        CreateMedicalHistoryTemplateTask.class.getResourceAsStream("/initial_medical_history.json");
    assert resourceAsStream != null;
    try (Reader reader = new InputStreamReader(resourceAsStream, UTF_8)) {
      return FileCopyUtils.copyToString(reader);
    }
  }
}
