# Date Spinner Plugin

<p align="center">
    <img src="sample_image.PNG">
</p>

## Introduction

Date Spinner is a Date Selection plugin for desktop and touch devices.

* No dependencies required
* Customizable via CSS
* Simple APIs

Easy to initiate:

**Html:**
```
<div id="dateStuff"></div>
```
**JS:**
```
var myDateSpinner = new dateSpinner.setSpinner({
    selector: '#dateStuff',
    onChange: function(event){
    	setTimeout(function(){
        	document.getElementById('updatedDate').innerHTML= new Date(myDateSpinner.getDate())
			document.getElementById('updatedEvent').innerHTML= event.type;
		});
    }
});
```


## Documentation
### Options
Below are the list of options

|Option | Default | Description|
|--- | --- | ---|
|`selector` | This is Mandatory | Gets the HTML tag by id to initiate the plugin at|
|`defaultDate` | `null` | Initiate the Date Spinner with a default date, e.g. 'Mar-15-1990'|
|`dateFormat` | MMM-DD-YYYY | Date format for the spinner. Other Example: 'M-D-YY'|
|`yearStart` | 1900 | This is the initial year from where you want the Year Spinner to start from.|

### Methods
Below are the list of methods

Method  | Description
--- | ---
`getDate()` |  Get the current Date
`setDate()` |  Set a new Date

### Events
Below are the list of events

Event  | Description
--- | ---
`onChange` | This is triggered every time user spins the Date Spinner
