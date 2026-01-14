/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.document.generator;

import freemarker.template.TemplateException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.nio.file.Path;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/**
 * A PDF document generator that creates PDF files from XHTML files with FreeMarker template
 * directives. Uses <a href="https://github.com/openhtmltopdf/openhtmltopdf">OPEN HTML TO PDF</a>,
 * <a href="https://pdfbox.apache.org/">Apache PDFBox</a> and <a
 * href="https://freemarker.apache.org/">Apache FreeMarker</a>.
 *
 * @see <a href="https://freemarker.apache.org/docs/index.html">FreeMarker Manual</a>
 */
@Component
public class DocumentGenerator {

  private final XhtmlTemplateProcessor templateProcessor;
  private final PdfCreator pdfCreator;

  public DocumentGenerator(XhtmlTemplateProcessor templateProcessor, PdfCreator pdfCreator) {
    this.templateProcessor = templateProcessor;
    this.pdfCreator = pdfCreator;
  }

  /**
   * Creates a PDF file from a Freemarker XHTML template in memory and writes it to an outputStream.
   *
   * @param freemarkerTemplateClasspathResource the classpath resource of the Freemarker XHTML
   *     template
   * @param templateData the data object to be used inside the Freemarker template. This could be
   *     any Java collection (including {@code Map}) or any POJO. See <a
   *     href="https://freemarker.apache.org/docs/pgui_datamodel_basics.html">FreeMarker data model
   *     basics</a>.
   * @param outputStream the output stream to write the PDF data to
   */
  public void createPdfFromTemplate(
      ClassPathResource freemarkerTemplateClasspathResource,
      Object templateData,
      OutputStream outputStream) {
    try {
      String xhtml =
          templateProcessor.processXhtmlTemplate(freemarkerTemplateClasspathResource, templateData);
      URI baseDocumentUri = determineBaseUrl(freemarkerTemplateClasspathResource);
      pdfCreator.writePdf(xhtml, outputStream, baseDocumentUri);
    } catch (IOException | TemplateException e) {
      throw new RuntimeException("Failed to create PDF from template", e);
    }
  }

  /**
   * <b>ONLY TO BE USED IN TESTS:</b> Creates a PDF file from a Freemarker XHTML template file in
   * memory and writes it to an outputStream.
   *
   * <p>In opposite to {@link #createPdfFromTemplate(ClassPathResource, Object, OutputStream)} this
   * method works with <i>files</i>, not with <i>classpath resources</i>. It should not be used in
   * production.
   *
   * @param freemarkerTemplateFile a Freemarker XHTML template source file
   * @param data the data object to be used inside the Freemarker template. This could be any Java
   *     collection (including {@code Map}) or any POJO. See <a
   *     href="https://freemarker.apache.org/docs/pgui_datamodel_basics.html">FreeMarker data model
   *     basics</a>.
   * @param outputStream the output stream to write the PDF data to
   */
  public void createPdfFromFile(
      Path freemarkerTemplateFile, Object data, OutputStream outputStream) {
    try {
      String xhtml = templateProcessor.processXhtmlTemplate(freemarkerTemplateFile, data);
      URI baseURI = freemarkerTemplateFile.toUri();
      pdfCreator.writePdf(xhtml, outputStream, baseURI);
    } catch (IOException | TemplateException e) {
      throw new RuntimeException(e);
    }
  }

  private static URI determineBaseUrl(ClassPathResource classPathResource) throws IOException {
    return classPathResource.getFile().toPath().getParent().toUri();
  }
}
