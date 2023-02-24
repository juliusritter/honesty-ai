// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import wixData from 'wix-data';

let inputTextBox = $w("#textBox1");
let outputMessage = $w("#text22");
let textNumberOfWords = $w("#textNumberWords");
let arrow01 = $w("#vectorImage1");
let arrow02 = $w("#vectorImage2");
let arrow03 = $w("#vectorImage3");
let arrow04 = $w("#vectorImage4");
let arrow05 = $w("#vectorImage5");
let arrow06 = $w("#vectorImage6");
let arrow07 = $w("#vectorImage7");
let arrow08 = $w("#vectorImage8");
let arrow09 = $w("#vectorImage9");
let arrow10 = $w("#vectorImage10");
let icon1 = $w("#vectorImage11");
let icon2 = $w("#vectorImage12");
let icon3 = $w("#vectorImage13");


$w.onReady(function () {

	// Write your Javascript code here using the Velo framework API

	$w("#buttonCheckText").onClick( (event) => {
		$w("#buttonCheckText").label = "Checking Text...";
		$w('#text22').text = "Checking..."
		let req = new XMLHttpRequest();
		req.open('GET', 'https://ignis-apps.com/check?' + inputTextBox.value, true);
		req.onreadystatechange = () => {
			if (req.readyState !== 4) return;
			if (req.status !== 200) {
				update_graph(null);
				throw new Error("HTTP status: " + req.status);
			} else {
				let result = req.responseText;
				update_graph(result);
			}
			$w("#buttonCheckText").label = "Check Text";
		};
		req.send();
	} );

});

function update_graph(result) {
	//bar.style.backgroundColor = "#0006FF"
    if (result === null) {
        //bar.value = 50;
        outputMessage.text = 'Internal Server Error';
		$w("#buttonCheckText").label = "Check Text";
		updateArrow(1);
		updateIcon(3);
    } else {
        let percentage = result * 100;
		if(percentage >= 0 && percentage < 5) updateArrow(1);
		if(percentage >= 5 && percentage < 15) updateArrow(2);
		if(percentage >= 15 && percentage < 35) updateArrow(3);
		if(percentage >= 35 && percentage < 55) updateArrow(4);
		if(percentage >= 55 && percentage < 70) updateArrow(5);
		if(percentage >= 70 && percentage < 95) updateArrow(6);
		if(percentage >= 95 && percentage < 98) updateArrow(7);
		if(percentage >= 98 && percentage < 99) updateArrow(8);
		if(percentage >= 99 && percentage < 99.5) updateArrow(9);
		if(percentage >= 99.5 && percentage < 100) updateArrow(10);
		
		if(percentage >= 0 && percentage < 70) {
			outputMessage.text = `Likely Human`;
			updateIcon(1);
		}
		if(percentage >= 70 && percentage < 99) {
			outputMessage.text = `Maybe AI`;
			updateIcon(2);
		}
		if(percentage >= 99 && percentage < 100) {
			outputMessage.text = `Likely AI`;
			updateIcon(3);
		}
		textNumberOfWords.show();
		textNumberOfWords.text = `Raw Model Output: ${result}`;

		if($w('#checkbox1').checked){
			insertDataInHistory($w('#inputStudent').value, $w('#inputTitle').value, outputMessage.text, percentage);
		}

        //real_percentage.text = (100 * percentage).toFixed(0) + '%';
        //fake_percentage.text = (100 * (1 - percentage)).toFixed(0) + '%';
        //bar.value = 100 - (100 * percentage);
        //if (result.used_tokens === result.all_tokens) {
        //    outputMessage.text = `Evaluation based on ${result.used_tokens} words`;
        //} else {
        //    outputMessage.text = `Evaluation based on the first ${result.used_tokens} words among the total ${result.all_tokens}`;
        //}
    }
}

function updateArrow(number) {
	arrow01.hide();
	arrow02.hide();
	arrow03.hide();
	arrow04.hide();
	arrow05.hide();
	arrow06.hide();
	arrow07.hide();
	arrow08.hide();
	arrow09.hide();
	arrow10.hide();
	if(number == 1) arrow01.show();
	if(number == 2) arrow02.show();
	if(number == 3) arrow03.show();
	if(number == 4) arrow04.show();
	if(number == 5) arrow05.show();
	if(number == 6) arrow06.show();
	if(number == 7) arrow07.show();
	if(number == 8) arrow08.show();
	if(number == 9) arrow09.show();
	if(number == 10) arrow10.show();
}

function updateIcon(number) {
	icon1.hide();
	icon2.hide();
	icon3.hide();
	if(number == 1) icon1.show();
	if(number == 2) icon2.show();
	if(number == 3) icon3.show();
}

/**
*	Adds an event handler that runs when an input element's value
 is changed.
	[Read more](https://www.wix.com/corvid/reference/$w.ValueMixin.html#onChange)
*	 @param {$w.Event} event
*/
export function checkbox1_change(event) {
	if($w('#checkbox1').checked) {
		$w('#inputTitle').enable()
		$w('#inputStudent').enable()
	} else {
		$w('#inputTitle').disable()
		$w('#inputStudent').disable()
	}
}

function insertDataInHistory(student, title, result, resultRaw) {
	let toInsert = {
		"student" : student,
		"title": title,
		"result": result,
		"resultRaw": resultRaw
	};
	wixData.insert("History", toInsert).then((item) => {
		console.log(item); //see item below
	}).catch((err) => {
		console.log(err);
	});
}