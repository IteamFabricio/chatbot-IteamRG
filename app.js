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
function RespostaPadrao() {
    sendMessage(sender,"Caso não tenha encontrado o retaurante ou lanchonete a lista, acesse o link http://www.riogaleao.com/places-categories/alimentacao/ para mais opções. Posso lhe auxiliar em algo mais?");
}


function sendMessage(sender, text_) {
	text_ = text_.substring(0, 319);
	 if (text_ == "ITRGTX001") {
        messageData = {

    }
}else if(text_ == "IT_LISTFASTFOOD"){
        sendMessage(sender,"Possuo algumas destas opções de Fast Food:");
		//Montando a lista de fast Food
         messageData = {
             attachment:{
                        "type":"template",
                        "payload":{
                            "template_type":"generic",
                            "elements":[
                            {
                                "title":"Fast Food",
                                "image_url":"http://i.imgur.com/aMuP7CL.png",
                                "subtitle":"Bobs RioGaleao",
                                "buttons":[
                                {
                                    "type":"web_url",
                                    "url":"http://www.riogaleao.com/places-categories/alimentacao/",
                                    "title":"Guia Aeroporto Alimentação"
                                }            
                                ]      
                            },{
                             "title":"Fast Food",
                                "image_url":"http://i.imgur.com/eFs5bzx.png",
                                "subtitle":"Subway",
                                "buttons":[
                                {
                                    "type":"web_url",
                                    "url":"http://www.riogaleao.com/places-categories/alimentacao/",
                                    "title":"Guia Aeroporto Alimentação"
                                }                
                                ]    
                            },
                            {
                             "title":"Fast Food",
                                "image_url":"http://i.imgur.com/2Q39uEd.png",
                                "subtitle":"MCDonalds",
                                "buttons":[
                                {
                                    "type":"web_url",
                                    "url":"http://www.riogaleao.com/places-categories/alimentacao/",
                                    "title":"Guia Aeroporto Alimentação"
                                }
                                ]    
                            }
                            ]
                        }
             }             
        }
    setTimeout(RespostaPadrao, 6000);   	
	//Fim validação do fastFood
   }else if(text_ == "ITRGES001"){
			messageData = { 
                  attachment:{
                        "type":"template",
                        "payload":{
                            "template_type":"generic",
                            "elements":[
                            {
                                "title":"Tarifas",
                                "image_url":"https://www.clinks.com.br/wp-content/uploads/2013/05/anunciar-passagens-aereas-rede-display.png",
                                "subtitle":"Informações sobre Tarifas",
                                //"default_action": {
                                //"type": "web_url",
                                //"url": "http://www.riogaleao.com/",
                                //"messenger_extensions": true,
                                //"webview_height_ratio": "tall",
                                //}
                                "buttons":[
                                {
                                    "type":"web_url",
                                    "url":"http://www.riogaleao.com/institucional/tarifas/",
                                    "title":"Abrir Website"
                                },
                                {
                                    "type":"postback",
                                    "payload":"IT_TAXAS_TARIFAS",
                                    "title":"Duvidas Tarifas"
                                }               
                                ]      
                            },{
                             "title":"Estacionamento",
                                "image_url":"http://www.hotelalecrimcaxias.com.br/images/touch-icon-windowsphone.png",
                                "subtitle":"Preços e Informações",
                                //"default_action": {
                                //"type": "web_url",
                                //"url": "http://www.riogaleao.com/",
                                //"messenger_extensions": true,
                                //"webview_height_ratio": "tall",
                                //}
                                "buttons":[
                                {
                                    "type":"web_url",
                                    "url":"http://www.riogaleao.com/transportes-e-estacionamento/estacionamento/",
                                    "title":"Estacionamento Website"
                                },
                                {
                                    "type":"postback",
                                    "payload":"IT_TAXAS_ESTACIONAMENTO",
                                    "title":"Duvidas Estacionamento"
                                }                
                                ]    
                            },
                            {
                             "title":"Companhias Aéreas",
                                "image_url":"http://icon-icons.com/icons2/290/PNG/512/flight_30822.png",
                                "subtitle":"Duvidas Sobre Cia Aéreas",
                                //"default_action": {
                                //"type": "web_url",
                                //"url": "http://www.riogaleao.com/",
                                //"messenger_extensions": true,
                                //"webview_height_ratio": "tall",
                                //}
                                "buttons":[
                                {
                                    "type":"web_url",
                                    "url":"http://www.riogaleao.com/places-categories/companhias-aereas/",
                                    "title":"Cia Aéreas Website"
                                },
                                {
                                    "type":"postback",
                                    "payload":"IT_TAXAS_CIAAREA",
                                    "title":"Duvidas Cia Aéreas"
                                } 
                                ]    
                            }
                            ]
                        }
                   }
    } 
    }else if(text_ == "IT_LISTFASELFSERVICE"){
     
        sendMessage(sender,"Possuo algumas destas opções de Self Serviçe:");
		//Montando a lista de Self Serviçe
         messageData = {
             attachment:{
                        "type":"template",
                        "payload":{
                            "template_type":"generic",
                            "elements":[
                            {
                                "title":"Restaurantes",
                                "image_url":"http://i.imgur.com/I151KIH.png",
                                "subtitle":"Divino Fogão",
                                "buttons":[
                                {
                                    "type":"web_url",
                                    "url":"http://www.riogaleao.com/places-categories/alimentacao/",
                                    "title":"Guia Aeroporto Alimentação"
                                }            
                                ]      
                            },{
                             "title":"Restaurantes",
                                "image_url":"http://i.imgur.com/bY7kUCk.png",
                                "subtitle":"Demoiselle",
                                "buttons":[
                                {
                                    "type":"web_url",
                                    "url":"http://www.riogaleao.com/places-categories/alimentacao/",
                                    "title":"Guia Aeroporto Alimentação"
                                }                
                                ]    
                            },
                            {
                             "title":"Restaurantes",
                                "image_url":"http://i.imgur.com/7TUovGo.png",
                                "subtitle":"Delírio Tropical",
                                "buttons":[
                                {
                                    "type":"web_url",
                                    "url":"http://www.riogaleao.com/places-categories/alimentacao/",
                                    "title":"Guia Aeroporto Alimentação"
                                }
                                ]    
                            }
                            ]
                        }
             }             
        }
    setTimeout(RespostaPadrao, 6000);   
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
