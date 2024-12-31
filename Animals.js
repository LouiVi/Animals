
//Called when application is started.
async function OnStart()
{
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "Linear", "VCenter,FillXY" )

	//Create a text label and add it to layout.
	txt = app.CreateText( "Hello" )
	txt.SetTextSize( 32 )
	lay.AddChild( txt )
	
	//Add layout to app.	
	app.AddLayout( lay )
	await animal();
}

/*--****
-- === animal.ex
--
-- Guess the Animal game. It learns as you play.
--
-- ==== How it Works
--
-- animal.ex builds up a tree structure that tells it what
-- question to ask, and which branch to follow in the tree
-- depending on whether the answer is Yes or No.
*/

const node_type = 0;
const DESCRIPTION = 0;
const ANIMAL = 1;
const question = 1;
const when_true = 2;
const when_false = 3;

const TRUE = 1;
const FALSE = 0;
const KEYBOARD = 0;
const SCREEN = 1;

var database = new Array();
//-- initial database:
//--           record type     text         Y  N
//database = [ [],[ DESCRIPTION, "Can it fly", 2, 3],[ ANIMAL, "an eagle" ],[ ANIMAL, "a dog" ]];
database = JSON.parse(app.ReadFile( "database.json"));

var p, prev_p, prev_answer;

async function Yes() { //-- returns TRUE if the answer is yes
console.log(database);
//app.WriteFile( "database.json", JSON.stringify(database) );
	var answer;
	
	answer = '?';
	while(await answer == '?') {
		//answer = prompt("Yes or No"); //gets(KEYBOARD);
		if(answer.length > 0) {
			if(answer.split('')[0] == 'y' || answer.split('')[0] == 'Y') {
			//alert("true");
				answer = TRUE;
			} else if(answer.split('')[0] == 'n' || answer.split('')[0] == 'N') {
				answer = FALSE;
				//alert("false");
			} else {
				//answer = '?';
				//alert("??");
			}
		} else {
			//answer = '?';
			//alert("???");
		}
		if(answer == '?') {
			answer = prompt("\nPlease answer y or n: ");
			//puts(SCREEN, "\nPlease answer y or n: ")
		}
	}
	app.WriteFile( "database.json", JSON.stringify(database) );
	 return answer;
}

async function guess() { //-- narrows it down to one animal
console.log(database);
//app.WriteFile( "database.json", JSON.stringify(database) );
	while(await TRUE) {
	console.log(p);

		if(database[p][node_type] === ANIMAL) {
return;
		}
		//alert(database[p][question]);
		//printf(SCREEN, "\n%s? ", { database[p][question] })
		prev_p = p;
		if(await prompt(database[p][question] + '?') == Yes()) {
			p = database[p][when_true];
			prev_answer = when_true;
		} else {
			p = database[p][when_false];
			prev_answer = when_false;
		}
	}
	app.WriteFile( "database.json", JSON.stringify(database) );
}

async function animal() {
	//-- updates database of animal information
	console.log(database);
	//app.WriteFile( "database.json", JSON.stringify(database) );
	var newa, new_question, correct, answer;
	
	
	while(TRUE) {
		p = 1;
		quest = "\nThink of an animal. Enter the animal in the textbox or enter q to quit.";
		//printf(SCREEN, "%s\n",
			 //{ "\nThink of an animal. Hit <cr> when you are ready, q to quit" })
		answer = prompt(quest); //gets(KEYBOARD)
		if(answer.length > 0) {
			if(answer.split('')[0] === 'q') {
				return;
			}
		}
		await guess();
		
		//printf(SCREEN, "\n\tIs it %s? ", { database[p][question] })
		if(prompt("\n\tIs it " + database[p][question]) !== Yes()) {
			
                        //puts(SCREEN, "\nI give up. What was it? ")
			correct = prompt("\nI give up. What was it?");//gets(KEYBOARD)
			//correct = correct[1 .. length(correct) - 1];
			//database = append(database, { ANIMAL, correct });
      database.push([ ANIMAL, correct ]);
			newa = database.length;
			//printf(SCREEN, "\n%s%s%s%s\n",
			//	 { "Please give me a question that would distinguish ",
			//		database[p][question], " from ", correct })
			
			new_question = prompt("Please give me a question that would distinguish " + database[p][question] + " from " + correct); //'\t' & gets(KEYBOARD)
			//new_question = new_question[1 .. length(new_question) - 1];
			//alert(new_question[new_question.length-1]);
			if(new_question[new_question.length-1] === '?') {
			new_question = new_question.replace("?","");
			//alert("here");
				//new_question = new_question[1 .. //length(new_question) - 1];
			}
			//printf(SCREEN, "\nFor %s the answer would be: ", { correct });
			if(prompt("\nFor " + correct + " the answer would be: ") == Yes()) {
				database.push( [ DESCRIPTION, new_question, newa, p-1 ]);
			} else {
				database.push( [ DESCRIPTION, new_question, p-1, newa ]);
			}
			database[prev_p][prev_answer] = database.length-1;
		}
	}
	app.WriteFile( "database.json", JSON.stringify(database) )
}