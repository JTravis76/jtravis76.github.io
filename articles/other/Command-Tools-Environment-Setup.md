#meta-start
Title:Command Tools Environment Setup
Created:7-23-2020
Category:other
#meta-end
# Command Tools Environment Setup
CLI tools are becoming more and more popular. Below are some tips to create a batch files to load up your tool belt.

Personally, I use the .dotnet\tools directory to store all the batch files. Since the Environment path was already set there.

## SASS

**scss.bat**

```bat
@echo off
REM Copyright 2016 Google Inc. Use of this source code is governed by an
REM MIT-style license that can be found in the LICENSE file or at
REM https://opensource.org/licenses/MIT.

REM This script drives the standalone Sass package, which bundles together a
REM Dart executable and a snapshot of Sass. It can be created with `pub run
REM grinder package`.

set SCRIPTPATH=%~dp0
set arguments=%*
"%SCRIPTPATH%\src\dart.exe" "-Dversion=1.15.3" "%SCRIPTPATH%\src\sass.dart.snapshot" %arguments%
```

## Typescript SDK

**tsc.bat**

```bat
@echo off
set tsPath=C:\Program Files (x86)\Microsoft SDKs\TypeScript\3.9\tsc.js
node.exe "%tsPath%" %~1
exit /b 0
```

## Thycotic Secret Server

**tss.bat**

```bat
@Echo Off
REM > tss init -u "https://{url}/SecretServer/" -r "SomeRuleName" -k "SomeKeyValue"

"E:\_Software\secretserver-sdk-1.4.1-win-x64\tss.exe" "-kd" "E:\Thycotic" "-cd" "E:\Thycotic\SDK" %*
```