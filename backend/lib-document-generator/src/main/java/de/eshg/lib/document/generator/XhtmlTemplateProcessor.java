/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.document.generator;

import freemarker.cache.ClassTemplateLoader;
import freemarker.cache.FileTemplateLoader;
import freemarker.cache.TemplateLoader;
import freemarker.core.XHTMLOutputFormat;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.file.Path;
import java.util.Locale;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class XhtmlTemplateProcessor {

  /**
   * Load a FreeMarker template from the classpath and produce XHTML.
   *
   * @param freemarkerTemplateClasspathResource the template classpath resource
   * @param data the data object to be used in the template. Can be a map or a POJO.
   * @return the generated XHTML as string
   * @throws IOException if an I/O error occurs during PDF creation
   * @throws TemplateException if an error occurs during template processing
   */
  public String processXhtmlTemplate(
      ClassPathResource freemarkerTemplateClasspathResource, Object data)
      throws IOException, TemplateException {
    ClassTemplateLoader templateLoader = new ClassTemplateLoader(this.getClass(), "/");
    Template template = loadTemplate(freemarkerTemplateClasspathResource.getPath(), templateLoader);
    return processTemplate(template, data);
  }

  /**
   * Load a FreeMarker template file and produce XHTML.
   *
   * @param freemarkerTemplateFile the template file
   * @param data the data object to be used in the template. Can be a map or a POJO.
   * @return the generated XHTML as string
   * @throws IOException if an I/O error occurs during PDF creation
   * @throws TemplateException if an error occurs during template processing
   */
  public String processXhtmlTemplate(Path freemarkerTemplateFile, Object data)
      throws IOException, TemplateException {
    Path templateDirectory = freemarkerTemplateFile.getParent();
    FileTemplateLoader templateLoader = new FileTemplateLoader(templateDirectory.toFile());
    String templateName = freemarkerTemplateFile.getFileName().toString();
    Template template = loadTemplate(templateName, templateLoader);
    return processTemplate(template, data);
  }

  private Template loadTemplate(String ftlResource, TemplateLoader templateLoader)
      throws IOException {
    Configuration configuration = new Configuration(Configuration.VERSION_2_3_33);
    configuration.setTemplateLoader(templateLoader);
    configuration.setOutputFormat(XHTMLOutputFormat.INSTANCE);
    configuration.setEncoding(Locale.GERMAN, "UTF-8");
    configuration.setDefaultEncoding("UTF-8");

    Template template = configuration.getTemplate(ftlResource);
    template.setTemplateExceptionHandler(TemplateExceptionHandler.HTML_DEBUG_HANDLER);
    return template;
  }

  private String processTemplate(Template template, Object data)
      throws TemplateException, IOException {
    StringWriter sw = new StringWriter();
    template.process(data, sw);
    return sw.toString();
  }
}
