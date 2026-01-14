// Copyright 2026 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg

import groovy.xml.XmlParser
import org.gradle.api.DefaultTask
import org.gradle.api.file.DirectoryProperty
import org.gradle.api.tasks.OutputDirectory
import org.gradle.api.tasks.TaskAction

abstract class AggregateJunitTestReportsTask extends DefaultTask {
  @OutputDirectory
  abstract DirectoryProperty getReportDir()

  @TaskAction
  void generate() {
    def reportDir = getReportDir().get().asFile
    reportDir.mkdirs()

    def testReports = []

    project.subprojects.each { subproject ->
      def htmlReportPath = subproject.layout.buildDirectory
        .file('reports/tests/test/index.html').get().asFile
      def xmlReportDir = subproject.layout.buildDirectory
        .dir('test-results/test').get().asFile

      if (htmlReportPath.exists()) {
        def hasFailed = hasFailedTests(xmlReportDir)

        def relPath = reportDir.toPath()
          .relativize(htmlReportPath.toPath())
          .toString()
          .replace(File.separator, '/')

        testReports << [
          name     : subproject.name,
          relPath  : relPath,
          hasFailed: hasFailed
        ]
      }
    }

    if (testReports.isEmpty()) {
      logger.warn('No JUnit HTML reports found')
      return
    }

    def htmlReport = new File(reportDir, 'index.html')
    htmlReport.text = generateHtmlReport(testReports)

    logger.lifecycle("Aggregated test report: file://${htmlReport.absolutePath}")
  }

  static boolean hasFailedTests(File xmlReportDir) {
    if (!xmlReportDir.exists()) return false

    return xmlReportDir.listFiles()?.any { file ->
      if (!file.name.endsWith('.xml')) return false

      try {
        def xml = new XmlParser().parse(file)
        def failures = (xml.'@failures' as Integer) ?: 0
        def errors = (xml.'@errors' as Integer) ?: 0
        return failures > 0 || errors > 0
      } catch (e) {
        return false
      }
    } ?: false
  }

  static String generateHtmlReport(List<Map> testReports) {
    def failedReports = testReports.findAll { it.hasFailed }
    def passedReports = testReports.findAll { !it.hasFailed }

    return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Aggregated JUnit Test Reports</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
                h1 { color: #333; }
                h2 { color: #666; font-size: 16px; margin-top: 25px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
                .container { max-width: 900px; margin: 0 auto; background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .report-card {
                    margin: 12px 0;
                    padding: 15px;
                    border-left: 5px solid #4CAF50;
                    background: #fafafa;
                }
                .report-card.failed {
                    border-left-color: #f44336;
                    background: #ffebee;
                }
                .report-card:hover {
                    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
                    text-decoration: none;
                }
                .report-card a {
                    color: #2196F3;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 16px;
                }
                .report-card a:hover { text-decoration: underline; }
                .badge {
                    display: inline-block;
                    padding: 3px 8px;
                    border-radius: 3px;
                    font-size: 11px;
                    font-weight: bold;
                    margin-left: 10px;
                    margin-right: 10px;
                    vertical-align: bottom;
                }
                .badge.failed { background: #f44336; color: white; }
                .badge.passed { background: #4CAF50; color: white; }
                .summary {
                    padding: 15px;
                    background: #e8f5e9;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    border-left: 4px solid #4CAF50;
                }
                .summary.warning {
                    background: #fff3e0;
                    border-left-color: #ff9800;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📊 Aggregated Test Reports</h1>
                <p>Generated: ${new Date().format('yyyy-MM-dd HH:mm:ss')}</p>

                <div class="summary${failedReports ? ' warning' : ''}">
                    <strong>Total Subprojects:</strong> ${testReports.size()} |
                    <strong>Passed:</strong> ${passedReports.size()} |
                    <strong>Failed:</strong> ${failedReports.size()}
                </div>

                ${failedReports ? """
                <h2>⚠️ Failed Tests</h2>
                ${failedReports.collect { report ->
      """<div class="report-card failed">
                        <span class="badge failed">FAILED</span>
                        <a href="${report.relPath}">${report.name} Test Report</a>
                    </div>"""
    }.join('\n')}
                """ : ''}

                <h2>✅ Passed Tests</h2>
                ${passedReports.collect { report ->
      """<div class="report-card">
                        <span class="badge passed">PASSED</span>
                        <a href="${report.relPath}">${report.name} Test Report</a>
                    </div>"""
    }.join('\n')}
            </div>
        </body>
        </html>
        """
  }
}
