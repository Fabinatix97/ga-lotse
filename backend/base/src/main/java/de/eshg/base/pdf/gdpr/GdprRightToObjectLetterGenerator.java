/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.pdf.gdpr;

import de.eshg.base.address.persistence.entity.Address;
import de.eshg.base.address.persistence.entity.DomesticAddress;
import de.eshg.base.address.persistence.entity.PostboxAddress;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.centralfile.persistence.repository.FacilityRepository;
import de.eshg.base.centralfile.persistence.repository.PersonRepository;
import de.eshg.base.department.DepartmentConfiguration;
import de.eshg.base.department.DepartmentController;
import de.eshg.base.gdpr.persistence.GdprFacility;
import de.eshg.base.gdpr.persistence.GdprPerson;
import de.eshg.base.gdpr.persistence.GdprProcedure;
import de.eshg.base.pdf.data.FieldData;
import de.eshg.base.pdf.data.FieldRow;
import de.eshg.base.pdf.data.FieldSet;
import de.eshg.base.util.Salutation;
import de.eshg.file.common.CustomMediaTypes;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class GdprRightToObjectLetterGenerator {
  public static final DateTimeFormatter LOCAL_DATE_DE = DateTimeFormatter.ofPattern("dd.MM.yyyy");
  public static final String TEMPLATE_PATH = "/templates/gdpr/RightToObjectLetter.ftlx";

  private final ClassPathResource templateFile;
  private final DocumentGenerator documentGenerator;
  private final DepartmentController departmentController;
  private final DepartmentConfiguration departmentConfiguration;
  private final FacilityRepository facilityRepository;
  private final PersonRepository personRepository;

  public GdprRightToObjectLetterGenerator(
      @Value(TEMPLATE_PATH) ClassPathResource templateFile,
      DocumentGenerator documentGenerator,
      DepartmentController departmentController,
      DepartmentConfiguration departmentConfiguration,
      FacilityRepository facilityRepository,
      PersonRepository personRepository) {
    this.templateFile = templateFile;
    this.documentGenerator = documentGenerator;
    this.departmentController = departmentController;
    this.departmentConfiguration = departmentConfiguration;
    this.facilityRepository = facilityRepository;
    this.personRepository = personRepository;
  }

  public GdprRightToObjectData buildData(GdprProcedure procedure) {
    return switch (procedure.getIdentificationData()) {
      case GdprPerson gdprPerson -> buildPersonData(procedure, gdprPerson);
      case GdprFacility gdprFacility -> buildFacilityData(procedure, gdprFacility);
      case null ->
          throw new IllegalArgumentException("GdprProcedure has identification data that is null");
      default ->
          throw new IllegalArgumentException(
              "GdprProcedure has identification data with unsupported type "
                  + procedure.getIdentificationData().getClass());
    };
  }

  private GdprRightToObjectData buildPersonData(GdprProcedure procedure, GdprPerson gdprPerson) {
    String entity = mapGdprPersonToString(gdprPerson);
    String entityName = "%s %s".formatted(gdprPerson.getFirstName(), gdprPerson.getLastName());
    UUID centralFileId = procedure.getCentralFileId();

    Optional<List<FieldRow>> dataset =
        personRepository
            .findByExternalIdEqualsAndReferencePersonIsNull(centralFileId)
            .map(this::mapPersonToFields);

    return new GdprRightToObjectData(
        procedure.getCreatedAt().atZone(ZoneId.systemDefault()).format(LOCAL_DATE_DE),
        getDepartmentLogo(),
        departmentController.getDepartmentInfo(),
        entityName,
        entity,
        procedure.getMatterOfConcern(),
        dataset.stream().map(FieldSet::new).toList());
  }

  private GdprRightToObjectData buildFacilityData(
      GdprProcedure procedure, GdprFacility gdprFacility) {
    String entity = mapGdprFacilityToString(gdprFacility);
    String entityName = gdprFacility.getName();
    UUID centralFileId = procedure.getCentralFileId();

    Optional<List<FieldRow>> dataset =
        facilityRepository
            .findByExternalIdEqualsAndReferenceFacilityIsNull(centralFileId)
            .map(this::mapFacilityToFields);

    return new GdprRightToObjectData(
        procedure.getCreatedAt().atZone(ZoneId.systemDefault()).format(LOCAL_DATE_DE),
        getDepartmentLogo(),
        departmentController.getDepartmentInfo(),
        entityName,
        entity,
        procedure.getMatterOfConcern(),
        dataset.stream().map(FieldSet::new).toList());
  }

  private DepartmentLogo getDepartmentLogo() {
    try {
      return new DepartmentLogo(
          CustomMediaTypes.IMAGE_SVG_XML,
          Base64.getEncoder()
              .encodeToString(departmentConfiguration.logo().getContentAsByteArray()));
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  public byte[] generatePdf(GdprProcedure procedure) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    GdprRightToObjectData templateData = buildData(procedure);
    documentGenerator.createPdfFromTemplate(templateFile, templateData, baos);
    return baos.toByteArray();
  }

  private String mapGdprPersonToString(GdprPerson person) {
    StringBuilder sb = new StringBuilder();
    sb.append("%s %s".formatted(person.getFirstName(), person.getLastName())).append("\n");
    sb.append("Geboren am ").append(person.getBirthDetails().dateOfBirth().format(LOCAL_DATE_DE));
    String address = mapAddressToString(person.getContactAddress());
    if (address != null) {
      sb.append("\n").append(address);
    }
    if (person.getEmailAddress() != null) {
      sb.append("\n").append(person.getEmailAddress());
    }
    if (person.getPhoneNumber() != null) {
      sb.append("\n").append(person.getPhoneNumber());
    }
    return sb.toString();
  }

  private String mapGdprFacilityToString(GdprFacility facility) {
    StringBuilder sb = new StringBuilder();
    sb.append(facility.getName());
    String address = mapAddressToString(facility.getContactAddress());
    if (address != null) {
      sb.append("\n").append(address);
    }
    if (facility.getEmailAddress() != null) {
      sb.append("\n").append(facility.getEmailAddress());
    }
    if (facility.getPhoneNumber() != null) {
      sb.append("\n").append(facility.getPhoneNumber());
    }
    return sb.toString();
  }

  private List<FieldRow> mapPersonToFields(Person person) {
    List<FieldRow> fieldRows = new ArrayList<>();
    if (person.getSalutation() != null || person.getTitle() != null) {
      List<FieldData> fields = new ArrayList<>();
      addIfNotNull(fields, "Anrede", mapSalutationToGerman(person.getSalutation()));
      addIfNotNull(fields, "Titel", person.getTitle());
      fieldRows.add(new FieldRow(fields));
    }

    fieldRows.add(
        new FieldRow(
            List.of(
                new FieldData("Vorname", person.getFirstName()),
                new FieldData("Name", person.getLastName()),
                new FieldData(
                    "Geburtstag", person.getBirthDetails().dateOfBirth().format(LOCAL_DATE_DE)))));

    String address = mapAddressToString(person.getContactAddress());
    if (address != null) {
      fieldRows.add(new FieldRow(List.of(new FieldData("Adresse", address))));
    }

    return fieldRows;
  }

  private List<FieldRow> mapFacilityToFields(Facility facility) {
    List<FieldRow> fieldRows = new ArrayList<>();

    fieldRows.add(new FieldRow(List.of(new FieldData("Name", facility.getName()))));

    String address = mapAddressToString(facility.getContactAddress());
    if (address != null) {
      fieldRows.add(new FieldRow(List.of(new FieldData("Adresse", address))));
    }

    return fieldRows;
  }

  private void addIfNotNull(List<FieldData> fieldRows, String label, String value) {
    if (value != null) {
      fieldRows.add(new FieldData(label, value));
    }
  }

  private String mapSalutationToGerman(Salutation salutation) {
    return switch (salutation) {
      case MALE -> "Herr";
      case FEMALE -> "Frau";
      case NEUTRAL -> "Neutral";
      default -> null;
    };
  }

  private String mapAddressToString(Address address) {
    return switch (address) {
      case DomesticAddress domestic ->
          "%s, %s %s"
              .formatted(
                  domestic.getStreet()
                      + (domestic.getHouseNumber() != null ? " " + domestic.getHouseNumber() : ""),
                  domestic.getPostalCode(),
                  domestic.getCity());
      case PostboxAddress postbox ->
          "%s, %s %s".formatted(postbox.getPostbox(), postbox.getPostalCode(), postbox.getCity());
      default -> null;
    };
  }
}
