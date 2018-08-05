const request = require("request");
const cheerio = require("cheerio");
const colors = require("colors");
 
var movieName =  ""; 
var spoiler_Time = "";

    // Checking For All Possible ways the programe might break or give weird results

if (process.argv.length<4) {
    console.log("\n\n Please Enter Movie name in Quotes first and then the time in seconds separated by a space, Thank you.\n")
    process.exit();
}
else if (parseInt(process.argv[3]) < 0  || parseInt(process.argv[2]) < 0)  {
    console.log("\n Please, Enter a positive number as I cant go back in time \n\n             Oh Wait Can I  ????? ;)")

        // Just Having Some Fun , Should never Do This In Practice; 
        // Stopping Time to Just Make someone smile;
    let starTime = Date.now();
    while((Date.now() - starTime) < 6000){
        // Empty Loop To Halt the Program for 6 Sec. So User Can Read the Above Message Properly
    }
    movieName = "Back To The Future"; // Taking You back in Time
    spoiler_Time = 60000;
}
else if (isNaN(parseInt(process.argv[3])) && !isNaN(parseInt(process.argv[2]))){  // Correcting Sequence if it is in reverse order
    movieName = process.argv[3];
    spoiler_Time = parseInt((process.argv[2])*1000);
}
else {
    movieName = process.argv[2];
    spoiler_Time = parseInt((process.argv[3])*1000);
}
    // Checking wheater user has entered a Name and A NUMBER, If user enters 2 string values it Gives a message.

if ((process.argv[3].charCodeAt() >=65 && process.argv[3].charCodeAt() <=122) && (process.argv[2].charCodeAt() >=65 && process.argv[2].charCodeAt() <=122)){
        console.log("\n\n              There should be At Least One Number and the Name should be in Quotes, Otherwise You will be stuck in a \n\n" + colors.red("                     *****************LIMBO*****************") + " \n \n               Oh Noooooo Wait You are Going in to a Limbo In 10 Sec")

    let starTime = Date.now();      // Just Having Some Fun , Should never Do This In Practice; 
                                    // Stopping Time to Just Make someone smile;
                                    
    while((Date.now() - starTime) < 10000){
        // Empty Loop To Halt the Program for 10 Sec. so user can read the above message
    }
    movieName = "Inception"; 
    spoiler_Time = 8880000;     // Just to Make the Program Stuck In a 148 min Limbo, Use (Control + C) to Exit
}


var url = "https://www.google.ca/search?q=" + movieName + " film";

tmdb(); // Calling The Main Function

function tmdb() {
    var options = { 
        method: 'GET',
        url: 'https://api.themoviedb.org/3/search/movie',
        qs: 
            {   include_adult : 'false',
                page: '1',
                query: movieName,
                language: 'en-US',
                api_key: '9fedd0c8b577f3ffc23a28a67e0a144d'
            },
        body: '{}' 
    };
    request(options, results_api);  
};


function google_results (){
    request(url, function (error, response ,body) {
    
        if (!error) {
            let headLines = [];
            let headingLinks = [];
            
            let $ = cheerio.load(body);
            
            $("h3.r>a").each(function(){
                headLines.push($(this).text());
                });
                
                // Using the Long Method to get Links from google as Direct Targeting of the Children () is not Working properly
                // so passing each children in a new variable which is lengthy but its Working 
                // user can click on it if they are using VSCode..... 

            $('h3').each(function(){
                let currentHeadline = $(this);
                let divS = currentHeadline.siblings();
                let divSChildren = divS.children();
                let divSGC = divSChildren.children();
                let link = $(divSGC[0]).text();
                
                if (link === ""){
                    headingLinks.push("Couldnt Find Any Links");  // Correcting where we dont get a proper link back
                    }
                else{
                    headingLinks.push(link);
                    }
            });
            
            console.log("\n Here Are the Headlines from latest Google search:\n");

            for (i=0; i<headLines.length; i++) { 

                    console.log((i+1) + "." + headLines[i]  + "\n" + "     " + headingLinks[i] + "\n");
                }
            }
        else {
                    console.log("We’ve encountered an error: " + error);
            }
    });
}

function results_api(error, response, body) {
    
    if (error) { throw new Error(error); } // just checking for Error
    
    var jsonBody = JSON.parse(body);
    
    if (jsonBody.total_results > 0){ // If Api returns Results then Run the rest of the Program
        
            console.log('\n***********Spoiler Warning********** \n We Will Be Spoiling the Plot of the Movie ' + movieName  + ' In ' + (spoiler_Time/1000) + ' Seconds \n');
        
        google_results();
        
        setTimeout(function(){
            console.log("\n ###########  SPOILERS AHEAD   ###########\n\n" + jsonBody.results[0].title + "  " + jsonBody.results[0].release_date + "\n\n" + jsonBody.results[0].overview + "\n");
            }, spoiler_Time);
    }
    else {
      console.log("No Movie By that name, Please Check Your Spelling");
      }
}


