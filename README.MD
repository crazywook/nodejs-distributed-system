# 개요
다양한 분산처리 시도를 해본다.

### kafka
- kafka 실행  
  3.4이상에서 주키퍼없이 실행가능해서 없이 실행한다.
  kraft라는 폴더에 있는 설정을 이용하면 된다.  
  맥 기준
  ```
    kafka-start /opt/homebrew/Cellar/kafka/3.4.0/libexec/config/kraft/server.properties
  ```

- partion 늘리기
  ```shell
    kafka-topics --bootstrap-server localhost:9092 --alter --topic test-topic --partitions 3
  ```
  확인
  ```shell
    kafka-topics --bootstrap-server localhost:9092 --describe --topic test-topic
  ```

  consumer를 파티션 개수만큼 늘릴 수 있다.  
  ex) node src/kafka/consumer.js  
  같은 groupId는 라운드로빈 방식으로 로드밸런싱한다.

- API gateway
  구현 중

### clustering
