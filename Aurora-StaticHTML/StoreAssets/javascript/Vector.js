/********************************************************************
*-------------------------------------------------------------------
* Licensed Materials - Property of IBM
*
* WebSphere Commerce
*
* (c) Copyright IBM Corp. 2000, 2002
*
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*
*-------------------------------------------------------------------*/

/**
 * @fileOverview This is the class used to contain a list of objects. 
 * The functions in this classes are common in the Vector data structure.
 * Please include file "Util.js' when using this file.
 * @version 1.0
 */
  
/**
 * Initializes the vector
 * @constructor
 */
function Vector(rootName)
{
  this.container    = new Array();
  this.type         = "Vector";
  this.rootName     = rootName;  // The root name of this vector (to facilitate XML generation)

}// END class Vector


/**
 *Create and discard an initial Vector object. This forces the prototype
 * object to be created in Navigator 3.
 */
new Vector();


Vector.prototype.addElement        = addElement;
Vector.prototype.addElements       = addElements;
Vector.prototype.removeElement   = removeElement;
Vector.prototype.removeElementAt   = removeElementAt;
Vector.prototype.removeAllElements = removeAllElements;
Vector.prototype.insertElementAt   = insertElementAt;
Vector.prototype.moveElement       = moveElement;
Vector.prototype.elementAt         = elementAt;
Vector.prototype.isEmpty           = isEmptyVector;
Vector.prototype.size              = size;
Vector.prototype.elements          = elements;
Vector.prototype.contains          = contains;

// XML-specific functions
Vector.prototype.setRootName   = setRootName;
Vector.prototype.getRootName   = getRootName;


/**
 * Add an element to the end of the Vector.
 *
 * @param (string) element The element to be added to this Vector
 * @param (owner) owner The owner of this object (pass the object from the calling func.)
 *
 * @private
 *
 */
function addElement(element, owner)
{
  var obj = element;
 
  if ( owner == null )   
      this.container[this.container.length] = obj;
  else
      owner.container[owner.container.length] = obj;

}// END addElement

/**
 * Add an array of elements to the end of the Vector.
 * @param (arrary) elements The array of elements to be added to this Vector
 * @param (object) owner owner of this object. 
 *
 * @private
 */
function addElements(elements, owner)
{
  for(index in elements)
  {
    if ( owner == null )
        this.container[this.container.length] = elements[index];
    else
        owner.container[owner.container.length] = elements[index];
  }

}// END addElements

/**
 * Add an element at a specified index. The index must be a value greater
 * than or equal to 0 and less than or equal to the current size of the
 * vector.
 *
 * @param (object) element The element to be added to this Vector
 * @param (int) index The index into the Vector
 * @param (object) owner The vector
 * @param (boolean) attribute TRUE if this NVP is an attribute of an XML tag; FALSE
 *             otherwise.
 *
 * @returns (boolean) TRUE if successful; FALSE otherwise
 */
function insertElementAt(element, index, owner/*, attribute*/)
{
  if ( owner == null )
  {
      if( (index < 0) || (index > (this.container.length-1)) )
        return(false);
      else
      {
        var buffer = new Array();
        var shift  = 0;
    
        for(var i=0; i<this.container.length; i++)
        {
          if(i == index)
          {
            buffer[i] = element;
            shift = 1;
          }
          
          buffer[i+shift] = this.container[i];
        }
    
        this.container = buffer;
        return(true);
      }
  } // end of owner == null
 else
 { // owner is not null
     if( (index < 0) || (index > (owner.container.length-1)) )
        return(false);
     else
     {
        var buffer = new Array();
        var shift  = 0;
    
        for(var i=0; i<owner.container.length; i++)
        {
          if(i == index)
          {
            buffer[i] = element;
            shift = 1;
          }
          
          buffer[i+shift] = owner.container[i];
        }
    
        owner.container = buffer;
        return(true);      }
 }  // end of owner is not null

}// END insertElementAt

/**
 *
 * Retrieve the object at the given location.
 *
 * @param (int) index The index into the Vector
 * @param (object) owner The owner of this object. pass the object from the calling func
 * @returns (object) The object or NULL if an error occurs.
 */
function elementAt(index, owner)
{
  if ( owner == null )
  {
    if( (index < 0) || (index > (this.container.length-1)) )
      return(null);
    
    return(this.container[index]);
  }
  else
  {
    if( (index < 0) || (index > (owner.container.length-1)) )
      return(null);
    
    return(owner.container[index]);
  }

}// END elementAt

/**
 *
 * Remove the set object at the given location. The index must be a value
 * greater than or equal to 0 and less than or equal to the current size of
 * the vector.
 *
 * @param (int) index The index into the Vector
 * @owner (object) The Vector
 * @return (boolean) Returns TRUE if successful; FALSE otherwise.
 */
