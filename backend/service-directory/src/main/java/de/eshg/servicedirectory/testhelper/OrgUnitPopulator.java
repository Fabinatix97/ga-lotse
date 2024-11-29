/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.testhelper;

import de.eshg.lib.common.FederalState;
import de.eshg.lib.servicedirectory.api.ActorRequestDto;
import de.eshg.libservicedirectoryadminapi.api.actor.ActorDto;
import de.eshg.libservicedirectoryadminapi.api.actor.ActorTypeDto;
import de.eshg.libservicedirectoryadminapi.api.actor.CertificateDto;
import de.eshg.libservicedirectoryadminapi.api.actor.PartialActorDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitTypeDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.PartialOrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.rule.ActorSelectorDto;
import de.eshg.libservicedirectoryadminapi.api.rule.PartialRuleDto;
import de.eshg.libservicedirectoryadminapi.api.staging.CommitResponseDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagingStatusDto;
import de.eshg.servicedirectory.ServiceDirectoryAdminService;
import de.eshg.servicedirectory.ServiceDirectoryCommitService;
import de.eshg.servicedirectory.ServiceDirectoryReadService;
import de.eshg.servicedirectory.ServiceDirectoryService;
import de.eshg.servicedirectory.common.AdminNameHolder;
import de.eshg.servicedirectory.common.exception.ChangesNotFoundException;
import de.eshg.servicedirectory.orgunit.persistence.entity.OrgUnitType;
import de.eshg.servicedirectory.util.X509Utils;
import de.eshg.testhelper.TestHelperClock;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import java.io.IOException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;
import java.util.stream.IntStream;
import net.datafaker.Faker;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@PopulatorComponent
public class OrgUnitPopulator extends BasePopulator<OrgUnitDto> {

  private static final List<PartialOrgUnit> ORG_UNITS =
      List.of(
          new PartialOrgUnit("hessen", OrgUnitType.LA),
          new PartialOrgUnit("frankfurt", OrgUnitType.GA),
          new PartialOrgUnit("wiesbaden", OrgUnitType.GA),
          new PartialOrgUnit("central-services", OrgUnitType.ZD),
          new PartialOrgUnit("kassel", OrgUnitType.GA),
          new PartialOrgUnit("darmstadt", OrgUnitType.GA),
          new PartialOrgUnit("offenbach", OrgUnitType.GA));

  private static final String STATISTICS = "statistics";
  private static final Logger logger = LoggerFactory.getLogger(OrgUnitPopulator.class);
  private final ServiceDirectoryAdminService serviceDirectoryAdminService;
  private final ServiceDirectoryCommitService serviceDirectoryCommitService;
  private final ServiceDirectoryReadService serviceDirectoryReadService;
  private final Optional<TestHelperClock> testHelperClock;

  private final Map<String, CertKeyPair> lsdCertificates = new ConcurrentHashMap<>();
  private final ServiceDirectoryService serviceDirectoryService;

