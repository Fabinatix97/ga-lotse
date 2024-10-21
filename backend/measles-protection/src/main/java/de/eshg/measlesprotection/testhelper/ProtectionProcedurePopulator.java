/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.measlesprotection.DraftProtectionProcedureController;
import de.eshg.measlesprotection.api.MPFacilityTypeDto;
import de.eshg.measlesprotection.api.ReportDataDto;
import de.eshg.measlesprotection.api.ReportingReasonDto;
import de.eshg.measlesprotection.api.RoleStatusDto;
import de.eshg.measlesprotection.api.draft.AddCustodianRequest;
import de.eshg.measlesprotection.api.draft.AddFacilityRequest;
import de.eshg.measlesprotection.api.draft.AffectedPersonDetailsDto;
import de.eshg.measlesprotection.api.draft.CreatePersonRequest;
import de.eshg.measlesprotection.api.draft.CreatePersonResponse;
import de.eshg.measlesprotection.api.draft.CustodianDetailsDto;
import de.eshg.measlesprotection.api.draft.OpenProcedureRequest;
import de.eshg.measlesprotection.api.draft.OpenProcedureResponse;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedureRepository;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import net.datafaker.Faker;
import net.datafaker.providers.base.Address;
import net.datafaker.providers.base.Name;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnTestHelperEnabled
public class ProtectionProcedurePopulator extends BasePopulator<OpenProcedureResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final DraftProtectionProcedureController draftProtectionProcedureController;
  private final MeaslesProtectionProcedureRepository measlesProtectionProcedureRepository;

  public ProtectionProcedurePopulator(
      Clock clock,
      Environment environment,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      DraftProtectionProcedureController draftProtectionProcedureController,
      MeaslesProtectionProcedureRepository measlesProtectionProcedureRepository,
      EnvironmentConfig environmentConfig) {
    super(
        clock,
        environment,
        getClassNameAsPropertyKey(MeaslesProtectionProcedure.class),
        environmentConfig);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.draftProtectionProcedureController = draftProtectionProcedureController;
    this.measlesProtectionProcedureRepository = measlesProtectionProcedureRepository;
  }

  @Override
  public ListWithTotalNumber<OpenProcedureResponse> populate(int numberOfEntitiesToPopulate) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> populateWithAuthentication(numberOfEntitiesToPopulate));
  }

  @Override
  protected OpenProcedureResponse populate(
      int index,
      Faker faker,
      BasePopulator<OpenProcedureResponse>.UniqueValueProvider uniqueValueProvider) {
    Address address = faker.address();

    CreatePersonResponse createPersonResponse = createPerson(faker, address);
    UUID procedureId = createPersonResponse.id();

    addCustodian(faker, procedureId, domesticAddress(address));
    addFacility(faker, procedureId);
    return openProcedure(procedureId);
  }

  private CreatePersonResponse createPerson(Faker faker, Address address) {
    Name personsName = faker.name();
    String firstName = personsName.firstName();
    String lastName = personsName.lastName();
    AffectedPersonDetailsDto affectedPerson =
        new AffectedPersonDetailsDto(
            firstName,
            lastName,
            dateOfBirth(faker, childAge(faker)),
            List.of(faker.phoneNumber().phoneNumber()),
            List.of(faker.internet().emailAddress()),
            CountryCode.DE,
            GenderDto.NOT_SPECIFIED,
            lastName,
            address.city(),
            SalutationDto.NOT_SPECIFIED,
            null,
            domesticAddress(address),
            null);
    CreatePersonRequest createPersonRequest = new CreatePersonRequest(affectedPerson);
    return draftProtectionProcedureController.createPerson(createPersonRequest);
  }

  private void addCustodian(Faker faker, UUID procedureId, AddressDto address) {
    Name name = faker.name();
    String firstName = name.firstName();
    String lastName = name.lastName();
    CustodianDetailsDto custodian =
        new CustodianDetailsDto(
            firstName,
            lastName,
            dateOfBirth(faker, adultAge(faker)),
            List.of(phoneNumber(faker)),
            List.of(faker.internet().emailAddress()),
            GenderDto.NOT_SPECIFIED,
            null,
            null,
            SalutationDto.NOT_SPECIFIED,
            null,
            address);
    draftProtectionProcedureController.addCustodian(
        procedureId, new AddCustodianRequest(custodian));
  }

  private void addFacility(Faker faker, UUID procedureId) {
    Name facilityContact = faker.name();
    String fcLastName = facilityContact.lastName();
    String fcFirstName = facilityContact.firstName();
    String fcMail = faker.internet().emailAddress();
    FacilityContactPersonDto facilityContactPerson =
        new FacilityContactPersonDto(
            fcMail,
            phoneNumber(faker),
            null,
            fcLastName,
            fcFirstName,
            facilityContact.title(),
            SalutationDto.NOT_SPECIFIED,
            GenderDto.NOT_SPECIFIED);

    AddFacilityFileStateRequest facilityFileState =
        new AddFacilityFileStateRequest(
            faker.educator().secondarySchool(),
            List.of(fcMail),
            List.of(phoneNumber(faker)),
            List.of(facilityContactPerson),
            domesticAddress(faker.address()),
            null,
            DataOriginDto.MANUAL);
    AddFacilityRequest addFacilityRequest =
        new AddFacilityRequest(facilityFileState, MPFacilityTypeDto.SCHOOL, null);
    draftProtectionProcedureController.addFacility(procedureId, addFacilityRequest);
  }

  private OpenProcedureResponse openProcedure(UUID procedureId) {
    ReportDataDto reportDataDto =
        new ReportDataDto(LocalDate.now(clock), ReportingReasonDto.NO_PROOF, null);
    OpenProcedureRequest openProcedureRequest =
        new OpenProcedureRequest(reportDataDto, RoleStatusDto.SUPERVISED);
    return draftProtectionProcedureController.openProcedure(procedureId, openProcedureRequest);
  }

  private static String phoneNumber(Faker faker) {
    return faker.phoneNumber().phoneNumberNational();
  }

  private static int childAge(Faker faker) {
    return faker.random().nextInt(5, 17);
  }

  private static int adultAge(Faker faker) {
    return faker.random().nextInt(19, 67);
  }

  private LocalDate dateOfBirth(Faker faker, int age) {
    return LocalDate.now(clock).minusYears(age).minusDays(faker.random().nextInt(400));
  }

  private static DomesticAddressDto domesticAddress(Address address) {
    return new DomesticAddressDto(
        CountryCode.valueOf(address.countryCode()),
        address.city(),
        address.zipCode(),
        null,
        address.streetName(),
        address.streetAddressNumber(),
        null);
  }

  @Override
  protected long countExistingEntities() {
    return measlesProtectionProcedureRepository.count();
  }
}
