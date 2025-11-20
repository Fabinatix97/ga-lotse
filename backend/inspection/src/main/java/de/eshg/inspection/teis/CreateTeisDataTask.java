/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis;

import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.teis.persistence.*;
import de.eshg.persistence.TransactionHelper;
import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Supplier;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

@Component
public class CreateTeisDataTask {

  public static final String ANALYSEVERFAHREN_XML_FILE =
      "/de/eshg/inspection/teis/teis5_analyseverfahren.xml";
  public static final String AUFBEREITUNGSVERFAHREN_XML_FILE =
      "/de/eshg/inspection/teis/teis5_aufbereitungsverfahren.xml";
  public static final String EINHEIT_XML_FILE = "/de/eshg/inspection/teis/teis5_einheit.xml";
  public static final String EU_PARAMETER_XML_FILE =
      "/de/eshg/inspection/teis/teis5_eu-parameter-Stand_2024.xml";
  public static final String GESUNDHEITSAMT_XML_FILE =
      "/de/eshg/inspection/teis/teis5_gesundheitsamt.xml";
  public static final String LAND_XML_FILE = "/de/eshg/inspection/teis/teis5_laender_2024.xml";
  public static final String LISTE_XML_FILE = "/de/eshg/inspection/teis/teis5_liste.xml";
  public static final String MESSWERTTEXT_XML_FILE =
      "/de/eshg/inspection/teis/teis5_messwerttext.xml";
  public static final String PARAMETER_XML_FILE = "/de/eshg/inspection/teis/teis5_parameter.xml";
  public static final String PROBENAHMEHAEUFIGKEIT_XML_FILE =
      "/de/eshg/inspection/teis/teis5_pnhaeufigkeit.xml";
  public static final String UMRECHNUNG_XML_FILE = "/de/eshg/inspection/teis/teis5_umrechnung.xml";
  public static final String VERWALTUNGSBEZIRK_FILE =
      "/de/eshg/inspection/teis/teis5_verwaltungsbezirke-NRW_2024.xml";
  public static final String UNTERSUCHUNGSPARAMETER_XML_FILE =
      "/de/eshg/inspection/teis/teis5_untersuchungsumfang/teis5_untersuchungsparameter.xml";
  public static final String UNTERSUCHUNGSUMFANG_FILE =
      "/de/eshg/inspection/teis/teis5_untersuchungsumfang/teis5_untersuchungsumfang.xml";

  public static final String PARAMETER_XML_FILE_FOR_TEST =
      "/de/eshg/inspection/teis_for_tests/teis5_parameter.xml";
  public static final String UNTERSUCHUNGSPARAMETER_XML_FILE_FOR_TEST =
      "/de/eshg/inspection/teis_for_tests/teis5_untersuchungsumfang/teis5_untersuchungsparameter.xml";

  private final ClassPathResource analyseverfahrenXmlFile;
  private final ClassPathResource aufbereitungsverfahrenXmlFile;
  private final ClassPathResource einheitXmlFile;
  private final ClassPathResource euParameterXmlFile;
  private final ClassPathResource gesundheitsamtXmlFile;
  private final ClassPathResource landXmlFile;
  private final ClassPathResource listeXmlFile;
  private final ClassPathResource messwerttextXmlFile;
  private final ClassPathResource parameterXmlFile;
  private final ClassPathResource probenahmehaeufigkeitXmlFile;
  private final ClassPathResource umrechnungXmlFile;
  private final ClassPathResource verwaltungsbezirkXmlFile;
  private final ClassPathResource untersuchungsparameterXmlFile;
  private final ClassPathResource untersuchtungsumfangXmlFile;

  private final ClassPathResource parameterXmlFileForTest;
  private final ClassPathResource untersuchungsparameterXmlFileForTest;

  private final TeisRepositories repositories;
  private final TransactionHelper transactionHelper;
  private final InspectionFeatureToggle inspectionFeatureToggle;

