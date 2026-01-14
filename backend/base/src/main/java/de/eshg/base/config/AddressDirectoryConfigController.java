/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.base.config.AddressDirectoryConfigController.BASE_URL;
import static de.eshg.base.config.AddressDirectoryService.getMunicipalityRegistryTemplate;
import static de.eshg.base.config.AddressDirectoryService.getStreetRegistryTemplate;
import static de.eshg.base.config.AddressRegistryMapper.MUNICIPALITY_DIRECTORY_FILENAME;
import static de.eshg.base.config.AddressRegistryMapper.MUNICIPALITY_DIRECTORY_ROOT;
import static de.eshg.base.config.AddressRegistryMapper.STREET_DIRECTORY_FILENAME;
import static de.eshg.base.config.AddressRegistryMapper.STREET_DIRECTORY_ROOT;
import static de.eshg.base.config.AddressRegistryMapper.mapToDocument;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.base.config.api.GetAddressDirectoryConfigResponse;
import de.eshg.base.street.csv.CsvMapper;
import de.eshg.base.street.csv.StreetDirectoryCsvEntry;
import de.eshg.base.street.csv.opencsv.BeansToCsvMapper;
import de.eshg.file.common.CustomMediaTypes;
import de.eshg.file.common.FileValidator;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.apache.commons.io.input.BOMInputStream;
import org.apache.coyote.BadRequestException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(BASE_URL)
@Tag(name = "AddressDirectoryConfig")
public class AddressDirectoryConfigController {

  public static final String BASE_URL =
      BaseUrls.DepartmentInfoLibrary.CONFIGURATION_API + "/address-directory";
  public static final String STREET_DIRECTORY_TEMPLATE_PATH = "/street-template";
  public static final String MUNICIPALITY_DIRECTORY_TEMPLATE_PATH = "/municipality-template";
  public static final String STREET_DIRECTORY_FILE_PATH = "/street-directory";
  public static final String MUNICIPALITY_DIRECTORY_FILE_PATH = "/municipality-directory";
  public static final String REQUEST_PART_STREET_DIRECTORY = "street-directory";
  public static final String REQUEST_PART_MUNICIPALITY_DIRECTORY = "municipality-directory";
  private static final String TEMPLATE_FILENAME_SUFFIX = "_template.csv";

  private final DepartmentConfigurationService departmentConfigurationService;
  private final BaseConfigurationProperties baseConfigurationProperties;
  private final AddressDirectoryService addressDirectoryService;

  public AddressDirectoryConfigController(
      DepartmentConfigurationService departmentConfigurationService,
      BaseConfigurationProperties baseConfigurationProperties,
      AddressDirectoryService addressDirectoryService) {
    this.departmentConfigurationService = departmentConfigurationService;
    this.baseConfigurationProperties = baseConfigurationProperties;
    this.addressDirectoryService = addressDirectoryService;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetAddressDirectoryConfigResponse getAddressRegistryConfig() {
    return AddressRegistryMapper.mapToDto(departmentConfigurationService.getConfig());
  }

  @GetMapping(STREET_DIRECTORY_TEMPLATE_PATH)
  public ResponseEntity<Resource> getStreetDirectoryTemplate() {
    return fileResponse(
        STREET_DIRECTORY_ROOT + TEMPLATE_FILENAME_SUFFIX, getStreetRegistryTemplate());
  }

  @GetMapping(MUNICIPALITY_DIRECTORY_TEMPLATE_PATH)
  public ResponseEntity<Resource> getMunicipalityDirectoryTemplate() {
    return fileResponse(
        MUNICIPALITY_DIRECTORY_ROOT + TEMPLATE_FILENAME_SUFFIX, getMunicipalityRegistryTemplate());
  }

  @GetMapping(STREET_DIRECTORY_FILE_PATH)
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getStreetDirectoryFile() {
    DepartmentConfiguration config = departmentConfigurationService.getConfig();
    if (!config.isStreetAndMunicipalityDirectoriesInitialized()) {
      throw new NotFoundException("Street directory not initialized");
    }
    return fileResponse(STREET_DIRECTORY_FILENAME, migrateStreetDirectoryFile(config));
  }

  @GetMapping(MUNICIPALITY_DIRECTORY_FILE_PATH)
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getMunicipalityDirectoryFile() {
    DepartmentConfiguration config = departmentConfigurationService.getConfig();
    if (!config.isStreetAndMunicipalityDirectoriesInitialized()) {
      throw new NotFoundException("Municipality directory not initialized");
    }
    return fileResponse(
        MUNICIPALITY_DIRECTORY_FILENAME, config.getMunicipalityDirectory().getContent());
  }

  @PutMapping(consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updateAddressRegistryConfig(
      @RequestPart(REQUEST_PART_STREET_DIRECTORY) MultipartFile streetDirectory,
      @RequestPart(REQUEST_PART_MUNICIPALITY_DIRECTORY) MultipartFile municipalityDirectory)
      throws IOException {
    departmentConfigurationService.updateStreetAndMunicipalityDirectory(
        mapToDocument(addressDirectoryService.validateStreetRegistry(readFile(streetDirectory))),
        mapToDocument(
            addressDirectoryService.validateMunicipalityRegistry(readFile(municipalityDirectory))));
    addressDirectoryService.refresh();
  }

  private byte[] readFile(MultipartFile csvFile) throws IOException {
    if (csvFile.getSize() > baseConfigurationProperties.maxCsvFileSizeBytes()) {
      throw new BadRequestException("File too large");
    }
    FileValidator.validateCsvFile(csvFile);
    try (BOMInputStream bomInputStream =
        BOMInputStream.builder().setInputStream(csvFile.getInputStream()).get()) {
      return bomInputStream.readAllBytes();
    }
  }

  private ResponseEntity<Resource> fileResponse(String filename, String content) {
    return fileResponse(filename, content.getBytes(StandardCharsets.UTF_8));
  }

  private ResponseEntity<Resource> fileResponse(String filename, byte[] content) {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(filename, StandardCharsets.UTF_8)
                .build()
                .toString())
        .contentType(CustomMediaTypes.CSV)
        .body(new ByteArrayResource(content));
  }

  private static byte[] migrateStreetDirectoryFile(DepartmentConfiguration config) {
    List<StreetDirectoryCsvEntry> streetDirectoryCsvEntries =
        CsvMapper.csvToBeans(
            config.getStreetDirectory().getContent(), StreetDirectoryCsvEntry.class);
    return BeansToCsvMapper.beansToCsv(streetDirectoryCsvEntries, StreetDirectoryCsvEntry.class)
        .getBytes();
  }
}
