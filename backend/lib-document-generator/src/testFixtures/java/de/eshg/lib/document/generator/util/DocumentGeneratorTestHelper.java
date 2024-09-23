/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.document.generator.util;

import de.cronn.commons.lang.Action;
import de.eshg.lib.document.generator.DocumentGenerator;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class DocumentGeneratorTestHelper {
  private static final Logger log = LoggerFactory.getLogger(DocumentGeneratorTestHelper.class);

  private final DocumentGenerator documentGenerator;

  public DocumentGeneratorTestHelper(DocumentGenerator documentGenerator) {
    this.documentGenerator = documentGenerator;
  }

  /**
   * Creates a PDF file from a Freemarker template in memory and returns the PDF content as byte
   * array.
   */
  public byte[] create(ClassPathResource freemarkerTemplateClasspathResource, Object templateData)
      throws Exception {
    try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
      documentGenerator.createPdfFromTemplate(
          freemarkerTemplateClasspathResource, templateData, os);
      return os.toByteArray();
    }
  }

  public Path createAndValidatePdfAConformance(
      String freemarkerTemplate, Object templateData, String testName) throws Exception {
    Path tempPdfFile = getTempFile(testName);
    try (OutputStream os = Files.newOutputStream(tempPdfFile)) {
      documentGenerator.createPdfFromTemplate(
          new ClassPathResource(freemarkerTemplate), templateData, os);
    }
    validatePdfAConformance(tempPdfFile);
    return tempPdfFile;
  }

  /**
   * Creates a PDF file from a Freemarker template in memory, validates it for PDF/A conformance and
   * returns the text of the content as string.
   */
  public String createAndReturnText(String freemarkerTemplate, Object data, String testName)
      throws Exception {
    Path tempPdfFile = createAndValidatePdfAConformance(freemarkerTemplate, data, testName);
    return extractText(tempPdfFile);
  }

  /**
   * Creates a PDF file from a Freemarker template, validates it for PDF/A conformance and opens it
   * with the associated default application (which should be a previewer). After that the method
   * watches the directory containing the source template for changes. On any change the PDF is
   * recreated. (Most previewers reload the PDF on changes.)
   *
   * <p>If the method fails to open the associated default application for the PDF file, or if your
   * default PDF previewer doesn't support automatic reload (e.g. the AcrobatReader on Windows),
   * then you can specify a different application by setting an environment variable {@code
   * PDF_OPEN_WITH="<path-to-executable>"}.
   *
   * <p><b>Note:</b> This method never returns! So don't use it in standard unit tests that run in a
   * CI pipeline.<br>
   * Instead, use this method to create a unit test which allows you to test your document
   * <i>interactively</i>. Example:
   *
   * <pre>
   * &#064;Autowired private final DocumentGeneratorTestHelper documentGeneratorTestHelper;
   *
   * &#064;Test
   * &#064;Disabled("only for interactive use")
   * void testInteractive() {
   *   Object templateData = ...;
   *   documentGeneratorTestHelper.createAndWatch("/path/to/report.ftlx", data);
   * }
   * </pre>
   *
   * <p>Once you start this test, the previewer opens, and you can edit and preview the document
   * side-by-side.
   */
  public void createAndWatch(String freemarkerTemplate, Object templateData, String testName)
      throws Exception {
    // Try to find the real source file of the template resource given.
    // We need the source file to set a watcher on it. If we don't find it we cannot continue and
    // bail out with exception.
    Path srcFile = Path.of("src/main/resources", freemarkerTemplate);

    // create a real PDF file as output target
    Path tempPdfFile = getTempFile(testName);

    // create the PDF
    Action action = () -> createPdf(srcFile, templateData, tempPdfFile);
    action.execute();

    // open the created PDF file with the associated default application
    DesktopUtil.openWithDefaultApplication(tempPdfFile.toFile());

    // watch the directory of the source file and recreate the PDF on any change
    watchTemplateAndRun(srcFile, action);
  }

  /** Extract the text from a PDF file */
  public static String extractText(byte[] pdfBytes) {
    try (PDDocument document = Loader.loadPDF(pdfBytes)) {
      return extractText(document);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  /** Extract the text from a PDF file */
  public static String extractText(Path pdfFile) throws IOException {
    try (PDDocument document = Loader.loadPDF(pdfFile.toFile())) {
      return extractText(document);
    }
  }

  private void createPdf(Path freemarkerTemplateFile, Object data, Path tempPdfFile)
      throws IOException {
    try (OutputStream os = Files.newOutputStream(tempPdfFile)) {
      documentGenerator.createPdfFromFile(freemarkerTemplateFile, data, os);
      log.info("Created pdf from template '{}': {}", freemarkerTemplateFile, tempPdfFile);
    }
    validatePdfAConformance(tempPdfFile);
  }

  private void watchTemplateAndRun(Path srcFile, Action action) throws IOException {
    Path dir = srcFile.getParent();
    log.info("Watching template '{}' in dir {} ...", srcFile.getFileName(), dir);
    DirWatcher dirWatcher = new DirWatcher();
    dirWatcher.watchDir(dir, action);
  }

  private static Path getTempFile(String testName) throws IOException {
    Path tempFile = Path.of("data/test/tmp", testName + ".pdf");
    Files.createDirectories(tempFile.getParent());
    return tempFile;
  }

  private static void validatePdfAConformance(Path pdfFile) throws IOException {
    try (InputStream is = Files.newInputStream(pdfFile)) {
      PdfAConformanceValidator.validate(is);
      log.info("PDF/A conformance ok.");
    }
  }

  private static String extractText(PDDocument document) throws IOException {
    PDFTextStripper stripper = new PDFTextStripper();
    stripper.setSortByPosition(true);
    stripper.setLineSeparator("\n");
    stripper.setPageEnd("\n=======================================\n");
    return stripper.getText(document);
  }
}
