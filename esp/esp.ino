#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsServer.h>
#include <Hash.h>

ESP8266WiFiMulti WiFiMulti;

WebSocketsServer webSocket = WebSocketsServer(81);

char msgbuf[2];
int is_connected = 0;

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    delay(1);
    switch(type) {
        case WStype_DISCONNECTED:
            if(num == 0)
              is_connected = 0;
            break;
        case WStype_CONNECTED:
                if(num == 0){
                  
                  is_connected = 1;
        				  webSocket.sendTXT(num, "Connected");
                }
            break;
        case WStype_TEXT:
            
            if( length == 2 ){
              uint8_t msg = 100 + 10*(payload[0] - '0') + payload[1] - '0';
              handleMessages();
              Serial.write(msg);
            }
            break;
    }

}

int handleMessages(){
  delay(1);
  uint8_t num_tries = 5;
  uint8_t data, data1; 
  for(uint8_t i = num_tries; i > 0; i--){

    if((data = Serial.peek()) != 255 ){
      while((data = Serial.peek()) != 255  && (data1 = Serial.read())/100 == 2)
      {
        if(is_connected)
          { 
            data1 = data1%100;
            sprintf(msgbuf, "%d%d", data1/10, data1%10);
            webSocket.sendTXT(0, msgbuf);
          }
      }
      break;
    }
    delay(100);
  }
}

void setup() {
    Serial.begin(115200);
    Serial.setDebugOutput(false);
    delay(10);
    system_set_os_print(0);
    delay(10);

    for(uint8_t t = 4; t > 0; t--) {
        delay(1000);
    }

    WiFiMulti.addAP("Chendur", "Welcome@321");

    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }

    IPAddress ip = WiFi.localIP();
    Serial.write(178);
    delay(10);
    Serial.write(ip[0]);
    delay(10);
    Serial.write(ip[1]);
    delay(10);
    Serial.write(ip[2]);
    delay(10);
    Serial.write(ip[3]);
    delay(100);
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
}

void loop() {
    webSocket.loop();
    handleMessages();
}
