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
