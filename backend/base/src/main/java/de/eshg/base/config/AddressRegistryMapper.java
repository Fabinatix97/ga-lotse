/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.api.GetAddressDirectoryConfigResponse;
import de.eshg.config.api.DocumentDetailsDto;
import de.eshg.config.domain.Document;

public class AddressRegistryMapper {

  private AddressRegistryMapper() {}

  public static final String STREET_DIRECTORY_ROOT = "Straßenverzeichnis";
  public static final String MUNICIPALITY_DIRECTORY_ROOT = "Gemeindeverzeichnis";
  public static final String STREET_DIRECTORY_FILENAME = STREET_DIRECTORY_ROOT + ".csv";
  public static final String MUNICIPALITY_DIRECTORY_FILENAME = MUNICIPALITY_DIRECTORY_ROOT + ".csv";

  public static GetAddressDirectoryConfigResponse mapToDto(DepartmentConfiguration configuration) {
    if (configuration.isStreetAndMunicipalityDirectoriesInitialized()) {
      return new GetAddressDirectoryConfigResponse(
          mapToDocumentDetailsDto(STREET_DIRECTORY_FILENAME, configuration.getStreetDirectory()),
          mapToDocumentDetailsDto(
              MUNICIPALITY_DIRECTORY_FILENAME, configuration.getMunicipalityDirectory()));
    } else {
      return new GetAddressDirectoryConfigResponse(null, null);
    }
  }

  public static Document mapToDocument(byte[] content) {
    Document document = new Document();
    document.setContent(content);
    return document;
  }

  private static DocumentDetailsDto mapToDocumentDetailsDto(String filename, Document document) {
    return new DocumentDetailsDto(filename, document.getContent().length);
  }
}
