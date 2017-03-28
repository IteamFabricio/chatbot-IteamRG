var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');
var app = express();
var contid;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var conversation_id = "";
var w_conversation = watson.conversation({
    url: 'https://gateway.watsonplatform.net/conversation/api',
    username: process.env.CONVERSATION_USERNAME || '09f5bd7b-8cdb-42c5-b3f9-bd7ca0b8718a',
    password: process.env.CONVERSATION_PASSWORD || 'OSofHHHz3Tvx',
    version: 'v1',
    version_date: '2017-02-03'
});
var workspace = process.env.WORKSPACE_ID || '5b821e1f-07b7-4525-b89b-7dad3deeb1e1';

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'EAAavPTKA4OcBAAbUWjwsJdur9B0qfZBZB8jdSHeo3EmRZCZCAMxeS6SqXfE23XeAl8DZCfTykRMYhap6VlCHvZCUYrl8I1Iv5ZAZC1Cl39eOgikSAvPtrCgeap8LdvcsNHxKQ5JjVN5pZCr4xqZAh4IdMmmhDxoVxtB9Ef1Vc99AjB9wZDZD') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Erro de validação no token.');
});

app.post('/webhook/', function (req, res) {
	var text = null;
	
    messaging_events = req.body.entry[0].messaging;
	for (i = 0; i < messaging_events.length; i++) {	
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;

        if (event.message && event.message.text) {
			text = event.message.text;
		}else if (event.postback && !text) {
			text = event.postback.payload;
		}else{
			break;
		}
		
		var params = {
			input: text,
			//context: {"conversation_id": conversation_id}
			context: contid
		}

		var payload = {
			workspace_id: "5b821e1f-07b7-4525-b89b-7dad3deeb1e1"
		};

		if (params) {
			if (params.input) {
				params.input = params.input.replace("\n","");
				payload.input = { "text": params.input };
			}
			if (params.context) {
				payload.context = params.context;
			}
		}
		callWatson(payload, sender);
    }
    res.sendStatus(200);
});

function callWatson(payload, sender) {
	w_conversation.message(payload, function (err, convResults) {
	console.log(convResults);
	contid=convResults.context;
        if (err) {
            return responseToRequest.send("Erro.");
        }
		
		if(convResults.context != null)
    	   conversation_id = convResults.context.conversation_id;
        if(convResults != null && convResults.output != null){
			var i = 0;
			while(i < convResults.output.text.length){
				sendMessage(sender, convResults.output.text[i++]);
			}
		}
            
    });
}

function sendMessage(sender, text_) {
	text_ = text_.substring(0, 319);
	 if (text_ == "ITRGTX001") {
        messageData = {

    }
    }else if(text_ == "ITRGAL001"){
		 messageData = {
			 attachment: {
			 "type":"image",
			 "payload":{
             "url":"http://3.bp.blogspot.com/-FRNL-lbo584/Tr60J_7hWhI/AAAAAAAAB-8/BPjBNj7fOCY/s1600/fastfood.png"	 
			 }
		    }
		 }	
	}else if(text_ == "ITRGES001"){
			messageData = { 
                  attachment:{
                        "type":"template",
                        "payload":{
                            "template_type":"generic",
                            "elements":[
                            {
                                "title":"Taxas",
                                "image_url":"https://gerencianet.com.br/wp-content/themes/Gerencianet/images/sprite_assinaturas.png",
                                "subtitle":"Informações sobre Taxas",
                                "default_action": {
                                "type": "web_url",
                                "url": "http://www.riogaleao.com/",
                                "messenger_extensions": true,
                                "webview_height_ratio": "tall",
                                },
                                "buttons":[
                                {
                                    "type":"web_url",
                                    "url":"http://www.riogaleao.com/",
                                    "title":"View Website"
                                }              
                                ]      
                            }
                            ]
                        }
                   }
    } 
    }else{
       messageData = { text: text_ } ; 
    }
	//messageData = {text: "opa" }; - Alteracao do parametro messageData de retorno para o Facebook

	request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

var token = "EAAavPTKA4OcBAAbUWjwsJdur9B0qfZBZB8jdSHeo3EmRZCZCAMxeS6SqXfE23XeAl8DZCfTykRMYhap6VlCHvZCUYrl8I1Iv5ZAZC1Cl39eOgikSAvPtrCgeap8LdvcsNHxKQ5JjVN5pZCr4xqZAh4IdMmmhDxoVxtB9Ef1Vc99AjB9wZDZD";
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 3000);
app.listen(port, host);