  public CreateTeisDataTask(
      @Value(ANALYSEVERFAHREN_XML_FILE) ClassPathResource analyseverfahrenXmlFile,
      @Value(AUFBEREITUNGSVERFAHREN_XML_FILE) ClassPathResource aufbereitungsverfahrenXmlFile,
      @Value(EINHEIT_XML_FILE) ClassPathResource einheitXmlFile,
      @Value(EU_PARAMETER_XML_FILE) ClassPathResource euParameterXmlFile,
      @Value(GESUNDHEITSAMT_XML_FILE) ClassPathResource gesundheitsamtXmlFile,
      @Value(LAND_XML_FILE) ClassPathResource landXmlFile,
      @Value(LISTE_XML_FILE) ClassPathResource listeXmlFile,
      @Value(MESSWERTTEXT_XML_FILE) ClassPathResource messwerttextXmlFile,
      @Value(PARAMETER_XML_FILE) ClassPathResource parameterXmlFile,
      @Value(PROBENAHMEHAEUFIGKEIT_XML_FILE) ClassPathResource probenahmehaeufigkeitXmlFile,
      @Value(UMRECHNUNG_XML_FILE) ClassPathResource umrechnungXmlFile,
      @Value(VERWALTUNGSBEZIRK_FILE) ClassPathResource verwaltungsbezirkXmlFile,
      @Value(UNTERSUCHUNGSPARAMETER_XML_FILE) ClassPathResource untersuchungsparameterXmlFile,
      @Value(UNTERSUCHUNGSUMFANG_FILE) ClassPathResource untersuchtungsumfangXmlFile,
      @Value(PARAMETER_XML_FILE_FOR_TEST) ClassPathResource parameterXmlFileForTest,
      @Value(UNTERSUCHUNGSPARAMETER_XML_FILE_FOR_TEST)
          ClassPathResource untersuchungsparameterXmlFileForTest,
      TeisAnalyseverfahrenRepository teisAnalyseverfahrenRepository,
      TeisAufbereitungsverfahrenRepository teisAufbereitungsverfahrenRepository,
      TeisEinheitRepository teisEinheitRepository,
      TeisEuParameterRepository teisEuParameterRepository,
      TeisGesundheitsamtRepository teisGesundheitsamtRepository,
      TeisLandRepository teisLandRepository,
      TeisListeRepository teisListeRepository,
      TeisMesswerttextRepository teisMesswerttextRepository,
      TeisParameterRepository teisParameterRepository,
      TeisProbenahmehaeufigkeitRepository teisProbenahmehaeufigkeitRepository,
      TeisUmrechnungRepository teisUmrechnungRepository,
      TeisVerwaltungsbezirkRepository teisVerwaltungsbezirkRepository,
      TeisUntersuchungsparameterRepository teisUntersuchungsparameterRepository,
      TeisUntersuchungsumfangRepository teisUntersuchungsumfangRepository,
      TransactionHelper transactionHelper,
      InspectionFeatureToggle inspectionFeatureToggle) {
    this.transactionHelper = transactionHelper;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
    this.repositories =
        new TeisRepositories(
            teisAnalyseverfahrenRepository,
            teisAufbereitungsverfahrenRepository,
            teisEinheitRepository,
            teisEuParameterRepository,
            teisGesundheitsamtRepository,
            teisLandRepository,
            teisListeRepository,
            teisMesswerttextRepository,
            teisParameterRepository,
            teisProbenahmehaeufigkeitRepository,
            teisUmrechnungRepository,
            teisVerwaltungsbezirkRepository,
            teisUntersuchungsparameterRepository,
            teisUntersuchungsumfangRepository);

    assertFileExists(analyseverfahrenXmlFile);
    assertFileExists(aufbereitungsverfahrenXmlFile);
    assertFileExists(einheitXmlFile);
    assertFileExists(euParameterXmlFile);
    assertFileExists(gesundheitsamtXmlFile);
    assertFileExists(landXmlFile);
    assertFileExists(listeXmlFile);
    assertFileExists(messwerttextXmlFile);
    assertFileExists(parameterXmlFile);
    assertFileExists(probenahmehaeufigkeitXmlFile);
    assertFileExists(umrechnungXmlFile);
    assertFileExists(verwaltungsbezirkXmlFile);
    assertFileExists(untersuchungsparameterXmlFile);
    assertFileExists(untersuchtungsumfangXmlFile);
    assertFileExists(parameterXmlFileForTest);
    assertFileExists(untersuchungsparameterXmlFileForTest);

    this.analyseverfahrenXmlFile = analyseverfahrenXmlFile;
    this.aufbereitungsverfahrenXmlFile = aufbereitungsverfahrenXmlFile;
    this.einheitXmlFile = einheitXmlFile;
    this.euParameterXmlFile = euParameterXmlFile;
    this.gesundheitsamtXmlFile = gesundheitsamtXmlFile;
    this.landXmlFile = landXmlFile;
    this.listeXmlFile = listeXmlFile;
    this.messwerttextXmlFile = messwerttextXmlFile;
    this.parameterXmlFile = parameterXmlFile;
    this.probenahmehaeufigkeitXmlFile = probenahmehaeufigkeitXmlFile;
    this.umrechnungXmlFile = umrechnungXmlFile;
    this.verwaltungsbezirkXmlFile = verwaltungsbezirkXmlFile;
    this.untersuchungsparameterXmlFile = untersuchungsparameterXmlFile;
    this.untersuchtungsumfangXmlFile = untersuchtungsumfangXmlFile;
    this.parameterXmlFileForTest = parameterXmlFileForTest;
    this.untersuchungsparameterXmlFileForTest = untersuchungsparameterXmlFileForTest;
  }

