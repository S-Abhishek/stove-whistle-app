#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsServer.h>
#include <Hash.h>

ESP8266WiFiMulti WiFiMulti;

WebSocketsServer webSocket = WebSocketsServer(81);

#define USE_SERIAL Serial
char msgbuf[2];
int is_connected = 0;
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {

    switch(type) {
        case WStype_DISCONNECTED:
            USE_SERIAL.printf("[%u] Disconnected!\n", num);
            break;
        case WStype_CONNECTED:
            {
                IPAddress ip = webSocket.remoteIP(num);
        				// send message to client
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
            
            

            // send message to client
            // webSocket.sendTXT(num, "message here");

            // send data to all connected clients
            // webSocket.broadcastTXT("message here");
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
    // USE_SERIAL.begin(921600);
    USE_SERIAL.begin(115200);

//    Serial.setDebugOutput(true);
    Serial.setDebugOutput(false);
    delay(10);
    system_set_os_print(0);
    delay(10);

    for(uint8_t t = 4; t > 0; t--) {
        USE_SERIAL.flush();
        delay(1000);
    }

    WiFiMulti.addAP("Chendur", "Welcome@321");

    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }

    IPAddress ip = WiFi.localIP();
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
