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

set shortname=%~d2%~p2
for /d %%j in ("%shortname%") do set shortname=%%~sj%~nx2
for /d %%j in ("%shortname%") do set %1=%%~sj