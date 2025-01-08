/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.document.generator;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder.PdfAConformance;
import com.openhtmltopdf.slf4j.Slf4jLogger;
import com.openhtmltopdf.svgsupport.BatikSVGDrawer;
import com.openhtmltopdf.util.XRLog;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

/**
 * Creates PDF documents from XHTML documents using <a
 * href="https://github.com/openhtmltopdf/openhtmltopdf">OPEN HTML TO PDF</a>.
 */
@Component
public class PdfCreator {

  private static final Logger log = LoggerFactory.getLogger(PdfCreator.class);

  private final Resource sansSerifFont;
  private final Resource serifFont;
  private final Resource monospacedFont;
  private final Resource colorProfile;

  public PdfCreator(
      @Value("classpath:/de/eshg/lib/document/generator/DejaVuSansCondensed.ttf")
          Resource sansSerifFont,
      @Value("classpath:/de/eshg/lib/document/generator/DejaVuSerifCondensed.ttf")
          Resource serifFont,
      @Value("classpath:/de/eshg/lib/document/generator/DejaVuSansMono.ttf")
          Resource monospacedFont,
      @Value("classpath:/de/eshg/lib/document/generator/sRGB.icc") Resource colorProfile) {
    Assert.isTrue(sansSerifFont.exists(), sansSerifFont + " does not exist");
    Assert.isTrue(serifFont.exists(), serifFont + " does not exist");
    Assert.isTrue(serifFont.exists(), serifFont + " does not exist");
    Assert.isTrue(colorProfile.exists(), colorProfile + " does not exist");
    this.sansSerifFont = sansSerifFont;
    this.serifFont = serifFont;
    this.monospacedFont = monospacedFont;
    this.colorProfile = colorProfile;
    // See https://github.com/danfickle/openhtmltopdf/wiki/Logging
    XRLog.setLoggerImpl(new Slf4jLogger());
  }

  public void writePdf(String xhtml, OutputStream os, URI baseDocumentUri) throws IOException {
    writeXhtmlToTempFile(xhtml); // just for development purposes
    createPdfRenderer().withHtmlContent(xhtml, baseDocumentUri.toString()).toStream(os).run();
  }

  private PdfRendererBuilder createPdfRenderer() throws IOException {
    PdfRendererBuilder pdfRendererBuilder = new PdfRendererBuilder();
    // PDF/A-3a: long-term archiving, accessibility, full unicode support
    pdfRendererBuilder.usePdfAConformance(PdfAConformance.PDFA_3_A);
    // color profile is needed for PDF/A compatibility
    pdfRendererBuilder.useColorProfile(loadDefaultColorProfile());
    pdfRendererBuilder.useSVGDrawer(new BatikSVGDrawer());
    // we use the DejaVuSans Condensed font per default because it comes with a rich set of symbols
    // note: the font-family names are the PDF font family names, not CSS family names!
    pdfRendererBuilder.useFont(() -> getFontInputStream(sansSerifFont), "SansSerif");
    pdfRendererBuilder.useFont(() -> getFontInputStream(serifFont), "Serif");
    pdfRendererBuilder.useFont(() -> getFontInputStream(monospacedFont), "Monospaced");
    PDDocument pdDocument = new PDDocument();
    pdDocument.getDocument().setHasHybridXRef();
    pdfRendererBuilder.usePDDocument(pdDocument);
    return pdfRendererBuilder;
  }

  private static void writeXhtmlToTempFile(String xhtml) {
    if (!"true".equals(System.getenv("DEVELOP_DOCUMENTS"))) return;
    try {
      Path tempFile = Files.createTempFile("document", ".html");
      tempFile.toFile().deleteOnExit();
      Files.writeString(tempFile, xhtml);
      log.info("wrote XHTML to: {}", tempFile);
    } catch (IOException ex) {
      log.error("Failed to write XHTML", ex);
    }
  }

  private byte[] loadDefaultColorProfile() throws IOException {
    // load default RGB color profile; needed for PDF/A compatibility
    // see https://github.com/danfickle/openhtmltopdf/wiki/PDF-A-Standards-Compliance for details
    return colorProfile.getContentAsByteArray();
  }

  private static InputStream getFontInputStream(Resource resource) {
    try {
      return resource.getInputStream();
    } catch (IOException e) {
      throw new RuntimeException("Failed to load font resource", e);
    }
  }
}