  @PostConstruct
  public void parseXml() {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.TEIS_DATA)) {
      return;
    }
    transactionHelper.executeInTransaction(
        () -> {
          // If we can find entries that are already in the database, we can assume that this
          // already ran.
          if (repositories.teisAnalyseverfahrenRepository().count() == 0) {
            parseFile(analyseverfahrenXmlFile.getFile());
            parseFile(aufbereitungsverfahrenXmlFile.getFile());
            parseFile(einheitXmlFile.getFile());
            parseFile(gesundheitsamtXmlFile.getFile());
            parseFile(landXmlFile.getFile());
            parseFile(listeXmlFile.getFile());
            parseFile(messwerttextXmlFile.getFile());
            parseFile(parameterXmlFile.getFile());
            parseFile(probenahmehaeufigkeitXmlFile.getFile());
            parseFile(umrechnungXmlFile.getFile());
            parseFile(verwaltungsbezirkXmlFile.getFile());
            parseFile(untersuchtungsumfangXmlFile.getFile());
            parseFile(euParameterXmlFile.getFile());
            parseFile(untersuchungsparameterXmlFile.getFile());
          }
        });
  }

  public void parseXmlForTest() {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.TEIS_DATA)) {
      return;
    }
    transactionHelper.executeInTransaction(
        () -> {
          // If we can find entries that are already in the database, we can assume that this
          // already ran.
          if (repositories.teisEinheitRepository().count() == 0) {
            parseFile(einheitXmlFile.getFile());
            parseFile(listeXmlFile.getFile());
            parseFile(parameterXmlFileForTest.getFile());
            parseFile(untersuchtungsumfangXmlFile.getFile());
            parseFile(untersuchungsparameterXmlFileForTest.getFile());
          }
        });
  }

  private void parseFile(File file) throws ParserConfigurationException, IOException, SAXException {
    DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
    DocumentBuilder db = dbf.newDocumentBuilder();
    Document document = db.parse(file);

    List<TeisAnalyseverfahren> teisAnalyseverfahrenList = new ArrayList<>();
    List<TeisAufbereitungsverfahren> teisAufbereitungsverfahrenList = new ArrayList<>();
    List<TeisEinheit> teisEinheitList = new ArrayList<>();
    List<TeisEuParameter> teisEuParameterList = new ArrayList<>();
    List<TeisGesundheitsamt> teisGesundheitsamtList = new ArrayList<>();
    List<TeisLand> teisLandList = new ArrayList<>();
    List<TeisListe> teisListeList = new ArrayList<>();
    List<TeisMesswerttext> teisMesswerttextList = new ArrayList<>();
    List<TeisParameter> teisParameterList = new ArrayList<>();
    List<TeisProbenahmehaeufigkeit> teisProbenahmehaeufigkeitList = new ArrayList<>();
    List<TeisUmrechnung> teisUmrechnungList = new ArrayList<>();
    List<TeisVerwaltungsbezirk> teisVerwaltungsbezirkList = new ArrayList<>();
    List<TeisUntersuchungsparameter> teisUntersuchungsparameterList = new ArrayList<>();
    List<TeisUntersuchungsumfang> teisUntersuchungsumfangList = new ArrayList<>();

    NodeList nodeList = document.getChildNodes();
    for (int i = 0; i < nodeList.getLength(); i++) {
      Node node = nodeList.item(i);
      if ("TEIS".equals(node.getNodeName())) {
        NodeList entityNodes = node.getChildNodes();
        for (int j = 0; j < entityNodes.getLength(); j++) {
          Node entityNode = entityNodes.item(j);
          switch (entityNode.getNodeName()) {
            case "ANALYSEVERFAHREN" ->
                parseTeisEntity(
                    entityNode, TeisAnalyseverfahren::new, teisAnalyseverfahrenList::add);
            case "AUFBEREITUNGSVERFAHREN" ->
                parseTeisEntity(
                    entityNode,
                    TeisAufbereitungsverfahren::new,
                    teisAufbereitungsverfahrenList::add);
            case "EINHEIT" -> parseTeisEntity(entityNode, TeisEinheit::new, teisEinheitList::add);
            case "EUPARAMETER" ->
                parseTeisEntity(entityNode, TeisEuParameter::new, teisEuParameterList::add);
            case "GESUNDHEITSAMT" ->
                parseTeisEntity(entityNode, TeisGesundheitsamt::new, teisGesundheitsamtList::add);
            case "LAND" -> parseTeisEntity(entityNode, TeisLand::new, teisLandList::add);
            case "LISTE" -> parseTeisEntity(entityNode, TeisListe::new, teisListeList::add);
            case "MESSWERTTEXT" ->
                parseTeisEntity(entityNode, TeisMesswerttext::new, teisMesswerttextList::add);
            case "PARAMETER" ->
                parseTeisEntity(entityNode, TeisParameter::new, teisParameterList::add);
            case "PROBENAHMEHAEUFIGKEIT" ->
                parseTeisEntity(
                    entityNode, TeisProbenahmehaeufigkeit::new, teisProbenahmehaeufigkeitList::add);
            case "UMRECHNUNG" ->
                parseTeisEntity(entityNode, TeisUmrechnung::new, teisUmrechnungList::add);
            case "UNTERSUCHUNGSPARAMETER" ->
                parseTeisEntity(
                    entityNode,
                    TeisUntersuchungsparameter::new,
                    teisUntersuchungsparameterList::add);
            case "UNTERSUCHUNGSUMFANG" ->
                parseTeisEntity(
                    entityNode, TeisUntersuchungsumfang::new, teisUntersuchungsumfangList::add);
            case "VERWALTUNGSBEZIRK" ->
                parseTeisEntity(
                    entityNode, TeisVerwaltungsbezirk::new, teisVerwaltungsbezirkList::add);
          }
        }
      }
    }

    repositories.teisAnalyseverfahrenRepository().saveAll(teisAnalyseverfahrenList);
    repositories.teisAufbereitungsverfahrenRepository().saveAll(teisAufbereitungsverfahrenList);
    repositories.teisEinheitRepository().saveAll(teisEinheitList);
    repositories.teisEuParameterRepository().saveAll(teisEuParameterList);
    repositories.teisGesundheitsamtRepository().saveAll(teisGesundheitsamtList);
    repositories.teisLandRepository().saveAll(teisLandList);
    repositories.teisListeRepository().saveAll(teisListeList);
    repositories.teisMesswerttextRepository().saveAll(teisMesswerttextList);
    repositories.teisParameterRepository().saveAll(teisParameterList);
    repositories.teisProbenahmehaeufigkeitRepository().saveAll(teisProbenahmehaeufigkeitList);
    repositories.teisUmrechnungRepository().saveAll(teisUmrechnungList);
    repositories.teisVerwaltungsbezirkRepository().saveAll(teisVerwaltungsbezirkList);
    repositories.teisUntersuchungsparameterRepository().saveAll(teisUntersuchungsparameterList);
    repositories.teisUntersuchungsumfangRepository().saveAll(teisUntersuchungsumfangList);
  }

  private <T extends TeisEntity> T parseTeisEntity(
      Node entityNode, Supplier<T> constructor, Consumer<T> saver) {
    T entity = constructor.get();
    NodeList nodeList = entityNode.getChildNodes();
    for (int i = 0; i < nodeList.getLength(); i++) {
      Node node = nodeList.item(i);

      String nodeName = node.getNodeName();
      String textContent = node.getTextContent();

      if (!nodeName.equals("#text")) {
        TeisAttribute teisAttribute = TeisAttribute.valueOf(nodeName);

        // We remove the SPA control code from the content because for some reason it exists in at
        // least one of the XML files and the database doesn't like it.
        teisAttribute.apply(entity, textContent.replace("\u0096", ""), repositories);
      }
    }
    saver.accept(entity);
    return entity;
  }

  private void assertFileExists(ClassPathResource file) {
    Assert.isTrue(file.exists(), file + " does not exist");
  }
}
