/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper;

import static de.eshg.travelmedicine.template.informationstatementtemplate.api.InformationStatementTemplateStateDto.DRAFT;
import static de.eshg.travelmedicine.template.informationstatementtemplate.api.InformationStatementTemplateStateDto.FINAL;

import de.eshg.base.inventory.InventoryApi;
import de.eshg.base.inventory.api.AddInventoryItemRequest;
import de.eshg.base.inventory.api.InventoryItemDto;
import de.eshg.base.inventory.api.InventoryItemTypeDto;
import de.eshg.base.user.UserApi;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockDto;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockGroupRequest;
import de.eshg.lib.appointmentblock.api.DayOfWeekDto;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.travelmedicine.disease.DiseaseService;
import de.eshg.travelmedicine.disease.api.DiseaseDto;
import de.eshg.travelmedicine.disease.api.PostPutDiseaseRequest;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import de.eshg.travelmedicine.otherservicetemplate.OtherServiceTemplateService;
import de.eshg.travelmedicine.otherservicetemplate.api.OtherServiceTemplateDto;
import de.eshg.travelmedicine.otherservicetemplate.api.PostPutOtherServiceTemplateRequest;
import de.eshg.travelmedicine.template.api.TemplateAnamnesisQuestionDto;
import de.eshg.travelmedicine.template.api.TemplateConfirmationDto;
import de.eshg.travelmedicine.template.api.TemplateContentDto;
import de.eshg.travelmedicine.template.api.TemplateSectionDto;
import de.eshg.travelmedicine.template.api.TemplateSectionElementDto;
import de.eshg.travelmedicine.template.api.TemplateSubElementMultiSelectDto;
import de.eshg.travelmedicine.template.api.TemplateSubElementTextDto;
import de.eshg.travelmedicine.template.api.TemplateTextBlockDto;
import de.eshg.travelmedicine.template.informationstatementtemplate.InformationStatementTemplateService;
import de.eshg.travelmedicine.template.informationstatementtemplate.api.InformationStatementTemplateDto;
import de.eshg.travelmedicine.template.informationstatementtemplate.api.InformationStatementTemplateRequest;
import de.eshg.travelmedicine.testhelper.api.PostPopulateAdministrativeResponse;
import de.eshg.travelmedicine.vaccine.VaccineService;
import de.eshg.travelmedicine.vaccine.api.PostPutVaccineRequest;
import de.eshg.travelmedicine.vaccine.api.VaccineDto;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@ConditionalOnTestHelperEnabled
@Service
public class TestPopulateAdministrativeService {

  public static final String CHOLERA_DISEASE_KEY = "cholera";
  public static final String MALARIA_DISEASE_KEY = "malaria";
  public static final String MEASLES_DISEASE_KEY = "measles";
  public static final String RABIES_DISEASE_KEY = "rabies";

  public static final String MALARIA_A_INVENTORY_VACCINE_KEY = "malaria_a";
  public static final String MALARIA_B_INVENTORY_VACCINE_KEY = "malaria_b";
  public static final String MEASLES_INVENTORY_VACCINE_KEY = "measles";
  public static final String CHOLERA_A_INVENTORY_VACCINE_KEY = "cholera_a";
  public static final String CHOLERA_B_INVENTORY_VACCINE_KEY = "cholera_b";
  public static final String RABIES_INVENTORY_VACCINE_KEY = "rabies";

  public static final String MALARIA_A_VACCINE_KEY = "malaria_a";
  public static final String MALARIA_B_VACCINE_KEY = "malaria_b";
  public static final String MEASLES_VACCINE_KEY = "measles";
  public static final String CHOLERA_A_VACCINE_KEY = "cholera_a";
  public static final String CHOLERA_B_VACCINE_KEY = "cholera_b";

  public static final String CONSULT_NOW_KEY = "Beratung_heute_16_Uhr";
  public static final String VACCINATE_LATER_KEY = "Impfung_in_2_Wochen_11_Uhr";

  public static final String EMPTY_IST_KEY = "empty";
  public static final String STANDARD_IST_KEY = "standard";
  public static final String CHOLERA_FINAL_IST_KEY = "cholera_final";
  public static final String CHOLERA_DRAFT_IST_KEY = "cholera_draft";

