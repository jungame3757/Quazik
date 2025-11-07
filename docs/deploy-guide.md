## 환경별 핵심 명령어 모음 (Prod/Test)

사전 준비(최초 1회)
```bash
firebase login
firebase use --add   # default=quizshow-8ded7, test=quazik-test
```

빌드
```bash
# 테스트
npm run build:test
# 프로덕션
npm run build:prod
```

호스팅 배포
```bash
# 테스트 프로젝트 호스팅 배포
npm run deploy:host:test

# 프로덕션 호스팅 배포
npm run deploy
```

Functions 배포
```bash
# 테스트
npm run deploy:functions:test
# 프로덕션
npm run deploy:functions:prod
```

규칙/인덱스/RTDB 배포
```bash
# 테스트
npm run deploy:rules:test
# 프로덕션
npm run deploy:rules:prod
```

로컬 실행(선택)
```bash
# 테스트 변수로 실행
npm run dev:test
# 프로덕션 변수로 실행
npm run dev:prod
```