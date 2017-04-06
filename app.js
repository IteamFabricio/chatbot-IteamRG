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
    console.log('Opa #1');
    var text = null;

    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;

        if (event.message && event.message.text) {
            text = event.message.text;
        } else if (event.postback && !text) {
            text = event.postback.payload;
        } else {
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

        console.log('Opa #2');
        if (params) {
            if (params.input) {
                params.input = params.input.replace("\n", "");
                payload.input = { "text": params.input };
            }
            if (params.context) {
                payload.context = params.context;
            }
        }
        console.log('Opa #3');
        callWatson(payload, sender);
    }
    res.sendStatus(200);
});

function callWatson(payload, sender) {
    w_conversation.message(payload, function (err, convResults) {
        console.log(convResults);
        contid = convResults.context;
        var intents = convResults.intents;
        var entities = convResults.entities;
        var nodeVisited = convResults.output.nodes_visited[0];
        console.log("Node Visited: "+nodeVisited);
        if (intents && intents[0].intent == 'Cumprimentos') {
            var i = 0;
            sendMessage(sender, convResults.output.text[0]);
            while (i < convResults.output.text.length)
                setTimeout(sendMessageInitial, 2000, sender, convResults.output.text[i++]);
        } else if (intents && intents[0].intent == 'In_voo') {
            var i = 0;
            sendMessage(sender, convResults.output.text[0]);
            while (i < convResults.output.text.length)
                setTimeout(sendOptionsVoo, 2000, sender, convResults.output.text[i++]);
        } else if (nodeVisited && nodeVisited == 'GetNumVoo') {
            var i = 0;
            pesquisaVoo(sender, convResults.output.text[0]);
        }else if (intents && intents[0].intent == 'In_Alimentação') {
            var i = 0;
            categoriaestabelcimento(sender, convResults.output.text[0]);
        }else if (nodeVisited && nodeVisited == 'NodeFastFood') {
            var i = 0;
            geralistFastfood(sender, convResults.output.text[0]);
        }
        else {
            if (err) {
                return responseToRequest.send("Erro.");
            }

            if (convResults.context != null)
                conversation_id = convResults.context.conversation_id;
            if (convResults != null && convResults.output != null) {
                var i = 0;
                while (i < convResults.output.text.length) {
                    sendMessage(sender, convResults.output.text[i++]);
                }
            }
        }
    });
}
function geralistFastfood(sender,text_){
    messageData = {
        attachment: {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "McDonald's",
                        "image_url": "http://i.imgur.com/2Q39uEd.png",
                        "subtitle": "Terminal 2, 2º Andar /n Área restrita doméstico /n 06:00 às 23:00",
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": "http://www.riogaleao.com/guia-do-aeroporto/mapa-do-aeroporto/?id=3071_6231",
                                "title": "Veja no Mapa"
                            }
                        ]
                    }, {
                        "title": "Spoleto",
                        "image_url": "http://i.imgur.com/GHAjDsr.png",
                        "subtitle": "Terminal 2, 1º Andar - Mezanino /n Área pública n/ 06:00 às 00:00",
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": "http://www.riogaleao.com/guia-do-aeroporto/mapa-do-aeroporto/?id=1481_1471",
                                "title": "Veja no Mapa"
                            }                 
                        ]
                    },
                    {
                        "title": "Subway",
                        "image_url": "http://i.imgur.com/eFs5bzx.png",
                        "subtitle": "Terminal 2, 1º Andar - Mezanino! /n Área pública/Área restrita internacional/Área restrita doméstico /n 06:00 às 23:00",
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": "http://www.riogaleao.com/guia-do-aeroporto/mapa-do-aeroporto/?id=2441_2431",
                                "title": "Aérea Publica Mapa"
                            },
                            {
                                "type": "web_url",
                                "url": "http://www.riogaleao.com/guia-do-aeroporto/mapa-do-aeroporto/?id=2441_10611",
                                "title": "Aérea internacional Mapa"
                            },
                            {
                                "type": "web_url",
                                "url": "http://www.riogaleao.com/guia-do-aeroporto/mapa-do-aeroporto/?id=2441_11111",
                                "title": "Aérea Domestica Mapa"
                            }
                        ]
                    }
                ]
            }
        }
    }
    //setTimeout(RespostaPadrao, 5000);
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
function sendOptionsVoo(sender, text_) {
    messageData = {
        attachment: {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Escolha a opção:",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Número do Vôo",
                        "payload": "numero do voo"
                    },
                    {
                        "type": "postback",
                        "title": "Data do Vôo",
                        "payload": "data do voo"
                    },
                    {
                        "type": "postback",
                        "title": "Cia Aérea",
                        "payload": "cia area"
                    }
                ]
            }
        }
    }
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
}

