/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.population;

import de.eshg.persistence.TransactionHelper;
import de.eshg.schoolentry.domain.model.Label;
import de.eshg.schoolentry.domain.repository.LabelRepository;
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

  private final LabelRepository labelRepository;
  private final TransactionHelper transactionHelper;

  public CreateLabelsTask(LabelRepository labelRepository, TransactionHelper transactionHelper) {
    this.labelRepository = labelRepository;
    this.transactionHelper = transactionHelper;
  }

  @PostConstruct
  public void createLabels() {
    transactionHelper.executeInTransaction(
        () ->
            SYSTEM_LABELS.forEach(
                labelData -> {
                  if (!labelRepository.existsByName(labelData.name())) {
                    Label label = new Label();
                    label.setName(labelData.name());
                    label.setDescription(labelData.description());
                    label.setHexColor(labelData.hexColor());
                    label.setReadonly(true);
                    labelRepository.save(label);
                  }
                }));
  }

  record LabelData(String name, String description, String hexColor) {}
}
