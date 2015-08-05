package com.ibm.commerce.tcoi.html.tool;

/*
 *-----------------------------------------------------------------
 * Licensed Materials - Property of IBM
 *
 * WebSphere Commerce
 *
 * (C) Copyright IBM Corp. 2009, 2010
 *
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 *-----------------------------------------------------------------
 */
import java.io.*;
import java.util.Hashtable;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The MarkUpTool is used to insert a marker into the top and bottom of all the JSP files.
 */

public class MarkUpTool {
	private static Logger logger = Logger.getLogger("MarkUpTool");
	private static String usage = "\n\nUsage:\n\n Syntax: \n markUpTool -SOURCEDIR sourceDir -EXCLUSIONFILE exclusionfile\n\n Options:\n-SOURCEDIR      full path to the directory containing the JSP files\n-EXCLUSIONFILE  full file path to the exclusion list file\n\n";
	private static FileHandler logFile = null;
	private static Hashtable ht = null; 
	private static Hashtable doctypepresent = null;
	private static Hashtable nodoctype = null;
	private static boolean end = false;
	
	/**
	 * copyright
	 */
	public static final String COPYRIGHT = com.ibm.commerce.copyright.IBMCopyright.SHORT_COPYRIGHT;
	
	private MarkUpTool() {
		
	}
	/** 
	 * The main function of MarkUpTool
	 * @param args
	 */
	public static void main(String[] args) {
		FileReader exfr = null;
		BufferedReader exbr = null;
		try{
			String exclusionfile=null;
			String sourcedir=null;
			if(args.length == 0){
				printUsage();
				System.exit(1);
			}
			for(int c=0;c<args.length;c++){
				if(args[c].equals("-SOURCEDIR")){
					sourcedir = args[c+1];
					c = c + 1;
				}
				else if(args[c].equals("-EXCLUSIONFILE")){
					exclusionfile = args[c+1];
					c = c + 1;
				}
			}
			if(exclusionfile == null || sourcedir == null){
				printUsage();
				System.exit(1);
			}
			
			logFile = new FileHandler("logFile.txt");
			logger.addHandler(logFile);
			logFile.setFormatter(new SimpleFormatter());
			
			File exfile = new File(exclusionfile);
			exfr = new FileReader(exfile);
			exbr = new BufferedReader(exfr);
			
			String line;
			ht = new Hashtable();
			doctypepresent = new Hashtable();
			nodoctype = new Hashtable();
			
			while((line=exbr.readLine()) != null){
				ht.put(line,line);
			}
			
			createDocTypeList(sourcedir);
			insertComments(sourcedir);
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
		finally{
			try{
				if(exfr!= null){
					exfr.close();
				}
				if(exbr!= null){
					exbr.close();
				}
			}
			catch(Exception ex){
				ex.printStackTrace();
			}
		}
}
/**
 * This function stores the list of file names containing DOCTYPE element.
 * @param dir
 */
	public static void createDocTypeList(String dir){
		try{
		File fd= new File(dir);
		String[] listOfFiles = fd.list();
		String str = null;
		for(int i=0; i<listOfFiles.length; i++){
			boolean isDoctype = false;
			File f = new File(fd.getPath() + File.separatorChar + listOfFiles[i]);
			
			if(f.isDirectory()){
				createDocTypeList(fd.getPath() + File.separatorChar + listOfFiles[i]);
			}
			else{
				if(f.getName().endsWith("jsp") && !(ht.containsKey(f.getName()))){
					FileReader fr = new FileReader(f);
					BufferedReader br = new BufferedReader(fr);
					while((str = br.readLine()) != null){
						if(str.contains("DOCTYPE")){
							isDoctype = true;
							doctypepresent.put(f.getName(),f.getName());
							break;
						}
					}
					if(!isDoctype){
						nodoctype.put(f.getName(),f.getName());
					}
					br.close();
					fr.close();
				}
			}
		}
	}
		catch(Exception ex){
			ex.printStackTrace();
		}
}
/**
 * This function is used to insert the marker in a source file.
 * @param dir The source directory.
 */
	public static void insertComments(String dir){
		try{
			String s = null;
			String str = null;
			File fd= new File(dir);
			String[] listOfFiles = fd.list();
	
			for(int i=0; i<listOfFiles.length; i++){
				 end = false;
				File f = new File(fd.getPath() + File.separatorChar + listOfFiles[i]);
				
				if(f.isDirectory()){
					insertComments(fd.getPath() + File.separatorChar + listOfFiles[i]);
				}
				else{
					if((f.getName().endsWith(".jspf") && !(ht.containsKey(f.getName()))) || nodoctype.containsKey(f.getName())){
						FileReader fr = new FileReader(f);
						BufferedReader br = new BufferedReader(fr);
						PrintWriter pw = new PrintWriter(new FileWriter(new File(fd.getPath() + File.separatorChar + "test.jsp")));
					
							while((s = br.readLine()) != null){
							if(!end){
								checkForEnd(s,f);
							}
							pw.println(s);
								if(s.trim().startsWith("<%") && !(s.trim().contains("%>"))){
									if(checkForCR(br,pw)){
										str = skipEmptyLines(br,pw);
										if(str != null && str.trim().startsWith("<%--") && !(str.trim().contains("--%>"))){
											pw.println(str);
											checkDesc(br,pw);
											str = skipEmptyLines(br,pw);
										}
										addBeginComment(str,br,pw,f);
									}
								}	
							}
							addEndCommentAndCloseStreams(br,fr,pw,f,fd);
					   }
					
					if(doctypepresent.containsKey(f.getName())){
						FileReader fr1 = new FileReader(f);
						BufferedReader br1 = new BufferedReader(fr1);
						PrintWriter pw1 = new PrintWriter(new FileWriter(new File(fd.getPath() + File.separatorChar + "test.jsp")));
						
						while((s = br1.readLine()) != null){
							if(!end){
								checkForEnd(s,f);
							}
							pw1.println(s);
							if(s.contains("DOCTYPE")){
								s = skipEmptyLines(br1,pw1);
								addBeginComment(s,br1,pw1,f);
							}
						}
						addEndCommentAndCloseStreams(br1,fr1,pw1,f,fd);
					}
				  }//end else
			  }
		}
		catch(Exception e){
			e.printStackTrace();
		}
}
/**
 * This function checks for the IBM copyright statement in a file.
 * @param br The BufferedReader
 * @param pw The PrintWriter
 * @return boolean
 */
	public static boolean checkForCR(BufferedReader br, PrintWriter pw){
		boolean isCR = false;
		try{
			String p;
				while((p = br.readLine()) != null){
					pw.println(p);
					if (p.contains("Licensed Materials - Property of IBM")){
						isCR = true;
					}
					if(p.trim().contains("%>")){
						if(p.trim().contains("<%--")){
							checkDesc(br,pw);
						}
						else{
							break;
						}
					}
				}
		}
			catch(Exception e){
				e.printStackTrace();
			}
			return isCR;		
}
/**
 * This function checks whether the file description is present in a file.
 * @param br The BufferedReader
 * @param pw The PrintWriter
 */
	public static void checkDesc(BufferedReader br, PrintWriter pw){
		try{
			String p;
				while((p = br.readLine()) != null){
					pw.println(p);
					if(p.trim().contains("--%>")){
						break;
					}
				}
		}
			catch(Exception e){
				e.printStackTrace();
		}
}
/**
 * This function skips the empty lines in the JSP source file.
 * @param br The BufferedReader
 * @param pw The PrintWriter
 * @return String
 */
	
	public static String skipEmptyLines(BufferedReader br, PrintWriter pw){
		String g = null;
		try{
			while( (g = br.readLine())!= null && g.isEmpty()){ 
				pw.println(g);
			}
		}
			catch(Exception e){
				e.printStackTrace();
		}
			 return g;
}	
/**
 * This function checks whether the sorce line contains the 'END' pattern.
 * @param str The source line
 * @param f The input file
 */
	public static void checkForEnd(String str,File f){
		if(str.trim().startsWith("<!--") && str.contains(f.getName())){
			end = checkPattern(str,"end");
		}
}
/**
 * This function checks whether a source line contains a specified pattern.
 * @param line The source line.
 * @param pat The pattern to check.
 * @return boolean
 */
	public static boolean checkPattern(String line, String pat){
		Pattern p = Pattern.compile(pat,Pattern.CASE_INSENSITIVE);
		Matcher m = p.matcher(line);
		return m.find();
}
/**
 * This function adds a marker and updates the log file
 * @param pw The PrintWriter
 * @param s The marker type.
 * @param f The input file.
 */
	public static void commentAndLog(PrintWriter pw,String s,File f){
		pw.println("<!-- " +s+" "+ f.getName() + " -->");
		logger.log(Level.INFO,f.getName()+": Added <!-- " +s+" "+f.getName() + " -->");
}
/**
 * This function adds the marker at the top of the file(BEGIN comment)
 * @param str The source line 
 * @param br The BufferedReader
 * @param pw The PrintWriter
 * @param f The input file
 */
	public static void addBeginComment(String str,BufferedReader br,PrintWriter pw,File f){
		if(str != null && str.contains(f.getName())){
			if(!(str.contains("BEGIN"))){
				commentAndLog(pw,"BEGIN",f);
			}
			else{
				pw.println(str);
			}
		}
		else{
			commentAndLog(pw,"BEGIN",f);
				if(str != null){
					pw.println(str);
				}
		}
		
	}
	
/**
 * This function adds a marker at the end of the file(END comment) and closes all open streams.
 * @param br The BufferedReader
 * @param fr The FileReader
 * @param pw The PrintWriter
 * @param f The input file
 * @param fd The file descriptor
 */
	public static void addEndCommentAndCloseStreams(BufferedReader br,FileReader fr,PrintWriter pw,File f,File fd){
		try{
			if(!end){
				commentAndLog(pw,"END",f);
			}
			pw.flush();
			pw.close();
			br.close();
			fr.close();
			
			f.delete();
			File nf = (new File(fd.getPath() + File.separatorChar + "test.jsp"));
			nf.renameTo(f);
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
	}
	
/**
  * This function displays the usage and syntax of this tool in the console.
  */
	
public static void printUsage(){
		logger.log(Level.INFO,usage);
	}
}
