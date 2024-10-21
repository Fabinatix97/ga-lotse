/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport.util;

import de.eshg.file.common.CustomMediaTypes;
import de.eshg.lib.xlsximport.model.ImportResult;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

public class FileResponseUtil {

  private FileResponseUtil() {}

  public static ResponseEntity<MultiValueMap<String, Object>> mapImportResultToMultipartResponse(
      ImportResult result, String filename) {
    MultiValueMap<String, Object> multipart = new LinkedMultiValueMap<>();

    HttpHeaders statisticsHeaders = new HttpHeaders();
    statisticsHeaders.setContentType(MediaType.APPLICATION_JSON);
    multipart.add("statistics", new HttpEntity<>(result.statistics(), statisticsHeaders));

    HttpHeaders fileHeaders = new HttpHeaders();
    fileHeaders.setContentType(CustomMediaTypes.APPLICATION_XLSX);
    fileHeaders.setContentDisposition(fileFormData(filename));
    multipart.add("file", new HttpEntity<>(result.file(), fileHeaders));

    return ResponseEntity.ok().contentType(MediaType.MULTIPART_FORM_DATA).body(multipart);
  }

  public static ResponseEntity<Resource> getTemplateFileResponse(Resource templateFile) {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION, fileAttachment(templateFile.getFilename()).toString())
        .header(HttpHeaders.CONTENT_TYPE, CustomMediaTypes.APPLICATION_XLSX_VALUE)
        .body(templateFile);
  }

  private static ContentDisposition fileFormData(String filename) {
    return file(filename, ContentDisposition.formData());
  }

  private static ContentDisposition fileAttachment(String filename) {
    return file(filename, ContentDisposition.attachment());
  }

  private static ContentDisposition file(String filename, ContentDisposition.Builder builder) {
    return builder.name("file").filename(filename).build();
  }
}