  private final DiseaseService diseaseService;
  private final InventoryApi inventoryApiClient;
  private final VaccineService vaccineService;
  private final OtherServiceTemplateService otherServiceTemplateService;
  private final AppointmentBlockService appointmentBlockService;
  private final InformationStatementTemplateService informationStatementTemplateService;
  private final UserApi userApiClient;
  private final Clock clock;
  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final TravelMedicineFeatureToggle featureToggle;

  public TestPopulateAdministrativeService(
      DiseaseService diseaseService,
      InventoryApi inventoryApiClient,
      VaccineService vaccineService,
      OtherServiceTemplateService otherServiceTemplateService,
      AppointmentBlockService appointmentBlockService,
      InformationStatementTemplateService informationStatementTemplateService,
      UserApi userApiClient,
      Clock clock,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      TravelMedicineFeatureToggle featureToggle) {
    this.diseaseService = diseaseService;
    this.inventoryApiClient = inventoryApiClient;
    this.vaccineService = vaccineService;
    this.otherServiceTemplateService = otherServiceTemplateService;
    this.appointmentBlockService = appointmentBlockService;
    this.informationStatementTemplateService = informationStatementTemplateService;
    this.userApiClient = userApiClient;
    this.clock = clock;
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.featureToggle = featureToggle;
  }

