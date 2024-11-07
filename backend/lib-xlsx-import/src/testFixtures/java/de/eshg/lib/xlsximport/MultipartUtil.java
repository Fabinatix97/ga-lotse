/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import static de.eshg.file.common.CustomMediaTypes.APPLICATION_XLSX_VALUE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import jakarta.mail.BodyPart;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;
import java.nio.file.Path;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

public class MultipartUtil {

  private MultipartUtil() {}

  public static MultiValueMap<String, Object> toMultipartFormDataRequest(Path filePath) {
    return toMultipartFormDataRequest(new FileSystemResource(filePath));
  }

  public static MultiValueMap<String, Object> toMultipartFormDataRequest(String classPathResource) {
    return toMultipartFormDataRequest(new ClassPathResource(classPathResource));
  }

  public static MultiValueMap<String, Object> toMultipartFormDataRequest(Resource resource) {
    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
    body.add("file", resource);
    return body;
  }

  public static ImportResponse parseImportResponseFromBody(ResponseEntity<byte[]> response)
      throws Exception {
    ByteArrayDataSource datasource =
        new ByteArrayDataSource(response.getBody(), MULTIPART_FORM_DATA_VALUE);
    MimeMultipart multipart = new MimeMultipart(datasource);

    assertThat(multipart.getCount()).isEqualTo(2);
    return new ImportResponse(response, getStatistics(multipart), getFile(multipart));
  }

  private static String getStatistics(MimeMultipart multipart) throws Exception {
    BodyPart part = multipart.getBodyPart(0);
    assertThat(part.getContentType()).isEqualTo(APPLICATION_JSON_VALUE);

    return new String(part.getInputStream().readAllBytes());
  }

  private static Resource getFile(MimeMultipart multipart) throws Exception {
    BodyPart part = multipart.getBodyPart(1);
    assertThat(part.getContentType()).isEqualTo(APPLICATION_XLSX_VALUE);
    String fileName = part.getFileName();

    return new ByteArrayResource(part.getInputStream().readAllBytes()) {
      @Override
      public String getFilename() {
        return fileName;
      }
    };
  }
}
