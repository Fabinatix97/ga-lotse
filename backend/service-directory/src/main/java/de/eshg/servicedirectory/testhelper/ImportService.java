/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.testhelper;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.libservicedirectoryadminapi.api.impex.ImportRequest;
import de.eshg.servicedirectory.ServiceDirectoryAdminService;
import de.eshg.servicedirectory.common.exception.ServiceDirectoryBadRequestException;
import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty("eshg.servicedirectory.importfile")
public class ImportService {

  private static final Logger logger = LoggerFactory.getLogger(ImportService.class);

  private final ServiceDirectoryAdminService serviceDirectoryAdminService;

  private final String importFile;

  private final ObjectMapper objectMapper;

  public ImportService(
      ServiceDirectoryAdminService serviceDirectoryAdminService,
      @Value("${eshg.servicedirectory.importfile}") String importFile) {
    this.serviceDirectoryAdminService = serviceDirectoryAdminService;
    this.importFile = importFile;
    objectMapper = new ObjectMapper();
  }

  @PostConstruct
  void automaticImportOnStartup() throws Exception {
    logger.debug("Importing configuration from '{}'", importFile);

    InputStream inputStream = Files.newInputStream(Path.of(importFile));
    ImportRequest importRequest = objectMapper.readValue(inputStream, ImportRequest.class);

    String name = System.getProperty("user.name");
    try (AutoCloseable auth = setUser(name)) {
      logger.debug("Importing as user {}", auth);
      serviceDirectoryAdminService.importIntoEmptyDatabase(importRequest);
    } catch (ServiceDirectoryBadRequestException e) {
      logger.warn("Not importing '{}' because", importFile, e);
    }
    logger.info("Imported configuration from '{}'", importFile);
  }

  // TODO use UserHelper
  private AutoCloseable setUser(String name) {
    SecurityContext context = SecurityContextHolder.getContext();
    Authentication backup = context.getAuthentication();
    Authentication authentication =
        new AbstractAuthenticationToken(null) {
          @Override
          public Object getCredentials() {
            return null;
          }

          @Override
          public Object getPrincipal() {
            return name;
          }
        };
    context.setAuthentication(authentication);

    return new AutoCloseable() {
      @Override
      public void close() {
        context.setAuthentication(backup);
      }

      @Override
      public String toString() {
        return name;
      }
    };
  }
}