  @Transactional
  public PostPopulateAdministrativeResponse populateAdministrative() {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> {
          Map<String, UUID> inventoryVaccines = createInventoryVaccines();
          Map<String, UUID> diseases = createDiseases();
          Map<String, UUID> vaccines = createVaccines(inventoryVaccines, diseases);
          Map<String, UUID> otherServiceTemplates = createOtherServiceTemplates();
          Map<String, UUID> appointmentBlockGroups = createAppointmentBlockGroups();
          Map<String, UUID> informationStatementTemplates =
              createInformationStatementTemplates(diseases);

          return new PostPopulateAdministrativeResponse(
              diseases,
              inventoryVaccines,
              vaccines,
              otherServiceTemplates,
              appointmentBlockGroups,
              informationStatementTemplates);
        });
  }

  private Map<String, UUID> createDiseases() {
    DiseaseDto cholera =
        diseaseService.createDisease(new PostPutDiseaseRequest("Cholera", null, true));
    DiseaseDto malaria =
        diseaseService.createDisease(new PostPutDiseaseRequest("Malaria", null, true));
    DiseaseDto mmr =
        diseaseService.createDisease(
            new PostPutDiseaseRequest("Masern/Mumps/Röteln", BigDecimal.valueOf(17.14), true));
    DiseaseDto rabies =
        diseaseService.createDisease(
            new PostPutDiseaseRequest("Tollwut", BigDecimal.valueOf(18.15), false));

    Map<String, UUID> diseases = new LinkedHashMap<>();
    diseases.put(CHOLERA_DISEASE_KEY, cholera.id());
    diseases.put(MALARIA_DISEASE_KEY, malaria.id());
    diseases.put(MEASLES_DISEASE_KEY, mmr.id());
    diseases.put(RABIES_DISEASE_KEY, rabies.id());
    return diseases;
  }

  private Map<String, UUID> createInventoryVaccines() {
    InventoryItemDto malaria_a =
        inventoryApiClient.addInventoryItem(
            new AddInventoryItemRequest(
                "Malaria-Prophylaxe A (Inventar)",
                InventoryItemTypeDto.VACCINE,
                null,
                null,
                null,
                50,
                5));
    InventoryItemDto malaria_b =
        inventoryApiClient.addInventoryItem(
            new AddInventoryItemRequest(
                "Malaria-Prophylaxe B (Inventar)",
                InventoryItemTypeDto.VACCINE,
                null,
                null,
                null,
                50,
                5));
    InventoryItemDto mmr =
        inventoryApiClient.addInventoryItem(
            new AddInventoryItemRequest(
                "Masern/Mumps/Röteln-Impfstoff (Inventar)",
                InventoryItemTypeDto.VACCINE,
                null,
                null,
                null,
                50,
                10));
    InventoryItemDto cholera_a =
        inventoryApiClient.addInventoryItem(
            new AddInventoryItemRequest(
                "Cholera-Impfstoff A (Inventar)",
                InventoryItemTypeDto.VACCINE,
                null,
                null,
                null,
                50,
                5));
    InventoryItemDto cholera_b =
        inventoryApiClient.addInventoryItem(
            new AddInventoryItemRequest(
                "Cholera-Impfstoff B (Inventar)",
                InventoryItemTypeDto.VACCINE,
                null,
                null,
                null,
                50,
                5));
    InventoryItemDto rabies =
        inventoryApiClient.addInventoryItem(
            new AddInventoryItemRequest(
                "Tollwut-Impfstoff (Inventar)",
                InventoryItemTypeDto.VACCINE,
                null,
                null,
                null,
                50,
                5));

    Map<String, UUID> inventoryVaccines = new LinkedHashMap<>();
    inventoryVaccines.put(MALARIA_A_INVENTORY_VACCINE_KEY, malaria_a.id());
    inventoryVaccines.put(MALARIA_B_INVENTORY_VACCINE_KEY, malaria_b.id());
    inventoryVaccines.put(MEASLES_INVENTORY_VACCINE_KEY, mmr.id());
    inventoryVaccines.put(CHOLERA_A_INVENTORY_VACCINE_KEY, cholera_a.id());
    inventoryVaccines.put(CHOLERA_B_INVENTORY_VACCINE_KEY, cholera_b.id());
    inventoryVaccines.put(RABIES_INVENTORY_VACCINE_KEY, rabies.id());
    return inventoryVaccines;
  }

  private Map<String, UUID> createVaccines(
      Map<String, UUID> inventoryVaccines, Map<String, UUID> diseases) {
    VaccineDto malaria_a =
        vaccineService.addVaccine(
            new PostPutVaccineRequest(
                "Malaria-Prophylaxe A",
                diseases.get(MALARIA_DISEASE_KEY),
                List.of(1),
                BigDecimal.valueOf(150.12),
                inventoryVaccines.get(MALARIA_A_INVENTORY_VACCINE_KEY),
                "MALARIA_A_123"));
    VaccineDto malaria_b =
        vaccineService.addVaccine(
            new PostPutVaccineRequest(
                "Malaria-Prophylaxe B",
                diseases.get(MALARIA_DISEASE_KEY),
                List.of(),
                BigDecimal.valueOf(120.15),
                inventoryVaccines.get(MALARIA_B_INVENTORY_VACCINE_KEY),
                "MALARIA_B_123"));
    VaccineDto mmr =
        vaccineService.addVaccine(
            new PostPutVaccineRequest(
                "Masern/Mumps/Röteln-Impfstoff",
                diseases.get(MEASLES_DISEASE_KEY),
                List.of(3, 4, 5),
                BigDecimal.valueOf(10.00),
                inventoryVaccines.get(MEASLES_INVENTORY_VACCINE_KEY),
                "MUMPS_123"));
    VaccineDto cholera_a =
        vaccineService.addVaccine(
            new PostPutVaccineRequest(
                "Cholera-Impfstoff A",
                diseases.get(CHOLERA_DISEASE_KEY),
                List.of(),
                BigDecimal.valueOf(20.00),
                inventoryVaccines.get(CHOLERA_A_INVENTORY_VACCINE_KEY),
                "CHOLERA_A_123"));
    VaccineDto cholera_b =
        vaccineService.addVaccine(
            new PostPutVaccineRequest(
                "Cholera-Impfstoff B",
                diseases.get(CHOLERA_DISEASE_KEY),
                List.of(2, 3),
                BigDecimal.valueOf(30.00),
                inventoryVaccines.get(CHOLERA_B_INVENTORY_VACCINE_KEY),
                "CHOLERA_B_123"));

    Map<String, UUID> vaccines = new LinkedHashMap<>();
    vaccines.put(MALARIA_A_VACCINE_KEY, malaria_a.id());
    vaccines.put(MALARIA_B_VACCINE_KEY, malaria_b.id());
    vaccines.put(MEASLES_VACCINE_KEY, mmr.id());
    vaccines.put(CHOLERA_A_VACCINE_KEY, cholera_a.id());
    vaccines.put(CHOLERA_B_VACCINE_KEY, cholera_b.id());
    return vaccines;
  }

  private Map<String, UUID> createOtherServiceTemplates() {
    OtherServiceTemplateDto consultationTemplate =
        otherServiceTemplateService.createOtherServiceTemplate(
            new PostPutOtherServiceTemplateRequest(
                "Beratung über Infektionsverläufe", BigDecimal.valueOf(36.00)));
    OtherServiceTemplateDto preexaminationTemplate =
        otherServiceTemplateService.createOtherServiceTemplate(
            new PostPutOtherServiceTemplateRequest("Voruntersuchung", BigDecimal.valueOf(37.00)));
    OtherServiceTemplateDto followupExaminationTemplate =
        otherServiceTemplateService.createOtherServiceTemplate(
            new PostPutOtherServiceTemplateRequest("Nachuntersuchung", BigDecimal.valueOf(38.00)));

    Map<String, UUID> otherServices = new LinkedHashMap<>();
    otherServices.put(consultationTemplate.description(), consultationTemplate.id());
    otherServices.put(preexaminationTemplate.description(), preexaminationTemplate.id());
    otherServices.put(followupExaminationTemplate.description(), followupExaminationTemplate.id());
    return otherServices;
  }

  private Map<String, UUID> createAppointmentBlockGroups() {
    UUID physician =
        userApiClient
            .getUsersByGroup(TechnicalGroup.TRAVEL_MEDICINE_PHYSICIAN.getKeycloakName())
            .users()
            .getFirst()
            .userId();

    UUID mfa =
        userApiClient
            .getUsersByGroup(TechnicalGroup.TRAVEL_MEDICINE_MFA.getKeycloakName())
            .users()
            .getFirst()
            .userId();

    Instant startBlock_consultNow =
        ZonedDateTime.now(clock).truncatedTo(ChronoUnit.DAYS).plusHours(16L).toInstant();
    Instant endBlock_consultNow = startBlock_consultNow.plus(Duration.ofMinutes(30L));

    UUID appointmentBlockGroup_consultNow =
        appointmentBlockService
            .createDailyAppointmentBlocksForGroup(
                new CreateDailyAppointmentBlockGroupRequest(
                    List.of(AppointmentTypeDto.CONSULTATION),
                    4,
                    List.of(
                        new CreateDailyAppointmentBlockDto(
                            startBlock_consultNow, endBlock_consultNow, DayOfWeekDto.allDays())),
                    List.of(physician),
                    List.of(mfa),
                    List.of()))
            .id();

    Instant startBlock_2 =
        ZonedDateTime.now(clock)
            .truncatedTo(ChronoUnit.DAYS)
            .plusWeeks(2)
            .plusHours(11L)
            .toInstant();
    Instant endBlock_2 = startBlock_2.plus(Duration.ofMinutes(30L));

    UUID appointmentBlockGroup_vaccinateLater =
        appointmentBlockService
            .createDailyAppointmentBlocksForGroup(
                new CreateDailyAppointmentBlockGroupRequest(
                    List.of(AppointmentTypeDto.VACCINATION),
                    2,
                    List.of(
                        new CreateDailyAppointmentBlockDto(
                            startBlock_2, endBlock_2, DayOfWeekDto.allDays())),
                    List.of(physician),
                    List.of(mfa),
                    List.of()))
            .id();

    Map<String, UUID> appointmentBlockGroups = new LinkedHashMap<>();
    appointmentBlockGroups.put(CONSULT_NOW_KEY, appointmentBlockGroup_consultNow);
    appointmentBlockGroups.put(VACCINATE_LATER_KEY, appointmentBlockGroup_vaccinateLater);
    return appointmentBlockGroups;
  }

  /*
  creates
   - an empty draft template
   - a template assigned to multiple diseases
   - cholera has additionally assigned templates, one final and one in draft
   - measles has no template assigned
   */
  private Map<String, UUID> createInformationStatementTemplates(Map<String, UUID> diseases) {
    InformationStatementTemplateDto emptyDto =
        informationStatementTemplateService.createInformationStatementTemplate(
            new InformationStatementTemplateRequest(
                "Empty Template Name",
                "Empty Template Title",
                DRAFT,
                null,
                createTemplateContent()));
    InformationStatementTemplateDto standardDto =
        informationStatementTemplateService.createInformationStatementTemplate(
            new InformationStatementTemplateRequest(
                "Standard Template Name",
                "Standard Template Title",
                FINAL,
                List.of(
                    diseases.get(CHOLERA_DISEASE_KEY),
                    diseases.get(MALARIA_DISEASE_KEY),
                    diseases.get(MEASLES_DISEASE_KEY)),
                createTemplateContent()));
    InformationStatementTemplateDto choleraFinalDto =
        informationStatementTemplateService.createInformationStatementTemplate(
            new InformationStatementTemplateRequest(
                "Cholera Final Template Name",
                "Cholera Final Template Title",
                FINAL,
                List.of(diseases.get(CHOLERA_DISEASE_KEY)),
                createTemplateContent()));
    InformationStatementTemplateDto choleraDraftDto =
        informationStatementTemplateService.createInformationStatementTemplate(
            new InformationStatementTemplateRequest(
                "Cholera Draft Template Name",
                "Cholera Draft Template Title",
                DRAFT,
                List.of(diseases.get(CHOLERA_DISEASE_KEY)),
                createTemplateContent()));

    Map<String, UUID> informationStatementTemplates = new LinkedHashMap<>();
    informationStatementTemplates.put(EMPTY_IST_KEY, emptyDto.id());
    informationStatementTemplates.put(STANDARD_IST_KEY, standardDto.id());
    informationStatementTemplates.put(CHOLERA_FINAL_IST_KEY, choleraFinalDto.id());
    informationStatementTemplates.put(CHOLERA_DRAFT_IST_KEY, choleraDraftDto.id());

    return informationStatementTemplates;
  }

  private TemplateContentDto createTemplateContent() {
    return new TemplateContentDto(
        List.of(
            new TemplateSectionDto(
                "1. Section Titel",
                List.of(
                    new TemplateSectionElementDto(
                        new TemplateAnamnesisQuestionDto(
                            "1. Section, 1. Frage, keine Subelemente", List.of(), null),
                        null,
                        null),
                    new TemplateSectionElementDto(
                        new TemplateAnamnesisQuestionDto(
                            "1. Section, 2. Frage, SubElementMultiSelect",
                            List.of(
                                new TemplateSubElementMultiSelectDto("1. Antwortoption"),
                                new TemplateSubElementMultiSelectDto("2. Antwortoption")),
                            null),
                        null,
                        null),
                    new TemplateSectionElementDto(
                        new TemplateAnamnesisQuestionDto(
                            "1. Section, 3. Frage, SubElementText",
                            List.of(),
                            new TemplateSubElementTextDto("3. Frage, offene Angabe")),
                        null,
                        null),
                    new TemplateSectionElementDto(
                        new TemplateAnamnesisQuestionDto(
                            "1. Section, 4. Frage, kombiniert",
                            List.of(
                                new TemplateSubElementMultiSelectDto("1. Antwortoption"),
                                new TemplateSubElementMultiSelectDto("2. Antwortoption")),
                            new TemplateSubElementTextDto(
                                "4. Frage, offene Angabe in Subelementen")),
                        null,
                        null),
                    new TemplateSectionElementDto(
                        null, new TemplateTextBlockDto("Textfeld\nmit Inhalt"), null),
                    new TemplateSectionElementDto(
                        null, null, new TemplateConfirmationDto("1. Section, Bestätigungsfeld")))),
            new TemplateSectionDto(
                "2. Section Titel",
                List.of(
                    new TemplateSectionElementDto(
                        new TemplateAnamnesisQuestionDto(
                            "2. Section, 1. Frage",
                            List.of(
                                new TemplateSubElementMultiSelectDto("Eine Antwortoption"),
                                new TemplateSubElementMultiSelectDto("Noch eine Antwortoption")),
                            new TemplateSubElementTextDto("Sonstige Antwortoption")),
                        null,
                        null)))));
  }
}
