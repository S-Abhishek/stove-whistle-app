int data1 = 0;

// IP values
uint8_t ip0 = 0;
uint8_t ip1 = 0;
uint8_t ip2 = 0;
uint8_t ip3 = 0;

// For whistle detect
long a1,a2,a3,b1,b2,b3;
int whistle_count = 0;
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

  // Whistle mic
  pinMode(A1,INPUT);
  
  // Fan
  pinMode(A0,OUTPUT);
  getIP();
}

void getIP(){
  Serial.println("Getting IP of 8266");
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
  Serial.println("[Checking msg]");
  uint8_t num_tries = 5;
  uint8_t data, data1; 
  for(uint8_t i = num_tries; i > 0; i--){

    if((data = Serial1.peek()) != 255 ){
      while((data = Serial1.peek()) != 255  && (data1 = Serial1.read())/100 == 1)
      {
          Serial.println(data1);
      }
      break;
    }
    delay(100);
  }
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

  Serial.print("[TEMP] ");
  Serial.println(Tc);
  return Tc > MAX_TEMP;
}

void turn_fan_on(){
  Serial.println("Turning on Fan becoming too hot");
  analogWrite(A0,1024);
}

void turn_fan_off(){
  Serial.println("Fan off");
  analogWrite(A0,0);
}

void sendMsg(uint8_t msg){
  handleMessages();
  Serial1.write(msg);
}

void loop() {
  handleMessages();
  if(whistle_detect()){
    sendMsg(210);
  }
  if(is_temp_high()){
    turn_fan_on();
    sendMsg(211);
  }
  else{
    turn_fan_off();
  }
}
