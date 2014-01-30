/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var currentValue;


function locationBlurSetting(option) {

    var setting = option.value;

    console.log("the setting selected is: " + setting);

    switch (setting)
    {
	case "Exact" :
	    alert('Exact');
	    break;
	case "City" :
	    alert('City');
	    break;
	case "Country" :
	    alert('Country');
	    break;
	case "Random" :
	    alert('Random');
	    break;
	default:
	    alert('Exact');
	    break;
    }; 
}