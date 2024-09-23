// Copyright 2024 cronn GmbH
// SPDX-License-Identifier: Apache-2.0

package de.eshg

import org.gradle.api.DefaultTask
import org.gradle.api.GradleException
import org.gradle.api.Task
import org.gradle.api.file.DirectoryProperty
import org.gradle.api.provider.ListProperty
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.InputDirectory
import org.gradle.api.tasks.InputFiles
import org.gradle.api.tasks.Optional
import org.gradle.api.tasks.SkipWhenEmpty
import org.gradle.api.tasks.TaskAction

import java.nio.file.Path
import java.util.regex.Pattern

abstract class FindUnusedValidationFiles extends DefaultTask {

    @InputFiles
    @SkipWhenEmpty
    abstract DirectoryProperty getValidationBaseDirectory();

    @InputFiles
    abstract DirectoryProperty getOutputBaseDirectory();

    @Optional
    @Input
    abstract ListProperty<Pattern> getIgnoredFiles();

    FindUnusedValidationFiles() {
        validationBaseDirectory.convention(getProject().layout.projectDirectory.dir('data/test/validation'))
        outputBaseDirectory.convention(getProject().layout.projectDirectory.dir('data/test/output'))

        // This task has no output
        outputs.upToDateWhen { true }
    }


    @TaskAction
    protected void exec() {
        List<Path> validationFiles = validationBaseDirectory.asFileTree.collect { file ->
          validationBaseDirectory.get().asFile.toPath().relativize(file.toPath())
        }

        ignoredFiles.get().each { pattern ->
            List<Path> ignoredValidationFiles = validationFiles.grep { validationFile ->
                pattern.matcher(validationFile.toString()).matches()
            }
            if (ignoredValidationFiles.isEmpty()) {
                throw new IllegalArgumentException("Found no validation file matching the ignore file pattern '${pattern}'")
            }
            validationFiles.removeAll(ignoredValidationFiles)
        }

        List<Path> outputFiles = outputBaseDirectory.asFileTree.collect {it.toPath()}.collect { file ->
            outputBaseDirectory.get().asFile.toPath().relativize(file)
        }

        List<Path> unusedValidationFiles = (validationFiles - outputFiles).sort()

        if (!unusedValidationFiles.isEmpty()) {
            Path relativeValidationBaseDirectory = project.rootDir.toPath().relativize(validationBaseDirectory.get().asFile.toPath())
            String pluralS = unusedValidationFiles.size() > 1 ? "s" : ""
            throw new GradleException("""Found ${unusedValidationFiles.size()} unused validation file${pluralS}:
                          |
                          |${unusedValidationFiles.collect { path -> "• " + relativeValidationBaseDirectory.resolve(path) }.join("\n")}
                          |
                          |For false positives there are two potential reasons:
                          |
                          |1) The '${path}' task needs a dependency to another task that creates the validation file.
                          |
                          |2) The validation file is only written in some cases, for example when specific properties are set.
                          |   In this case the validation file can be ignored by setting the 'ignoredFiles'."
                        """.stripMargin("|")  )
        }
    }
}