  protected OrgUnitPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      ServiceDirectoryAdminService serviceDirectoryAdminService,
      ServiceDirectoryCommitService serviceDirectoryCommitService,
      ServiceDirectoryReadService serviceDirectoryReadService,
      Optional<TestHelperClock> testHelperClock,
      ServiceDirectoryService serviceDirectoryService) {
    super(properties, clock, "org-unit", environmentConfig);
    this.serviceDirectoryAdminService = serviceDirectoryAdminService;
    this.serviceDirectoryCommitService = serviceDirectoryCommitService;
    this.serviceDirectoryReadService = serviceDirectoryReadService;
    this.testHelperClock = testHelperClock;
    this.serviceDirectoryService = serviceDirectoryService;
  }

  @Override
  protected OrgUnitDto populate(
      int index, Faker faker, BasePopulator<OrgUnitDto>.UniqueValueProvider uniqueValueProvider) {
    return populate(index, faker, uniqueValueProvider, true);
  }

  protected OrgUnitDto populate(
      int index,
      Faker faker,
      BasePopulator<OrgUnitDto>.UniqueValueProvider uniqueValueProvider,
      boolean generateCertificates) {
    PartialOrgUnit orgUnit = getOrgUnit(index, faker, uniqueValueProvider);

    Optional<OrgUnitDto> existingOrgUnit =
        serviceDirectoryReadService.getAllOrgUnits().orgUnits().stream()
            .filter(ou -> ou.readableName().equalsIgnoreCase(orgUnit.name))
            .findAny();
    if (existingOrgUnit.isPresent()) {
      logger.warn("org unit #{}: {} exists", index, orgUnit.name);
      return existingOrgUnit.get();
    }

    resetChanges(false);
    try {
      switch (orgUnit.type) {
        case GA -> createHealthDepartment(orgUnit.name, generateCertificates);
        case LA -> createLandDepartment(orgUnit.name, generateCertificates);
        case ZD -> createCentralServices(orgUnit.name, generateCertificates);
      }
    } catch (IOException | CertificateException | NoSuchAlgorithmException | KeyStoreException e) {
      throw new RuntimeException(e);
    }
    CommitResponseDto commitResponseDto = commitStaged();
    setSelfSignedCertificates(commitResponseDto);
    OrgUnitDto result = commitResponseDto.orgUnits().values().stream().findAny().orElseThrow();
    logger.info(
        "populated #{}: {} with {} actors", index, orgUnit.name, commitResponseDto.actors().size());
    return result;
  }

  private void setSelfSignedCertificates(CommitResponseDto commitResponseDto) {
    Optional<ActorDto> lsd =
        commitResponseDto.actors().values().stream()
            .filter(a -> a.type().equals(ActorTypeDto.LSD))
            .findAny();

    Optional<CertKeyPair> lsdCert =
        lsd.map(ActorDto::currentCertificate).map(CertificateDto::value).map(lsdCertificates::get);
    if (lsdCert.isEmpty()) {
      return;
    }

    var actors =
        commitResponseDto.actors().values().stream()
            .filter(a -> !a.manualCertificate())
            .map(
                a ->
                    new ActorRequestDto(
                        a.readableName(),
                        de.eshg.lib.servicedirectory.api.ActorTypeDto.valueOf(a.type().name()),
                        a.commonName(),
                        createCertificate(lsdCert.get(), a.commonName())))
            .toList();
    serviceDirectoryService.updateTopology(lsd.get().commonName(), actors);
  }

  @Override
  public ListWithTotalNumber<OrgUnitDto> populateWithAuthentication(
      int numberOfEntitiesToPopulate) {
    AdminNameHolder.setAdminName("populator");
    try {
      return populate(numberOfEntitiesToPopulate, true);
    } finally {
      AdminNameHolder.clearAdminName();
    }
  }

  public ListWithTotalNumber<OrgUnitDto> populate(
      int numberOfEntitiesToPopulate, boolean generateCertificates) {
    Supplier<Random> randomSupplier = newRandomSupplier();
    UniqueValueProvider uniqueValueProvider = new UniqueValueProvider();

    List<OrgUnitDto> entities =
        IntStream.range(0, numberOfEntitiesToPopulate)
            .mapToObj(
                index -> {
                  Random random = randomSupplier.get();
                  Faker faker = new Faker(random);
                  OrgUnitDto result =
                      populate(index, faker, uniqueValueProvider, generateCertificates);
                  testHelperClock.ifPresent(c -> c.windForwardDays(1));
                  return result;
                })
            .toList();
    testHelperClock.ifPresent(TestHelperClock::reset);

    log.info("Populated {} entities", entities.size());

    long totalNumberOfElements = countExistingEntities();

    return new ListWithTotalNumber<>(entities, totalNumberOfElements);
  }

  private void resetChanges(boolean quiet) {
    var user = AdminNameHolder.getAdminName();
    try {
      serviceDirectoryCommitService.resetStagedWithoutTransaction(user, null);
    } catch (ChangesNotFoundException ignored) {
      return;
    }
    if (quiet) {
      logger.warn("Reset staged changes for {}", user);
    }
  }

  private static PartialOrgUnit getOrgUnit(
      int index, Faker faker, BasePopulator<OrgUnitDto>.UniqueValueProvider uniqueValueProvider) {
    PartialOrgUnit orgUnit;
    try {
      orgUnit = ORG_UNITS.get(index);
    } catch (IndexOutOfBoundsException ignored) {
      orgUnit =
          new PartialOrgUnit(
              uniqueValueProvider.getUniqueFakerValue(
                  faker.dungeonsAndDragons()::cities, "dnd-ga-name"),
              OrgUnitType.GA);
    }
    return orgUnit;
  }

  @Override
  protected long countExistingEntities() {
    return serviceDirectoryReadService.getAllOrgUnits().orgUnits().size();
  }

  private void createLandDepartment(String orgUnitName, boolean generateCertificates)
      throws IOException, CertificateException, NoSuchAlgorithmException, KeyStoreException {
    String readableOrgUnitName = StringUtils.capitalize(orgUnitName);

    PartialOrgUnitDto orgUnit =
        serviceDirectoryAdminService.createOrgUnit(
            new PartialOrgUnitDto(
                null,
                readableOrgUnitName,
                true,
                OrgUnitTypeDto.LA,
                FederalState.HE,
                StagingStatusDto.READY_FOR_REVIEW));
    createLsd(orgUnit, generateCertificates);
    createActor("base", ActorTypeDto.GM, orgUnit);
    createActor(STATISTICS, ActorTypeDto.FM, orgUnit);

    ActorSelectorDto base =
        new ActorSelectorDto(
            FederalState.HE.toString(),
            OrgUnitTypeDto.LA.toString(),
            readableOrgUnitName,
            ActorTypeDto.GM.toString(),
            StringUtils.capitalize("base"));
    createRule(
        "Hessen LA all FMs to Hessen LA base",
        new ActorSelectorDto(
            FederalState.HE.toString(),
            OrgUnitTypeDto.LA.toString(),
            readableOrgUnitName,
            ActorTypeDto.FM.toString(),
            null),
        base);
    createRule(
        "Hessen LA base to all Hessen LA FMs",
        base,
        new ActorSelectorDto(
            FederalState.HE.toString(),
            OrgUnitTypeDto.LA.toString(),
            readableOrgUnitName,
            null,
            null));
    createRule(
        "Hessen LA base to all Hessen GA statistics",
        base,
        new ActorSelectorDto(
            FederalState.HE.toString(),
            OrgUnitTypeDto.LA.toString(),
            readableOrgUnitName,
            null,
            StringUtils.capitalize(STATISTICS)));
  }

  private void createHealthDepartment(String orgUnitName, boolean generateCertificates)
      throws IOException, CertificateException, NoSuchAlgorithmException, KeyStoreException {
    String readableOrgUnitName = StringUtils.capitalize(orgUnitName);

    PartialOrgUnitDto orgUnit =
        serviceDirectoryAdminService.createOrgUnit(
            new PartialOrgUnitDto(
                null,
                readableOrgUnitName,
                true,
                OrgUnitTypeDto.GA,
                FederalState.HE,
                StagingStatusDto.READY_FOR_REVIEW));
    createLsd(orgUnit, generateCertificates);
    createActor("base", ActorTypeDto.GM, orgUnit);
    createActor("inspection", ActorTypeDto.FM, orgUnit);
    createActor("chat-management", ActorTypeDto.FM, orgUnit);
    createActor("measles-protection", ActorTypeDto.FM, orgUnit);
    createActor("school-entry", ActorTypeDto.FM, orgUnit);
    createActor("statistics", ActorTypeDto.FM, orgUnit);
    createActor("travel-medicine", ActorTypeDto.FM, orgUnit);

    ActorSelectorDto base =
        new ActorSelectorDto(
            FederalState.HE.toString(),
            OrgUnitTypeDto.GA.toString(),
            readableOrgUnitName,
            ActorTypeDto.GM.toString(),
            StringUtils.capitalize("base"));
    createRule(
        "GA FMs to GA base",
        new ActorSelectorDto(
            FederalState.HE.toString(),
            OrgUnitTypeDto.GA.toString(),
            readableOrgUnitName,
            ActorTypeDto.FM.toString(),
            null),
        base);
    createRule(
        "GA base to GA FMs",
        base,
        new ActorSelectorDto(
            FederalState.HE.toString(),
            OrgUnitTypeDto.GA.toString(),
            readableOrgUnitName,
            null,
            null));
  }

  private void createCentralServices(String orgUnitName, boolean generateCertificates)
      throws IOException, CertificateException, NoSuchAlgorithmException, KeyStoreException {
    String readableOrgUnitName = StringUtils.capitalize(orgUnitName);

    PartialOrgUnitDto orgUnit =
        serviceDirectoryAdminService.createOrgUnit(
            new PartialOrgUnitDto(
                null,
                readableOrgUnitName,
                true,
                OrgUnitTypeDto.ZD,
                FederalState.HE,
                StagingStatusDto.READY_FOR_REVIEW));
    createLsd(orgUnit, generateCertificates);
    createActor("central-repository", ActorTypeDto.ZR, orgUnit);
    ActorSelectorDto server =
        new ActorSelectorDto(
            FederalState.HE.toString(),
            OrgUnitTypeDto.ZD.toString(),
            readableOrgUnitName,
            null,
            null);
    createRule(
        "any Hessen GA to central-rep",
        new ActorSelectorDto(
            FederalState.HE.toString(), OrgUnitTypeDto.GA.toString(), null, null, null),
        server);
    createRule(
        "Hessen LA to central-repo",
        new ActorSelectorDto(
            FederalState.HE.toString(), OrgUnitTypeDto.LA.toString(), null, null, null),
        server);
  }

  private void createLsd(PartialOrgUnitDto orgUnit, boolean generateCertificate)
      throws CertificateException, IOException, NoSuchAlgorithmException, KeyStoreException {
    String name = "local-service-directory";
    String orgUnitName = orgUnit.readableName().toLowerCase();
    String commonName = name + "." + orgUnitName + ".ga-lotse";
    CertificateDto certificate = null;
    // TODO: for this to work with spatz, we have to sign the lsd certificate(s) with a valid CA.
    if (generateCertificate) {
      CertKeyPair signatory = X509TestHelperUtil.generateKeyStore(commonName);
      String certPem = X509TestHelperUtil.generateCertPem(X509Utils.parsePem(signatory.cert()));
      String signature = X509Utils.sign(certPem, signatory.privateKey());
      certificate = new CertificateDto(certPem, signature, signatory.cert());
      lsdCertificates.put(signatory.cert(), signatory);
    }
    createActor(name, ActorTypeDto.LSD, orgUnit, commonName, certificate);
  }

  private void createActor(String name, ActorTypeDto type, PartialOrgUnitDto orgUnit) {
    String orgUnitName = orgUnit.readableName().toLowerCase();
    String commonName = name + "." + orgUnitName + ".ga-lotse";
    createActor(name, type, orgUnit, commonName, null);
  }

  private void createActor(
      String name,
      ActorTypeDto type,
      PartialOrgUnitDto orgUnit,
      String commonName,
      CertificateDto certificate) {
    serviceDirectoryAdminService.createActor(
        new PartialActorDto(
            null,
            StringUtils.capitalize(name),
            type,
            true,
            type == ActorTypeDto.LSD,
            commonName,
            certificate,
            null,
            "network-0",
            orgUnit.id(),
            StagingStatusDto.READY_FOR_REVIEW));
  }

  private void createRule(String description, ActorSelectorDto client, ActorSelectorDto server) {
    serviceDirectoryAdminService.createRule(
        new PartialRuleDto(
            null, description, client, server, true, StagingStatusDto.READY_FOR_REVIEW));
  }

  private static de.eshg.lib.servicedirectory.api.CertificateDto createCertificate(
      CertKeyPair signatory, String commonName) {

    String certificate;
    try {
      certificate = X509TestHelperUtil.generateCertPem(commonName);
    } catch (Exception e) {
      if (e instanceof RuntimeException re) {
        throw re;
      }
      throw new RuntimeException(e);
    }

    String signature = X509Utils.sign(certificate, signatory.privateKey());
    return new de.eshg.lib.servicedirectory.api.CertificateDto(
        certificate, signature, signatory.cert());
  }

  private CommitResponseDto commitStaged() {
    String backup = AdminNameHolder.getAdminName();
    AdminNameHolder.setAdminName("test-helper");

    CommitResponseDto result = serviceDirectoryCommitService.commitStaged(backup, null);

    AdminNameHolder.setAdminName(backup);
    return result;
  }

  private record PartialOrgUnit(String name, OrgUnitType type) {}
}
