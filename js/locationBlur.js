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
	    console.log('Exact');
	    break;
	case "City" :
	    console.log('City');
	    break;
	case "Country" :
	    console.log('Country');
	    break;
	case "Random" :
	    console.log('Random');
	    break;
	default:
	    console.log('Exact');
	    break;
    }; 
}