function categoriaestabelcimento(sender, text_) {
    messageData = {
            attachment: {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Escolha a opção:",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Fast Food",
                        "payload": "fastfood"
                    },
                    {
                        "type": "postback",
                        "title": "Self Service",
                        "payload": "selfservice"
                    },
                    {
                        "type": "postback",
                        "title": "Lanchonete & Café",
                        "payload": "lanchonete"
                    }
                ]
            }
        }
    }
    //setTimeout(RespostaPadrao, 5000);
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

function sendMessageInitial(sender, text_) {
    messageData = {
        attachment: {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Consultar Vôo",
                        "image_url": "http://i.imgur.com/azFIsJG.png",
                        "subtitle": "Consulte seus voos por número, data ou cia aérea",
                        "buttons": [
                            {
                                "type": "postback",
                                "payload": "Consultar Vôo",
                                "title": "Consultar"
                            }
                        ]
                    }, {
                        "title": "Estabelecimentos",
                        "image_url": "http://i.imgur.com/5oDtZPw.png",
                        "subtitle": "Veja detalhes e localização dos estabelecimentos no RIOgaleão",
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": "https://algartelecom.com.br/medias-grandes-empresas/",
                                "title": "Link Estabelecimentos"
                            },
                            {
                                "type": "postback",
                                "payload": "consultar estabelecimentos",
                                "title": "Consultar"
                            }
                        ]
                    },
                    {
                        "title": "Promoções",
                        "image_url": "http://i.imgur.com/9RIhjYe.png",
                        "subtitle": "Não perca as promoções do RIOgaleão!",
                        "buttons": [
                            {
                                "type": "postback",
                                "payload": "Consultar Promoções",
                                "title": "Consultar"
                            }
                        ]
                    },
                    {
                        "title": "Reporte um problema",
                        "image_url": "http://i.imgur.com/9RIhjYe.png",
                        "subtitle": "Nos ajude a fazer um RIOgaleão ainda melhor!",
                        "buttons": [
                            {
                                "type": "postback",
                                "payload": "Reportar Problema",
                                "title": "Reportar"
                            }
                        ]
                    }
                ]
            }
        }
    }
    //setTimeout(RespostaPadrao, 5000);
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
function pesquisaVoo(sender, flightNumber) {
    messageData = {
        attachment: {
            "type": "template",
            "payload": {
                "template_type": "airline_update",
                "intro_message": "Segue os dados do seu vôo",
                "update_type": "delay",
               // "update_type": "confirmed",
                "locale": "pt_BR",
                "pnr_number": "CF23G2",
                "update_flight_info": {
                    "flight_number": flightNumber,
                    "departure_airport": {
                        "airport_code": "GIG",
                        "city": "Rio de Janeiro",
                        "terminal": "T4",
                        "gate": "G8"
                    },
                    "arrival_airport": {
                        "airport_code": "CNF",
                        "city": "Confins",
                        "terminal": "T4",
                        "gate": "G8"
                    },
                    "flight_schedule": {
                        "boarding_time": "2017-04-26T10:30",
                        "departure_time": "2017-04-26T11:30",
                        "arrival_time": "2017-04-27T07:30"
                    }
                }
            }
        }

    }

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
}
function RespostaPadrao() {
    sendMessage(sender, "Caso não tenha encontrado o retaurante ou lanchonete a lista, acesse o link http://www.riogaleao.com/places-categories/alimentacao/ para mais opções. Posso lhe auxiliar em algo mais?");
}


function sendMessage(sender, text_) {
    text_ = text_.substring(0, 319);
    if (text_ == "ITRGTX001") {
        messageData = {

        }
    } else {
        messageData = { text: text_ };
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
