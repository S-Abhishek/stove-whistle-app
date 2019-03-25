#include <Servo.h>

// For servo
Servo myservo;
int currpos = 0;

int data1 = 0;

// IP values
uint8_t ip0 = 0;
uint8_t ip1 = 0;
uint8_t ip2 = 0;
uint8_t ip3 = 0;

// For whistle detect
long a1,a2,a3,b1,b2,b3;
int whistle_count = 0;
int is_counting = 0;
unsigned long t2 = 0 ,t1 = 0;

// For temp detect
int ThermistorPin = A3;
int Vo;
float R1 = 10000;
float logR2, R2, T, Tc, Tf;
float c1 = 1.009249522e-03, c2 = 2.378405444e-04, c3 = 2.019202697e-07;
int MAX_TEMP = 35;

void setup() {
  //Serial Begin at 9600 Baud 
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial1.begin(115200);

  // Servo pin
  myservo.attach(9);
  myservo.write(currpos);  
  
  // Whistle mic
  pinMode(A1,INPUT);
  
  // Fan
  pinMode(A0,OUTPUT);
  getIP();
}

void getIP(){
  Serial.println("Getting IP of 8266");

  while((data1 = Serial1.read()) != 178)
    if(data1 != -1)
      Serial.write(data1);
  while((data1 = Serial1.peek()) == -1);
  ip0 = Serial1.read();
  Serial.println(ip0);
  delay(10);
  while((data1 = Serial1.peek()) == -1);
  ip1 = Serial1.read();
  Serial.println(ip1);
  delay(10);
  while((data1 = Serial1.peek()) == -1);
  ip2 = Serial1.read();
  Serial.println(ip2);
  delay(10);
  while((data1 = Serial1.peek()) == -1);
  ip3 = Serial1.read();
  Serial.println(ip3);
}

int handleMessages(){
//  Serial.println("[Checking msg]");
  uint8_t num_tries = 5;
  uint8_t data, data1, action, info; 
  for(uint8_t i = num_tries; i > 0; i--){

    if((data = Serial1.peek()) != 255 ){
      while((data = Serial1.peek()) != 255  && (data1 = Serial1.read())/100 == 1)
      {
          data1 = data1 % 100;
          action = data1/10;
          info = data1%10;
          switch(action)
          {
            case 0:
              Serial.print("Start counting to ");
              Serial.println(info);
              is_counting = 1;
              whistle_count = info;
              break;

            case 1:
              Serial.println("Stop counting");
              is_counting = 0;
              whistle_count = 0;
              break;
            
            case 2:
              Serial.println("Turning stove off");
              turn_stove_off();
              break;

            case 3:
              Serial.println("Turning stove to sim");
              turn_stove_sim();
              break;

          }
      }
      break;
    }
    delay(100);
  }
}

int whistle_detect1(){

  unsigned long sum1 = 0, sum2 = 0, sum3 = 0, b = 0;
  for(int i = 0; i < 5; i++){
    b = 1000000/(2*pulseIn(A1,HIGH));
    if(b < 30000)
      sum1 += b;
  }

  sum1 /= 5;
  delay(200);
  
  for(int i = 0; i < 5; i++){
    b = 1000000/(2*pulseIn(A1,HIGH));
    if(b < 30000)
      sum2 += b;
  }

  sum2 /= 5;
  delay(200);
  
  for(int i = 0; i < 5; i++){
    b = 1000000/(2*pulseIn(A1,HIGH));
    if(b < 30000)
      sum3 += b;
  }

  sum3 /= 5;

  Serial.print(sum1);
  Serial.print(" ");
  Serial.print(sum2);
  Serial.print(" ");
  Serial.println(sum3);
  
  sum1 = (sum1 + sum2 + sum3)/3;
  Serial.print("[Freq] ");
  Serial.println(sum1);
  if(sum1 >= 9000){
    t2 = millis();
    if(t2 - t1 > 15000){
      t1 = millis();
      Serial.println("Whistle");
      return 1;
    }
    else{
      Serial.println("Same whistle");
    }
  }
  return 0;
}


int whistle_detect(){
  
  a1 = pulseIn(A1,HIGH);
  delay(500);
  
  a2 = pulseIn(A1,HIGH);
  delay(500);
  
  a3 = pulseIn(A1,HIGH);
  delay(500);

  b1 = 1000000/(2*a1);
  b2 = 1000000/(2*a2);
  b3 = 1000000/(2*a3);

  Serial.print("[Whistle Freq] ");
  Serial.print(b1);
  Serial.print(" ");
  Serial.print(b2);
  Serial.print(" ");
  Serial.println(b3);

  if(b1 > 6000 && b1 < 15000 && b2 > 6000 && b2 < 18000 && b3 > 6000 && b3 < 18000){ 
    
    t2 = millis();
    if((t2-t1) >= 10000)
    {
      t1 = millis();
      Serial.println("WHISTLE DETECTED!!");
      Serial.print("Whistle Count:");
      Serial.println(++whistle_count);
      return 1;
    }
    else
    {
      Serial.println("Same Whistle only");
    } 
  }

  return 0;
}

int is_temp_high(){
  Vo = analogRead(A3);
  R2 = R1 * (1023.0 / (float)Vo - 1.0);
  logR2 = log(R2);
  T = (1.0 / (c1 + c2*logR2 + c3*logR2*logR2*logR2));
  Tc = T - 273.15;

//  Serial.print("[TEMP] ");
//  Serial.println(Tc);
  return Tc > MAX_TEMP;
}

void turn_fan_on(){
//  Serial.println("Turning on Fan becoming too hot");
  analogWrite(A0,1024);
}

void turn_fan_off(){
//  Serial.println("Fan off");
  analogWrite(A0,0);
}

void sendMsg(uint8_t msg){
  handleMessages();
  Serial1.write(msg);
}

void turn_stove_off(){
  Serial.println("Turning stove off");
  for (int pos = currpos + 1; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
}

void turn_stove_sim(){
  Serial.println("Turning stove to sim");
  for (int pos = currpos; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
}

void loop() {
  handleMessages();
  if(whistle_detect1()){
    if(is_counting){
      whistle_count--;
      if(whistle_count == 0){
        is_counting = 0;
        Serial.println("zero");
        turn_stove_off();
      }
      sendMsg(200);
    } 
  }
  if(is_temp_high()){
    turn_fan_on();
    sendMsg(210);
  }
  else{
    turn_fan_off();
  }
}
