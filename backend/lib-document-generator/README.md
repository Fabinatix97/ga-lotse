# lib-document-generator: Document generation library

The **lib-document-generator** library provides implementations to create PDF documents from XHTML templates.

This is done with the help of **[OPEN HTML TO PDF](https://github.com/openhtmltopdf/openhtmltopdf)**,
**[Apache PDFBox](https://pdfbox.apache.org/)** and **[Apache FreeMarker](https://freemarker.apache.org/)**:

* **Apache FreeMarker** is used to create XHTML documents from templates with data.
* **OPEN HTML TO PDF** creates PDF from XHTML documents.
* **Apache PDFBox** is used by **OPEN HTML TO PDF** to actually create the PDF file.

## Quick start

Use **lib-document-generator** in your business module:

```groovy
implementation project(':lib-document-generator')

testImplementation testFixtures(project(':lib-document-generator'))
```

This adds the `ReportBuilder` component which you can inject into your business code to create PDF reports. The test
fixture also adds the `DocumentGeneratorTestHelper` which helps during development and testing, see sections "Development" and
"Testing" below.

To produce a report create an [Apache FreeMarker](https://freemarker.apache.org/) template file which produces a XHTML
document. FreeMarker template files usually have the file suffix `*.ftl`, but we're using the valid alternative
`*.ftlx` to indicate that we're producing XHTML, not HTML or plain text.

The most simple form of a FreeMarker XHTML file is:

```xhtml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xml:lang="de" lang="de">
<body>
Hello world!
</body>
</html>
```

Save this template file somewhere below your `src/main/resources` folder so that it can be accessed from the classpath;
e.g. in `src/main/resources/de/eshg/templates/document-template.ftlx`. After that you can use this template with `DocumentGenerator` to
create a PDF output stream:

```java
@Value("/de/eshg/templates/document-template.ftlx") ClassPathResource documentTemplate;
@Autowired private DocumentGenerator documentGenerator;

public void createMyDocument() {
    OutputStream outputStream = ... ; // get outputStream to write PDF data to
    Object templateData = ...; // see section "Template Data" below
    documentGenerator.createPdfFromTemplate(documentTemplate, templateData, outputStream);
}
```


## Custom CSS

Since the template is standard XHTML you can (and surely want to) add CSS:

```xhtml
<head>
  <link rel="stylesheet" type="text/css" href="document-template.css"/>
</head>
```

By default, the CSS is expected in the same resource folder, but you can reference other (shared) CSS resources
available on the classpath, too:

```xhtml
<head>
  <link rel="stylesheet" type="text/css" href="/de/eshg/templates/common/common.css"/>
</head>
```

Note that **OPEN HTML TO PDF** fully supports CSS 2.1 and some directives of CSS 3.0. See the
[Getting Started Guide](https://github.com/openhtmltopdf/openhtmltopdf?tab=readme-ov-file#getting-started).


## Template Data

The template needs dynamic data, and this can be achieved with FreeMarker directives:
```injectedfreemarker
<body>
  <#if user.name>
    <p>My name is: ${user.name}</p>
  <#else>
    <p>My name is unknown</p>
  </#if>
</body>
```

First you need to create a **data model**, see [Create a data-model](https://freemarker.apache.org/docs/pgui_quickstart_createdatamodel.html).

```java
public record User(String name) {
}

public record TemplateData(User user) {
}

public void createPdf() {
  TemplateData data = new TemplateData(new User("Elon"));
  // inside the template you can access 'user.name', since 'user' is a sub-bean of data
  documentGenerator.createPdfFromTemplate(new ClassPathResource("/path/to/document-template.ftlx"), data, outputSteam);
}
```

Make yourself familiar with the full features of the FreeMarker data model:
https://freemarker.apache.org/docs/pgui_datamodel.html


## Development

During development of a document you'll start with a test. **lib-document-generator** adds `DocumentGeneratorTestHelper` that makes
interactive development of a report easier.

```java
@Autowired private DocumentGeneratorTestHelper documentGeneratorTestHelper;

@Test
@EnabledIfEnvironmentVariable(named = "DEVELOP_DOCUMENTS", matches = "true")
void testInteractive() throws Exception {
  Object data = createTestData();
  documentGeneratorTestHelper.createAndWatch("path/to/document-template.ftlx", data);
}
```

The `createAndWatch()` method
1. compiles the template,
2. checks it for errors (if errors exists the method exits),
3. creates the resulting XHTML with the given data,
4. produces the PDF,
5. writes it to a temporary file and
6. opens it with the system default PDF viewer of your operating system.

Then the method watches the source folder of the report file for changes. If any file is changed in this folder, the
method re-creates the PDF. Ideally, your PDF viewer should detect this change and reload the file automatically.\
For **Linux**, the default PDF viewers of Linux GNOME (_Evince_) and Linux KDE (_Okular_) reload automatically.\
For **Windows**, the AcrobatReader does _NOT_ do this, unfortunately, so you'll have to install a different PDF
previewer, e.g. [Sumatra PDF](https://www.sumatrapdfreader.org/free-pdf-reader). Either set this PDF previewer as the
default application for PDF's, or (if you hesitate to do this), set the environment variable
`PDF_OPEN_WITH=<full-path-to-application.exe>`.\
For **macOS** the situation is currently unknown.

Using this method `createAndWatch()` you can develop your report easily and display the IDE and the PDF previewer
side-by-side. Changes to the template file (or the included CSS) cause the report to be re-generated almost instantly
(around 1-3 seconds).

Note: The method `createAndWatch()` never exits; you have to stop it manually. It's for development purposes only.
Therefore, to avoid that the GitLab pipeline runs into an endless loop, you should protect the test from being started
by adding `@EnabledIfEnvironmentVariable(named = "DEVELOP_DOCUMENTS", matches = "true")` to it as in the example above.
In IntelliJ, create a run configuration for this test and set the environment variable `DEVELOP_DOCUMENTS=true`.

Also note that this only works for changes to your template `*.ftlx` file and linked resources such as CSS and images
residing _in the same folder_! This doesn't work for changes to your Java Bean structure (as the JVM cannot pick up
structure changes)!


## Testing

`DocumentGeneratorTestHelper` also contains a method `createAndReturnText()` to extract the plain text from the generated PDF
report, which can be used in a classic unit test to check with a validation file:

```java
@Test
void testReportText() throws Exception {
  Object data = createTestData();
  String textContent = documentGeneratorTestHelper.createAndReturnText("path/to/document-template.ftlx", data);
  assertWithFile(textContent);
}
```

This test can run in the GitLab pipeline.
