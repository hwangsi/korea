---
name: "conflict-korea-remake"
description: "Conflict: Korea (SSI 1992) 웹 리메이크 프로젝트 작업 규칙. korea 폴더에서 원본 역공학(KOREA.EXE 심볼, 디스어셈블, DAT/LBM 포맷), 데이터 추출, TypeScript 웹 클라이언트, 규칙 엔진, 한글화, 프로토타입 검증을 할 때 사용."
---

# Conflict: Korea 리메이크

## 시작 순서

1. `remake/docs/HANDOFF.md`를 읽고 "현재 상태"와 "다음 작업"을 기준으로 진행한다.
2. 포맷·역공학 사실은 `remake/docs/original-format.md`, 코딩 규칙은 루트 `AGENTS.md`를 따른다.
3. `remake/data/extracted/`가 없으면 먼저 추출한다 (아래 명령).

## 명령 (Aside 샌드박스에서는 Node 플래그 필수)

```
cd <프로젝트>/remake
node --preserve-symlinks --preserve-symlinks-main tools/extract/extract.ts
node --preserve-symlinks --preserve-symlinks-main tools/disasm/dis.cjs MOVE_COST
node --preserve-symlinks --preserve-symlinks-main tools/disasm/dis.cjs --all
node --preserve-symlinks --preserve-symlinks-main tools/build.mjs
node --preserve-symlinks --preserve-symlinks-main --test --test-isolation=none "tests/**/*.test.ts"
node --preserve-symlinks --preserve-symlinks-main tools/disasm/dis.cjs --at MOVEUNIT 32dc 3700   # 중첩 함수 등 임의 구간
```

- `node --test`를 격리 모드(기본)로 돌리면 샌드박스에서 멈춘다. `--test-isolation=none` 필수.
- 작업 폴더가 이미 `remake`인 경우가 많다(`AsideWorkspace:\`). `cd`가 권한 오류를 내면 그대로 실행한다.
- REPL에서 `import` 문자열이 들어간 코드를 파일로 쓰면 "External modules" 오류가 난다. 임시 스크립트는 `write_file`로 만든다.

추출 출력에 `check: NKPA 50/15 ... -> OK`가 있어야 정상이다.

## 화면 검증

샌드박스는 루프백 네트워크를 막아 개발 서버에 접속할 수 없다. 대신:

1. `tools/build.mjs`로 `dist/standalone.html`을 만든다.
2. REPL에서 `openTab('about:blank')` 후 `document.open(); document.write(html); document.close()`로 띄운다.
3. `window.__app.view` (centerOn, zoomAt, selected, invalidate), `window.__app.load(id)`로 상태를 바꾸고 전체 페이지 스크린샷으로 확인한다. 캔버스 요소만 찍으면 비어 보일 수 있다.
   마우스 조작은 `__app.click(x, y)`, `__app.hover(x, y)`, `__app.cancel()`, `__app.undo()`, 상태는 `__app.game`, `__app.orders`.
   `locator.screenshot`과 `clip`은 document.write 페이지에서 엉뚱한 영역을 찍는다. 전체 스크린샷을 쓴다.
4. 같은 탭에 다시 쓰지 말고 새 탭을 연다.

## 역공학 절차

1. `data/extracted/symbols.json`에서 기능 관련 프로시저를 찾는다 (HANDOFF.md 6장 표 참고).
2. `dis.cjs <PROC>`로 읽는다. 전역변수, 호출 대상, 문자열 리터럴에 주석이 붙는다.
3. 매뉴얼 PDF의 해당 절과 부록 F 공식으로 교차 확인한다.
4. 결론을 `remake/docs/rules/<주제>.md`에 근거(프로시저 주소, 매뉴얼 절)와 함께 남긴 뒤 `src/engine/`에 구현한다.

## 환경 주의

- `write_file`은 기존 파일을 덮어쓰지 못한다. 수정은 `edit_file`, 전체 교체는 REPL `fs.rm` 후 새로 쓴다.
- PowerShell `Remove-Item`은 F:\ 루트 권한 문제로 실패할 수 있다. REPL `fs.rm`을 쓴다.
- git 명령은 샌드박스에서 실패할 수 있다. 커밋은 사용자에게 안내한다.

## 마무리

- 작업이 끝나면 HANDOFF.md의 "마지막 갱신", "현재 상태", "다음 작업", "미해결 질문"을 갱신한다.
- 원본 게임 파일, 매뉴얼, `data/extracted`, `dist`는 공개 저장소에 올리지 않는다.
