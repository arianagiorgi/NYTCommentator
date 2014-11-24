$(document).ready(function(){

	// generate random comments
	$('#round-button').click(function(){
		getComments();
	});
	
	// Reload page when you click logo
	$('#title').click(function(){
		location.reload();
	});
});

// function to generate random comments
function getComments(){

	var api_key = '4459a4b71b0a40ed56b0ad41b46053c7:1:67738799';

	var message = {
		action: 'http://api.nytimes.com/svc/community/v2/comments/random.jsonp?api-key='+api_key,
		method: 'GET'
	};

	$.ajax({
		'url': message.action,
		//'data': parameterMap,
		'dataType': 'jsonp',
		'jsonCallback':'cb',
		'cache': true,
		'success': function(data, textStats, XMLHttpRequest){
			//console.log(data);

			// add and remove certain div fields
			$('.comments').remove();
			$('#round-button').remove();
			$('#instructions').remove();
			$('footer').remove();
			$('.toolbar').append('<div id="round-button"><div class="round-button-circle"><p>Random!</p></div></div>');
			$('body').append('<div class="comments"></div>');

			// loop through results to extract information
			for (var i = 0; i < 10; i++){
				var display_name = data['results']['comments'][i]['display_name'];
				var commentBody = data['results']['comments'][i]['commentBody'];
				var userComments = data['results']['comments'][i]['userComments'];
				var articleURL = data['results']['comments'][i]['articleURL'];

				// extract userid from userComments field
				var userid = userComments.substring(50);
				userid = userid.replace('.xml', '');

				var name = display_name.replace(' ','--');
				name = name.replace('.', '');
				name = name.replace("'","");

				// append the information into the comments section
				$('.comments').append('<h3>'+display_name+'</h3>');
				$('.comments').append('<p>'+commentBody+'<br><br>'+'In reference to the article available <a href="'+articleURL+'" target="_blank">here</a><br><br>'+
					'<a onclick="commentsByUser('+userid+', '+name+')">See more comments by this user</a><br><br>'+
					'Rate this user:'+
					'<input type="radio" name="rating" class="'+name+'" id="rating1" value="1">1 '+
					'<input type="radio" name="rating" class="'+name+'" id="rating2" value="2">2 '+
					'<input type="radio" name="rating" class="'+name+'" id="rating3" value="3">3 '+
					'<input type="radio" name="rating" class="'+name+'" id="rating4" value="4">4 '+
					'<input type="radio" name="rating" class="'+name+'" id="rating5" value="5">5 '+
					'<button class="ratebutton" id="'+name+'">Submit</button></p>');
			}

			// jQuery UI accordion feature
			$('.comments').accordion({collapsible: true, active: false});
			$('.ratings').show();

			// when they submit a rating, record it
			$('.ratebutton').click(function(){
				var user = this.id;

				for (var i=1; i<6; i++){

					if ( $('#rating'+i.toString()+'.'+user+'').is(':checked')){
						var rating = i;
					};
				};
				showRating(user, rating);
			});

			// if they click the button again, generate comments but leave ratings untouched
			$('#round-button').click(function(){
				getComments();
			});
	

		}


	});
}

// function to record rating
function showRating(user, rating){

	// if the user is already rated, update rating
	if ( $('#'+user+'rating').length ){
		$('#'+user+'rating').remove();
		var showname = user.replace('--',' ');
		$('.ratings').append('<p id="'+user+'rating">'+showname+': '+rating+'</p>');	

	} else {
		var showname = user.replace('--',' ');
		$('.ratings').append('<p id="'+user+'rating">'+showname+': '+rating+'</p>');	
	};


}


// function to filter comments by user
function commentsByUser(userid, name){

	var api_key = '4459a4b71b0a40ed56b0ad41b46053c7:1:67738799';

	var message = {
		action: 'http://api.nytimes.com/svc/community/v2/comments/user/id/'+userid+'.jsonp?sort=newest&api-key='+api_key,
		method: 'GET'
	};

	$.ajax({
		'url': message.action,
		'dataType': 'jsonp',
		'jsonCallback':'cb',
		'cache': true,
		'success': function(data, textStats, XMLHttpRequest){

			user = name.id;

			$('.comments').remove();
			$('body').append('<p id="info">Now showing comments by: '+user+'</p>');
			$('body').append('<div class="comments"></div>');

			// loop through results
			for (var i = 0; i < 10; i++){
				var commentBody = data['results']['comments'][i]['commentBody'];
				var approveDate = data['results']['comments'][i]['approveDate'];
				var articleURL = data['results']['comments'][i]['articleURL'];

				// convert date to day and time
				var utcSeconds = parseInt(approveDate);
				var date = new Date(0);
				date.setUTCSeconds(utcSeconds);

				date = date.toString();
				date = date.substring(0,15);

				// add comments to comment section
				$('.comments').append('<h3>'+date+'</h3>');
				$('.comments').append('<p>'+commentBody+'</p>');
			}

			$('.comments').accordion({collapsible: true, active: false});

		}
	});
}



