/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.file.common.CustomMediaTypes;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@RestController
@HttpExchange(BaseUrls.Statistics.DATA_EXPORT_CONTROLLER)
@Tag(name = "DataExport")
public class DataExportController {
  static final String DIAGRAM_EXPORT_FILENAME = "diagramm-daten-export.xlsx";
  private final DataExportService dataExportService;

  public DataExportController(DataExportService dataExportService) {
    this.dataExportService = dataExportService;
  }

  @GetExchange(value = "/diagram/{diagramId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Exported diagram data")
  @Operation(summary = "Export diagram data")
  public ResponseEntity<Resource> exportData(@PathVariable(name = "diagramId") UUID diagramId) {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment().filename(DIAGRAM_EXPORT_FILENAME).build().toString())
        .header(HttpHeaders.CONTENT_TYPE, CustomMediaTypes.APPLICATION_XLSX_VALUE)
        .body(dataExportService.exportData(diagramId));
  }
}
