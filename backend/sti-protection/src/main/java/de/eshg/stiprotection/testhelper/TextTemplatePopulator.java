/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.stiprotection.TextTemplateController;
import de.eshg.stiprotection.api.texttemplate.CreateTextTemplateRequest;
import de.eshg.stiprotection.api.texttemplate.CreateTextTemplateResponse;
import de.eshg.stiprotection.api.texttemplate.TextTemplateContextDto;
import de.eshg.stiprotection.api.texttemplate.TextTemplateDto;
import de.eshg.stiprotection.mapper.texttemplate.TextTemplateMapper;
import de.eshg.stiprotection.persistence.db.texttemplate.TextTemplate;
import de.eshg.stiprotection.persistence.db.texttemplate.TextTemplateRepository;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import java.time.Clock;
import java.util.Optional;
import net.datafaker.Faker;

@PopulatorComponent
public class TextTemplatePopulator extends BasePopulator<TextTemplateDto> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final TextTemplateController textTemplateController;
  private final TextTemplateRepository textTemplateRepository;

  public TextTemplatePopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      TextTemplateRepository textTemplateRepository,
      TextTemplateController textTemplateController) {
    super(properties, clock, getClassNameAsPropertyKey(TextTemplateDto.class), environmentConfig);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.textTemplateController = textTemplateController;
    this.textTemplateRepository = textTemplateRepository;
  }

  @Override
  public ListWithTotalNumber<TextTemplateDto> populate(int numberOfEntitiesToPopulate) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> populateWithAuthentication(numberOfEntitiesToPopulate));
  }

  @Override
  protected TextTemplateDto populate(
      int index,
      Faker faker,
      BasePopulator<TextTemplateDto>.UniqueValueProvider uniqueValueProvider) {

    CreateTextTemplateResponse resp =
        textTemplateController.createTextTemplate(textTemplate(faker));
    Optional<TextTemplate> texTemplateDto =
        this.textTemplateRepository.findByExternalId(resp.textTemplateId());

    return TextTemplateMapper.toInterfaceType(texTemplateDto.get());
  }

  @Override
  protected long countExistingEntities() {
    return textTemplateRepository.count();
  }

  private static CreateTextTemplateRequest textTemplate(Faker faker) {
    return new CreateTextTemplateRequest(
        faker.theItCrowd().actors() + " - Vorlage " + faker.random().nextInt(1, 10),
        BasePopulator.randomElement(faker, TextTemplateContextDto.values()),
        BasePopulator.randomElement(faker, textTemplateContents()));
  }

  private static String[] textTemplateContents() {
    return new String[] {
      "Patient ist verunsichert und uneinsichtig.",
      "Syphilis-Wert: $Wert",
      "Der Grund für den Besuch des Patienten ist $Grund.",
      "Der Patient ist allergisch gegen $Allergie und kann deshalb nicht mit $Arznei behandelt werden.",
      "Was ist ihre Aufgabe im Betrieb/Welche Position haben Sie inne? Antwort: $Aufgabe",
      "Scherzfrage: Wie hoch ist die durchschnittliche Fluggeschwindigkeit einer unbeladenen Schwalbe? Antwort: $Antwort",
      "HIV-Testergebnis: $Ergebnis.",
      "Anmerkung für MFA: $Notiz.",
      "Anmerkung für Arzt:Ärztin: $Notiz.",
      "Gruppe: $Wert\nFlora: $Wert\nEndocervix: $Wert\nProliferationsgrad: $Wert\n\nBemerkung: $Text.\n\nHPV\nhigh risk HPV-DNA: $Befund\nlow risk HPV-DNA: $Befund\n\nC-Nr.: $LabornummerFürBürger"
    };
  }
}
