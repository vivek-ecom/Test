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

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.Hashtable;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The MatchAndReplace tool is used to replace the dynamic links in a HTML source
 * file with static links.
 */
public class MatchAndReplace {
	
	private static Logger logger = Logger.getLogger("MatchAndReplace");
	private static Hashtable regxTable = null;
	private static Hashtable regxValueTable = null; 
	private static Hashtable highlightNeeded = null;
	boolean spanNeeded;
	private static String usage = "\n\nUsage:\n\n Syntax: \n matchAndReplace -SOURCEDIR sourceDir -REGEXFILE regexfile\n\n Options:\n-SOURCEDIR  full path to the directory containing the HTML files\n-REGEXFILE  full file path to the regular expressions file\n\n"; 
	/**
	 * copyright
	 */
	//public static final String COPYRIGHT = com.ibm.commerce.copyright.IBMCopyright.SHORT_COPYRIGHT;
	
	private MatchAndReplace() {
		
	}
	/**
	 * The main function of MatchAndReplace tool.
	 * @param args
	 */
	public static void main(String[] args) {	
	String regexfile=null;
		String htmlsrc=null;
		if(args.length == 0){
			printUsage();
			System.exit(1);
		}
		for(int c=0;c<args.length;c++){
			if(args[c].equals("-SOURCEDIR")){
				 htmlsrc = args[c+1];
				c = c + 1;
			}
			else if(args[c].equals("-REGEXFILE")){
				regexfile = args[c+1];
				c = c + 1;
			}
		}
		if(regexfile == null || htmlsrc == null){
			printUsage();
			System.exit(1);
		}
		
		loadFindAndReplaceValues(regexfile);
		String htmlSource;
		File fd= new File(htmlsrc);
		String[] listOfFiles = fd.list();
		for(int i=0; i<listOfFiles.length; i++){
			File f = new File(fd.getPath() + File.separatorChar + listOfFiles[i]);
			if(f.isFile()){
				addHighlightingcode(f,fd);
				htmlSource = readHTMLSourceFile(f);
				htmlSource = replaceLinks(htmlSource);
				saveFile(fd.getPath() + File.separatorChar + listOfFiles[i],htmlSource);
			}
		}
}

/**
 * This function reads the HTML source file. 
 * @param file The file to be read.
 * @return String 
 */
public static String readHTMLSourceFile(File file){
	StringBuffer fileSource = new StringBuffer();
	BufferedReader br = null;
	FileInputStream fis = null;
	InputStreamReader in = null;
	String buffersize = "1024";
	try{
			 fis = new FileInputStream(file);
			 in = new InputStreamReader(fis, "UTF-8"); 
			 br = new BufferedReader(in);
			char[] strBuffer = new char[Integer.valueOf(buffersize)];
		    int length=0;
		        while((length=br.read(strBuffer)) != -1){
		            String data = String.valueOf(strBuffer, 0, length);
		            fileSource.append(data);
		            strBuffer = new char[Integer.valueOf(buffersize)];
		        }
	}catch(Exception ex){
		ex.printStackTrace();
	}
	finally{
		try{
			if(br!= null){
				br.close();
			}
			if(fis!= null){
				fis.close();
			}
			if(in!= null){
				in.close();
			}
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
	}
	return fileSource.toString();
}

/**
 * This function stores the patterns to replace in the HTML source file.
 * @param fileName The file containing the regular expression patterns.
 */
public static void loadFindAndReplaceValues(String fileName){
	FileReader regxfr = null;
	BufferedReader regxbr = null;
	try{
		File regxfile = new File(fileName);
		regxfr = new FileReader(regxfile);
		regxbr = new BufferedReader(regxfr);
		String line;
		int counter = 0;
		regxTable = new Hashtable();
		regxValueTable = new Hashtable();
		highlightNeeded = new Hashtable();
		while((line=regxbr.readLine()) != null){
			if(line.split("REPLACEWITH").length<=1){
				continue;
			}
			String[] tokens = line.split("REPLACEWITH");
			
			regxTable.put("regex_"+counter,tokens[0]);
			regxValueTable.put("regex_"+counter, tokens[1]);
			counter++;
		}
	}catch(Exception e){
			e.printStackTrace();
	}
	finally{
		try{
			if(regxfr!= null){
				regxfr.close();
			}
			if(regxbr!= null){
				regxbr.close();
			}
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
	}
}

/**
 * This function replaces the dynamic links in the HTML source with the static values
 * @param source The HTML source file.
 * @return String 
 */
public static String replaceLinks(String source){
	String sourceStr = source;
	 for(int i=0;i<regxTable.size();i++) {
		String key = "regex_"+i;
    	String pattern = (String) regxTable.get(key);
    	String replaceStr = (String)regxValueTable.get(key);
    	sourceStr = matchAndReplace(sourceStr,pattern,replaceStr);
   }
    return sourceStr;
}

/**
 * This function replaces the regular expression pattern with the corresponding replace string 
 * @param source The HTML source file.
 * @param regex The regular expression pattern.
 * @param replaceStr The corresponding replace value.
 * @return String 
 */
public static String matchAndReplace(String source,String regex,String replaceStr){
	Pattern p = Pattern.compile(regex);
	Matcher m = p.matcher(source);
	source = m.replaceAll(replaceStr);
	return source;
}

/**
 * This function is used to save the HTML source file after replacing the dynamic links.
 * @param fileName The name of the HTML file.
 * @param source The HTML source to be saved.
 */
public static void saveFile(String fileName,String source){
	FileOutputStream fop=null;
	try{
		File file = new File(fileName);
    	file.createNewFile();
	    fop=new FileOutputStream(file);
        fop.write(source.getBytes("UTF-8"));
        fop.flush();
	}
    catch(IOException ie){
      ie.printStackTrace();
    }	  
	finally{
		try{
			if(fop!= null){
			fop.close();
			}
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
	}
}

/**
 * This function adds the highlight feature to the HTML
 * @param f The input file.
 * @param fd The file descriptor.
 */
public static void addHighlightingcode(File f, File fd){
	FileReader fr = null;
	BufferedReader br = null;
	PrintWriter pw = null;
	FileInputStream fis = null;
	InputStreamReader in = null;
	
	try{
		String s =null;
		String str = null;
		String storeStr = null;
		highlightNeeded = new Hashtable();
		boolean addhighlightcode = false;
		fis = new FileInputStream(f);
		in = new InputStreamReader(fis, "UTF-8"); 
		br = new BufferedReader(in);
		
		FileOutputStream fos = new FileOutputStream(new File(fd.getPath() + File.separatorChar + "test.html"));
		OutputStreamWriter out = new OutputStreamWriter(fos, "UTF-8"); 
		pw = new PrintWriter(out);

		while((s = br.readLine()) != null){
			storeStr = null;
			while(!s.isEmpty() && s.contains("<!--") && s.contains("-->") && (!s.contains("</body>"))){   
				int c = s.indexOf("-->");
				String t = s.substring(0,c+3);
				s = s.substring(c+3);
				str = checkBeginEnd(t,br,pw);
				if(str != null){
					 storeStr = str;
				}
			}

			if(storeStr != null){
				s = storeStr;
			}
			if(s.contains("<html") && !s.contains("activateHighlight(event)")){
				pw.println("<html  xmlns:wairole='http://www.w3.org/2005/01/wai-rdf/GUIRoleTaxonomy#' xmlns:waistate='http://www.w3.org/2005/07/aaa' lang='en' xml:lang='en' onkeydown='javascript:activateHighlight(event);'>");
				addhighlightcode = true;
			}
			
			
			
			else if ((s.contains("xmlns:waistate")) && addhighlightcode){
				pw.println("");
				
			}
			
			else if ((s.contains("xmlns:wairole")) && addhighlightcode){
				pw.println("");}
			 
			 
			 
			else if(s.contains("</body>") && addhighlightcode){
				
                                           
				int i = s.indexOf("</body>");
				if (i != 0){
					  String b = s.substring(0,i);
					  String rest = s.substring(i);
					  pw.println(b);
					  pw.println("<script type=\"text/javascript\"> function displayHighlightFeatureInHTML(){var all = document.getElementsByTagName('*'); for (var i = 0; i < all.length; i++) { if (all[i].className == 'jspcaption') {all[i].style.display='block';} if (all[i].className == 'highlight') {all[i].style.border='2px dashed red';all[i].style.display='block';} if (all[i].className == 'product') {all[i].style.border='2px dashed red';} if (all[i].className == 'product_price') {all[i].style.border='2px dashed red';} if (all[i].className == 'item' && (all[i].id.indexOf('compare') == -1) && (all[i].id.indexOf('sub') == -1) ) {all[i].style.border='2px dashed red';} if (all[i].className == 'item_price') {all[i].style.border='2px dashed red';}} } function activateHighlight (event){ if(event.ctrlKey){ if(event.altKey){ if(event.keyCode == '72'){ displayHighlightFeatureInHTML(); } } } } </script>");
					  pw.println(rest);
					  
				  }
				                          
				else{    
					boolean spanNeeded = true;
					  pw.println("<script type=\"text/javascript\"> function displayHighlightFeatureInHTML(){var all = document.getElementsByTagName('*'); for (var i = 0; i < all.length; i++) { if (all[i].className == 'jspcaption') {all[i].style.display='block';} if (all[i].className == 'highlight') {all[i].style.border='2px dashed red';all[i].style.display='block';} if (all[i].className == 'product') {all[i].style.border='2px dashed red';} if (all[i].className == 'product_price') {all[i].style.border='2px dashed red';} if (all[i].className == 'item' && (all[i].id.indexOf('compare') == -1) && (all[i].id.indexOf('sub') == -1) ) {all[i].style.border='2px dashed red';} if (all[i].className == 'item_price') {all[i].style.border='2px dashed red';}} } function activateHighlight (event){ if(event.ctrlKey){ if(event.altKey){ if(event.keyCode == '72'){ displayHighlightFeatureInHTML(); } } } } </script>");
				      pw.println(s);
				}
			}
			
			else if(checkPattern(s,"BEGIN") && !s.contains(".jspf")){}
			else{
				pw.println(s);
			}
		}	
	}
	catch(Exception ex){
		ex.printStackTrace();
	}
	finally{
		try{
			if(pw!= null){
				pw.flush();	
				pw.close();
			}
			if(br!= null){
				br.close();
			}
			if(fr!= null){
				fr.close();
			}
			if(fis!= null){
				fis.close();
			}
			if(in!= null){
				in.close();
			}
			f.delete();
			File nf = (new File(fd.getPath() + File.separatorChar + "test.html"));
			nf.renameTo(f);
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
	}
}

/**
 * This function checks whether the highlighting div is already present for the JSP section
 * @param pw The PrintWriter.
 * @param br The BufferedReader.
 * @param str The input string to check.
 * @param name The JSP section name.
 */
public static void checkForHighlight(PrintWriter pw,BufferedReader br,String str,String name,String s){
	try{
		if(!str.contains("highlight") || str.contains("text_highlight")){
			if(s.contains("CatalogEntryDisplay") || s.contains("PriceDisplay")){
				pw.println("<div class=\"jspcaption\" style=\"display:none\">" + name+ "</div>");
			}
			else{
			pw.println("<span class=\"highlight\">");  
			pw.println("<div class=\"jspcaption\" style=\"display:none\">" + name+ "</div>");
			}
			highlightNeeded.put(name, true);
			
		   }	
		
		if(checkPattern(str,"BEGIN") && !str.contains(".jspf")){
			int start = str.indexOf("BEGIN");
			int end = str.indexOf(".jsp");
			String name_1 = str.substring(start+6,end+4);
			pw.println(str);
			highlightNeeded.put(name_1, true);
			if(str.contains("CatalogEntryDisplay") || str.contains("PriceDisplay")){
				pw.println("<div class=\"jspcaption\" style=\"display:none\">" + name_1+ "</div>");
			}
			else{
			pw.println("<span class=\"highlight\">"); 
			pw.println("<div class=\"jspcaption\" style=\"display:none\">" + name_1+ "</div>");
			}
		}
		
		else if(checkPattern(str,"END ") && !checkPattern(str,"END -") && !str.contains(".jspf")){ 
			int start_1 = str.indexOf("END");
			int end_1 = str.indexOf(".jsp");
			String name_2 = str.substring(start_1 + 4,end_1 + 4);
			if(highlightNeeded.containsKey(name_2) && (!str.contains("CatalogEntryDisplay")) && (!str.contains("PriceDisplay"))){
				pw.println("</span>"); 
			}
		}
	}
		
	catch(Exception ex){
		ex.printStackTrace();
	}
}

/**
 * This function checks for the Begin and End comment in the source. 
 * @param s The source string 
 * @param br The BufferedReader
 * @param pw The PrintWriter
 * @return String
 */
public static String checkBeginEnd(String s,BufferedReader br, PrintWriter pw){
	String str=null;
	if(checkPattern(s,"BEGIN") && !s.contains(".jspf")){
		int start = s.indexOf("BEGIN");
		int end = s.indexOf(".jsp");
		String name = s.substring(start+6,end+4);
		pw.println(s);
		str = skipEmptyLines(br,pw);
		checkForHighlight(pw,br,str,name,s);
	}
	
	else if(checkPattern(s,"END ") && !checkPattern(s,"END -") && !s.contains(".jspf")){  
		int start = s.indexOf("END");
		int end = s.indexOf(".jsp");
		String name = s.substring(start+4,end+4);
		if(highlightNeeded.containsKey(name) && (!name.contains("CatalogEntryDisplay")) && (!name.contains("PriceDisplay"))){
			pw.println("</span>"); 
		}
		pw.println(s);
	}
	else{
		pw.println(s);
	}

	return str;
}

/**
 * This function checks for a pattern in a line.
 * @param line The input line.
 * @param pat The pattern to check.
 * @return String
 */
public static boolean checkPattern(String line, String pat){
	Pattern p = Pattern.compile(pat);
	Matcher m = p.matcher(line);
	return m.find();
}

/**
 * This function skips the empty lines in the HTML source file.
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
 * This function displays the usage and syntax of this tool in the console.
 */
public static void printUsage(){
	logger.log(Level.INFO,usage);
}
}

