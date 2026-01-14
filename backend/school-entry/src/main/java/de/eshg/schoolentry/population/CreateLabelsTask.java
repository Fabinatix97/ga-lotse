/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.population;

import de.eshg.persistence.TransactionHelper;
import de.eshg.schoolentry.domain.model.ProcedureLabel;
import de.eshg.schoolentry.domain.repository.ProcedureLabelRepository;
import jakarta.annotation.PostConstruct;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CreateLabelsTask {

  public static final String SPECIAL_NEEDS_LABEL_NAME = "Besonderer Förderbedarf";
  public static final String INFORMATION_BLOCK_LABEL_NAME = "Auskunftssperre";

  private static final List<LabelData> SYSTEM_LABELS =
      List.of(
          new LabelData(
              SPECIAL_NEEDS_LABEL_NAME,
              "Vorgänge mit dieser Kennung erhalten Termine aus den geplanten Terminblöcken der Art \"Besonderer Förderbedarf\"",
              "#008000"),
          new LabelData(
              INFORMATION_BLOCK_LABEL_NAME,
              "Für den Vorgang liegt eine Auskunftssperre vor.",
              "#800080"));

  private final ProcedureLabelRepository procedureLabelRepository;
  private final TransactionHelper transactionHelper;

  public CreateLabelsTask(
      ProcedureLabelRepository procedureLabelRepository, TransactionHelper transactionHelper) {
    this.procedureLabelRepository = procedureLabelRepository;
    this.transactionHelper = transactionHelper;
  }

  @PostConstruct
  public void createLabels() {
    transactionHelper.executeInTransaction(
        () ->
            SYSTEM_LABELS.forEach(
                labelData -> {
                  if (!procedureLabelRepository.existsByName(labelData.name())) {
                    ProcedureLabel label = new ProcedureLabel();
                    label.setName(labelData.name());
                    label.setDescription(labelData.description());
                    label.setHexColor(labelData.hexColor());
                    label.setReadonly(true);
                    procedureLabelRepository.save(label);
                  }
                }));
  }

  record LabelData(String name, String description, String hexColor) {}
}
