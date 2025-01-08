/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import de.eshg.base.user.UserApi;
import de.eshg.inspection.facility.FacilityService;
import de.eshg.inspection.facility.api.InspAddFacilityRequest;
import de.eshg.inspection.facility.api.InspAddFacilityResponse;
import de.eshg.inspection.inspection.InspectionService;
import de.eshg.inspection.inspection.api.InspectionDto;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.inspection.inspection.api.StartInspectionRequest;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectTypeRepository;
import de.eshg.lib.common.CountryCode;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class FacilityTestDataProvider {

  private final FacilityService facilityService;
  private final InspectionService inspectionService;
  private final UserApi userApi;
  private final ObjectTypeRepository objectTypeRepository;

  private static final String STANDARD_OBJECT_TYPE = "Kosmetische Einrichtung";

  public static final int NUMBER_OF_DEFINED_FACILITIES = 7;

  private static final List<String> facilityNames =
      List.of(
          "Indira Nails",
          "Lalesen",
          "Mena's Studio",
          "My Nails",
          "Nails",
          "Oh, my Nails!",
          "Antiquariat");

  private static final List<DomesticAddressDto> domesticAddressList =
      List.of(
          new DomesticAddressDto(
              CountryCode.DE, "Frankfurt am Main", "65933", null, "Elektronstraße", "27", null),
          new DomesticAddressDto(
              CountryCode.DE, "Frankfurt am Main", "60311", null, "Hasengasse", "3", null),
          new DomesticAddressDto(
              CountryCode.DE, "Frankfurt am Main", "60431", null, "Raimundstraße", "22", null),
          new DomesticAddressDto(
              CountryCode.DE, "Frankfurt am Main", "60313", null, "Alte Gasse", "51", null),
          new DomesticAddressDto(
              CountryCode.DE, "Frankfurt am Main", "60329", null, "Taunusstraße", "18", null),
          new DomesticAddressDto(
              CountryCode.DE,
              "Frankfurt am Main",
              "60320",
              null,
              "Eschersheimer Landstraße",
              "312",
              null),
          new DomesticAddressDto(
              CountryCode.DE, "Frankfurt am Main", "60313", null, "Göthestraße", "123", null));

  private static final List<FacilityContactPersonDto> contactPersonList =
      List.of(
          new FacilityContactPersonDto(
              "karim.madubuko@example.com",
              "030 996581826037",
              "CEO",
              "Madubuko",
              "Karim",
              "Prof. Dr.",
              SalutationDto.NEUTRAL,
              GenderDto.DIVERSE),
          new FacilityContactPersonDto(
              "Mailin.Beushausen@example.com",
              "06026 1765114",
              "CEO",
              "Beushausen",
              "Mailin",
              "Prof. Dr.",
              SalutationDto.FEMALE,
              GenderDto.FEMALE),
          new FacilityContactPersonDto(
              "tessa.schuermann@example.com",
              "04948 543267787",
              "CEO",
              "Schuermann",
              "Tessa",
              "Prof. Dr.",
              SalutationDto.FEMALE,
              GenderDto.FEMALE),
          new FacilityContactPersonDto(
              "konrad.swillims@example.com",
              "04952 06328",
              "CEO",
              "Swillims",
              "Konrad",
              "Prof. Dr.",
              SalutationDto.MALE,
              GenderDto.MALE),
          new FacilityContactPersonDto(
              "xenia.rohrer@example.com",
              "030 996581826037",
              "CEO",
              "Rohrer",
              "Xenia",
              "Prof. Dr.",
              SalutationDto.FEMALE,
              GenderDto.FEMALE),
          new FacilityContactPersonDto(
              "tore.buettner@example.com",
              "04181 584172823",
              "CEO",
              "Büttner",
              "Tore",
              "Prof. Dr.",
              SalutationDto.MALE,
              GenderDto.MALE),
          new FacilityContactPersonDto(
              "kkk@example.com",
              "069 481",
              "Bibliothekar",
              "Koreander",
              "Karl Konrad",
              null,
              SalutationDto.MALE,
              GenderDto.MALE));

  private static final List<String> emailAddressList =
      List.of(
          "xaver.duma@example.com",
          "julien.donie@example.com",
          "rebecca.kass@example.com",
          "len.deja@example.com",
          "kristin.krug@example.com",
          "ruben.stanger@example.com",
          "bbb@example.com");
  private static final List<String> phoneNumberList =
      List.of(
          "032 2996751",
          "04953 912552968",
          "08023 725294",
          "04969 61",
          "04966 232545609",
          "032 2047392",
          "069 480");

  public FacilityTestDataProvider(
      FacilityService facilityService,
      InspectionService inspectionService,
      UserApi userApi,
      ObjectTypeRepository objectTypeRepository) {
    this.facilityService = facilityService;
    this.userApi = userApi;
    this.objectTypeRepository = objectTypeRepository;
    this.inspectionService = inspectionService;
  }

  public InspectionDto createTestFacilityAndStartInsp(int index) {
    InspAddFacilityResponse addFacilityResponse =
        facilityService.addFacility(createAddFacilityRequest(index));
    if (index > 0) {
      inspectionService.startInspection(
          addFacilityResponse.procedureId(),
          new StartInspectionRequest(
              getStandardObjectType().getId(),
              InspectionType.INITIAL,
              this.userApi.getSelfUser().userId(),
              null));
    }
    return inspectionService.loadInspectionDTO(addFacilityResponse.procedureId());
  }

  public static String getNameOfFacility(int index) {
    return facilityNames.get(index % NUMBER_OF_DEFINED_FACILITIES) + getNameSuffix(index);
  }

  public static String getNameSuffix(int index) {
    if (index < NUMBER_OF_DEFINED_FACILITIES) {
      return "";
    } else {
      return " " + (index / NUMBER_OF_DEFINED_FACILITIES + 1);
    }
  }

  private ObjectType getStandardObjectType() {
    return objectTypeRepository
        .findByName(STANDARD_OBJECT_TYPE)
        .orElseThrow(
            () -> new RuntimeException("standard object type not found: " + STANDARD_OBJECT_TYPE));
  }

  private static DomesticAddressDto createDomesticAddress(int index) {
    return domesticAddressList.get(index % NUMBER_OF_DEFINED_FACILITIES);
  }

  private static PostboxAddressDto createPostboxAddress(int index) {
    return new PostboxAddressDto(
        CountryCode.US, "Frankfurt am Main", "60320", getNameOfFacility(index), "12" + index);
  }

  private static AddFacilityFileStateRequest createAddFacilityFileStateRequest(
      int index,
      String name,
      List<FacilityContactPersonDto> contacts,
      AddressDto contactAddress,
      AddressDto postboxAddressDto) {
    return new AddFacilityFileStateRequest(
        name,
        List.of(emailAddressList.get(index % NUMBER_OF_DEFINED_FACILITIES)),
        List.of(phoneNumberList.get(index % NUMBER_OF_DEFINED_FACILITIES)),
        contacts,
        contactAddress,
        postboxAddressDto,
        DataOriginDto.MANUAL);
  }

  private static AddFacilityFileStateRequest createAddBaseFacilityRequest(int index) {
    String name = getNameOfFacility(index);
    FacilityContactPersonDto contact1 = contactPersonList.get(index % NUMBER_OF_DEFINED_FACILITIES);
    DomesticAddressDto address1 = createDomesticAddress(index);
    PostboxAddressDto address2 = createPostboxAddress(index);
    return createAddFacilityFileStateRequest(
        index, name, Collections.singletonList(contact1), address1, address2);
  }

  private InspAddFacilityRequest createAddFacilityRequest(int index) {
    return new InspAddFacilityRequest(createAddBaseFacilityRequest(index), null, null);
  }
}
