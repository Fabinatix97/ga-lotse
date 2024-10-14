/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.textblock.persistence.TextBlockRepository;
import de.eshg.lib.editor.TextBlockController;
import de.eshg.lib.editor.api.model.TextBlockDto;
import de.eshg.lib.editor.api.model.TextBlockRequest;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import java.time.Clock;
import net.datafaker.Faker;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnTestHelperEnabled
public class TextBlockPopulator extends BasePopulator<TextBlockDto> {

  private final TextBlockController textBlockController;
  private final TextBlockRepository textBlockRepository;

  protected TextBlockPopulator(
      Clock clock,
      Environment environment,
      TextBlockController textBlockController,
      TextBlockRepository textBlockRepository,
      EnvironmentConfig environmentConfig) {
    super(clock, environment, "text_block", environmentConfig);
    this.textBlockController = textBlockController;
    this.textBlockRepository = textBlockRepository;
  }

  @Override
  protected TextBlockDto populate(
      int index, Faker faker, BasePopulator<TextBlockDto>.UniqueValueProvider uniqueValueProvider) {
    return textBlockController.createTextBlock(
        new TextBlockRequest(
            uniqueValueProvider.getUniqueFakerValue(faker.observation()::symptom, "name"),
            index % 3 == 0
                ? String.join("\n", faker.lorem().paragraphs(3))
                : faker.lorem().sentence(20)));
  }

  @Override
  protected long countExistingEntities() {
    return textBlockRepository.count();
  }
}
