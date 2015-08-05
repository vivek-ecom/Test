@echo off

REM -----------------------------------------------------------------
REM  Licensed Materials - Property of IBM
REM
REM  WebSphere Commerce
REM
REM  (C) Copyright IBM Corp. 2010 All Rights Reserved.
REM
REM  US Government Users Restricted Rights - Use, duplication or
REM  disclosure restricted by GSA ADP Schedule Contract with
REM  IBM Corp.
REM -----------------------------------------------------------------

SETLOCAL

call setenv.bat

echo %WCSTATICHTML%

set CP=%WCSTATICHTML%\bin\WCStaticHTML.jar;

%JAVA_HOME%\bin\java -classpath %CP% com.ibm.commerce.tcoi.html.tool.MatchAndReplace %*

