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

REM Static HTML environment variables follow

for /f "tokens=1,*" %%v in (setenv.ini) do set %%v=%%w

call setshortname RAD_HOME "%RAD_HOME%"

call setshortname WAS_HOME  %RAD_HOME%\runtimes\base_v7_stub
call setshortname JAVA_HOME "D:\JDK6"

call setshortname WCSTATICHTML  "%~d0%~p0.."

