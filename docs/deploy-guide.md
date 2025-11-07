## 환경별 실행/배포 명령어 가이드 (Prod/Test)

### 전제
- 환경 변수는 Vite 모드(`--mode <name>`)에 따라 `.env.<name>`를 로드합니다.
- `src/firebase/config.ts`는 `import.meta.env.VITE_*` 값을 우선 사용합니다.
- 현재 별칭:
  - `default` → 프로덕션 프로젝트(`quizshow-8ded7`)
  - `test` → 테스트 프로젝트(`quazik-test`)
  - 별칭은 `.firebaserc`에서 관리합니다.

### 환경변수 파일
- 프로덕션: `.env.production`
- 테스트: `.env.test`
- (선택) 개발: `.env.development`

필수 키(예시):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
# RTDB 사용 시 필수
VITE_FIREBASE_DATABASE_URL=https://<project>-default-rtdb.<region>.firebasedatabase.app
```

RTDB를 사용한다면 `VITE_FIREBASE_DATABASE_URL`를 반드시 환경별로 채워야 테스트/프로덕션 분리가 완전합니다.

---

## 로컬 실행

### 테스트 모드
```bash
npm run dev -- --mode test
```

### 프로덕션 변수로 실행(로컬)
```bash
npm run dev -- --mode production
```

(기본은 개발 모드: `npm run dev` → `.env.development`가 있으면 사용)

---

## 빌드

### 테스트 빌드
```bash
npm run build -- --mode test
```

### 프로덕션 빌드
```bash
npm run build -- --mode production
```

빌드 산출물은 `dist/`에 생성됩니다.

---

## 호스팅 배포

사전 준비:
- Firebase CLI 로그인/프로젝트 별칭 설정
```bash
firebase login
firebase use --add   # default(test) 별칭 추가/확인
```

### 테스트 호스팅 배포
```bash
npm run build -- --mode test
firebase deploy --project test --only hosting
```

### 프로덕션 호스팅 배포
```bash
npm run build -- --mode production
# 별칭 사용
firebase deploy --project default --only hosting
# 또는 프로젝트 ID 직접 지정
# firebase deploy --project quizshow-8ded7 --only hosting
```

`firebase.json`의 `hosting.public`은 `dist`로 설정되어 있습니다.

---

## Cloud Functions 배포

사전 준비:
- `functions/package.json`의 엔진은 Node 20 이상이어야 합니다.
  - 현재 설정: `"engines": { "node": "20" }`

### 테스트 프로젝트로 Functions 배포
```bash
npm --prefix functions run deploy -- --project test
```

### 프로덕션 프로젝트로 Functions 배포
```bash
npm --prefix functions run deploy -- --project default
# 또는
# npm --prefix functions run deploy -- --project quizshow-8ded7
```

---

## 보안 규칙/인덱스/RTDB 규칙 배포

### Firestore 규칙/인덱스 (테스트)
```bash
firebase deploy --only firestore:rules --project test
firebase deploy --only firestore:indexes --project test
```

### Firestore 규칙/인덱스 (프로덕션)
```bash
firebase deploy --only firestore:rules --project default
firebase deploy --only firestore:indexes --project default
```

### RTDB 규칙 (테스트)
```bash
firebase deploy --only database --project test
```

### RTDB 규칙 (프로덕션)
```bash
firebase deploy --only database --project default
```

규칙 파일 경로는 `firebase.json`에서 관리됩니다.

---

## 에뮬레이터(선택)

```bash
firebase emulators:start --only functions,firestore,database,hosting
```

---

## 트러블슈팅 체크리스트

- Functions 배포 에러: “Node.js 18 decommissioned…”
  - 해결: `functions/package.json` → `"engines": { "node": "20" }`

- “gcf-admin-robot” 인증/404 관련 에러
  - 테스트 프로젝트(GCP)에서 아래 API 활성화:
    - Cloud Functions / Cloud Run Admin / Cloud Build / Artifact Registry / Eventarc / IAM Service Account Credentials
  - Firebase 결제 플랜(BLAZE) 연결
  - API 활성화 후 1~3분 대기, 재시도

- 테스트 실행인데 실수로 프로덕션 RTDB에 쓰임
  - 원인: `.env.test`에 `VITE_FIREBASE_DATABASE_URL` 미설정
  - 해결: 테스트용 RTDB URL을 반드시 설정

- 별칭/프로젝트 매핑 확인
```bash
firebase projects:list
firebase use
firebase use --add
```

---

## 편의 스크립트(선택)
`package.json`에 아래 스크립트를 추가하면 명령이 짧아집니다.

```json
{
  "scripts": {
    "dev:test": "vite --mode test",
    "build:test": "vite build --mode test",
    "deploy:host:test": "npm run build:test && firebase deploy --project test --only hosting",

    "dev:prod": "vite --mode production",
    "build:prod": "vite build --mode production",
    "deploy:host:prod": "npm run build:prod && firebase deploy --project default --only hosting",

    "deploy:functions:test": "npm --prefix functions run deploy -- --project test",
    "deploy:functions:prod": "npm --prefix functions run deploy -- --project default",

    "deploy:rules:test": "firebase deploy --only firestore:rules,firestore:indexes,database --project test",
    "deploy:rules:prod": "firebase deploy --only firestore:rules,firestore:indexes,database --project default"
  }
}
```


