### 카프카 consumer group test
1. create kafka consumer group
  kafka.consumer({ groupId: 'test-group' })
2. create one more 1.
3. console.log group member message process no?
4. create producer
5. run producer repeatedly and confirm consumer

분산처리를 하려면 특정 topic을 처리하는 consumer를 여러개 만들어야 하는데
같은 groupId 인스턴스를 여러개 실행하면 될 줄 알았는데 그렇지 않았다.
어떻게 처리할까?

### API Gateway
- http server 생성
- 절차
사용자 요청을 받아서 distributor에 요청
  1. 사용자 요청
  2. gate에서 produce 로 topic 처리 요청
  3. service에서 topic 요청 consume
  4. service 처리
  5. service에서 topic 처리 응답 produce
  6. gate에서 응답 consume
  7. 사용자에게 결과 응답
- 필요객체
    - topic service별 producer처리
    - topic 응답 consume
  - producer
    카프카 인스턴스
  - consumer
    group으로 생성해야 하니 server수준 결정으로만 받아온다.