function removeElementAt(index, owner)
{
  if ( owner == null )
  {
    if( (index < 0) || (index > (this.container.length-1)) )
      return(false);
    else
    {
      var buffer = new Array();
  
      for(var i=0; i<this.container.length; i++)
      {
        if(i == index)
          continue;
        
        buffer[buffer.length] = this.container[i];
      }
  
      this.container = buffer;
      return(true);
    
    }// END else
  } // end of owner= null
  else
  { //owner != null
     if( (index < 0) || (index > (owner.container.length-1)) )
      return(false);
    else
    {
      var buffer = new Array();
  
      for(var i=0; i<owner.container.length; i++)
      {
        if(i == index)
          continue;
        
        buffer[buffer.length] = owner.container[i];
      }  
      owner.container = buffer;
      return(true);    
    }// END else
  } // end of owner is not null
}// END removeElementAt

/**
 * Remove the object from the vector
 *
 * @param (object) element The element to remove
 * @param (object) owner The owner of this object, pass the object from the
 * calling func
 * @return (boolean) TRUE if successful; FALSE otherwise.
 */
function removeElement(element, owner)
{
  if ( owner == null )
  {
      var buffer = new Array();
  
      for(var i=0; i<this.container.length; i++)
      {
        if(this.container[i] == element)
          continue;
        
        buffer[buffer.length] = this.container[i];
      }
  
      if (this.container.length == buffer.length) return(false);
      
      this.container = buffer;
      return(true);
    
  } // end of owner= null
  else
  { //owner != null
      var buffer = new Array();
  
      for(var i=0; i<owner.container.length; i++)
      {
        if(this.container[i] == element)
          continue;
        
        buffer[buffer.length] = owner.container[i];
      }  

      if (owner.container.length == buffer.length) return(false);

      owner.container = buffer;
      return(true);    

  } // end of owner is not null
}// END removeElementAt

/**
 *
 * Remove all objects from the Vector.
 * @return (object) an empty Vector
 */
function removeAllElements()
{ this.container = new Array(); }

/**
* Move the location a particular element. The specified indexes must be 
* greater than or equal to 0 and less than or equal to the current size of
* the vector.
*
* @param (int) from Current index of the element
* @param (int) to The new index of the element
*
* @return (boolean) TRUE if successful; FALSE otherwise.
*/
function moveElement(from, to)
{
  // Make sure that the current location is not out of range...
  if( (from < 0) || (from > (this.container.length-1)) )
    return(false);
  
  // Make sure that the new location is not out of range...
  else if( (to < 0) || (to > (this.container.length-1)) )
  {
    alert("Vector error: Out of bounds error on destination");
    return(false);
  }
  
  else if(from == to)
    return(true);
    
  var obj = this.elementAt(from);
  
  if(obj != null)
  {
    this.removeElementAt(from);
    
    if(to == this.size())
      return(this.addElement(obj));
    else
      return(this.insertElementAt(obj, to));
  }
  else
    return(false);
  
}// END moveElement

/**
* Return an array that is a copy of the elements in the Vector.
*
* @param (object) owner The vector to be copied.
* @return (object) the array containing all the elements in the vector.
*
*/
function elements(owner)
{
  var buffer = new Array();

  if (owner == null) {
     for(var i=0; i<this.container.length; i++)
       buffer[buffer.length] = this.container[i];
  }
  else {
     for(var i=0; i < owner.container.length; i++)
       buffer[buffer.length] = owner.container[i];
  }

  return(buffer);
}
  
/**
*
* Determine whether the vector contains the element in question.
*
* @param (object) element The element to be searched in the Vector.
*
* @return (boolean) TRUE if the vector contains the element; FALSE otherwise.
*/
function contains(element)
{
  for(var i=0; i<this.container.length; i++)
  {
    if(this.container[i] == element)
      return(true);
  }

  return(false);
}
  
/**
*
* Set the root name of this Vector and any affected children.
*
* @param (string) name - The new root name of the Vector.
*/
function setRootName(name)
{
  var obj;
  
  this.rootName = name;
  
}// END setRootName

/**
* Returns the root name of this Vector.
*
* @return (string) The root of the vector
*/
function getRootName()
{ return(this.rootName); }

/**
 * Return the number of entries in this Vector.
 *
 * @param (object) owner The vector
 */
function size(owner)
{ 
  if ( owner == null )
    return(this.container.length); 
  else
    return(owner.container.length);
}

/**
 * Return TRUE if the Vector is empty; FALSE otherwise.
 *
 * @return (boolean) True of the Vector is empty; False otherwise.
 */
function isEmptyVector()
{ return( (this.container.length == 0) ); }


