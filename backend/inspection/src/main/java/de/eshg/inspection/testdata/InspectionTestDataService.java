/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testdata;

import static java.nio.charset.StandardCharsets.UTF_8;

import de.eshg.rest.service.error.NotFoundException;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class InspectionTestDataService {

  public ResponseEntity<Resource> downloadOsmTestData(String filename) throws IOException {
    String ressource = "/de/eshg/inspection/facility/websearch/" + filename;
    try (InputStream inputStream = getClass().getResourceAsStream(ressource)) {
      if (inputStream == null) throw new NotFoundException("ressource not found");
      ContentDisposition contentDisposition =
          ContentDisposition.attachment().filename(filename, UTF_8).build();
      ByteArrayResource resource = new ByteArrayResource(inputStream.readAllBytes());
      return ResponseEntity.ok()
          .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
          .body(resource);
    }
  }
}
