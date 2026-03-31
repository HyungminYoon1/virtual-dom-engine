# 집중 루틴 보드 앱 기획서

## 1. 문서 목적

본 문서는 week5 v3 라이브러리 시연용 브라우저 앱인 `집중 루틴 보드`의 구현 기획안을 정리한다.
목표는 단순한 예제 페이지가 아니라, `Component + State + Hooks + Virtual DOM + Diff + Patch`가 실제로 잘 동작함을 청중 앞에서 설득력 있게 보여주는 것이다.

이 문서는 아래 내용을 다룬다.

- 어떤 화면을 만들 것인가
- 어떤 상태를 루트에 둘 것인가
- 어떤 컴포넌트로 나눌 것인가
- `useState`, `useEffect`, `useMemo`를 어디에 둘 것인가
- 발표에서 어떤 장면을 강조할 것인가

## 2. 앱 한 줄 정의

`집중 루틴 보드`는 사용자의 하루 집중 루틴을 관리하는 단일 페이지 앱이다.

앱은 아래 흐름을 제공한다.

- 오늘의 집중 목표 확인
- 루틴 추가
- 루틴 완료/미완료 토글
- 중요도와 상태에 따른 필터링
- 정렬 변경
- 요약 통계 확인
- 가벼운 애니메이션을 통한 상태 변화 강조

즉, 단순한 투두 리스트보다 시각적으로 흥미롭고, 과제의 핵심인 상태 변화와 컴포넌트 갱신도 풍부하게 보여줄 수 있는 주제다.

## 3. 왜 이 주제가 v3 시연에 적합한가

이 앱은 아래 이유로 v3 라이브러리 시연에 가장 적합하다.

- 루트 상태 하나가 여러 자식 컴포넌트에 동시에 반영된다.
- 리스트 추가, 삭제, 토글, 필터, 정렬이 모두 자연스럽게 들어간다.
- 루틴 카드 목록이 diff/patch의 효과를 설명하기 좋다.
- 통계와 필터 결과를 `useMemo`로 계산하기 좋다.
- 문서 제목, 저장 상태, 완료 개수 반영 등을 `useEffect`로 설명하기 쉽다.
- 카드 등장/사라짐, 진행률 변화 같은 가벼운 애니메이션을 넣어도 과하지 않다.

## 4. 화면 구성안

앱은 한 화면 안에서 아래 5개 영역으로 구성한다.

### 4.1 상단 Hero 영역

- 오늘의 집중 문구
- 현재 날짜 또는 오늘 루틴 안내
- 완료 개수 / 남은 개수 요약
- 진행률 바

이 영역은 루트 상태에서 계산한 요약 정보를 크게 보여주는 곳이다.
청중은 이 영역만 봐도 전체 상태가 어떻게 바뀌는지 바로 이해할 수 있어야 한다.

### 4.2 입력 패널

- 새 루틴 제목 입력
- 카테고리 선택
- 중요도 선택
- 추가 버튼

입력 패널은 form 관련 동작과 `input.value`, `select.value`, `submit` 흐름을 보여주는 핵심 영역이다.

### 4.3 필터 / 정렬 바

- 상태 필터: `전체 / 진행 중 / 완료`
- 중요도 필터: `전체 / 높음 / 보통 / 낮음`
- 검색 입력
- 정렬 선택: `생성순 / 중요도순 / 이름순`

이 영역은 `useMemo`의 존재 이유를 가장 잘 설명할 수 있는 부분이다.
원본 루틴 배열은 그대로 두고, 화면에 보여줄 파생 리스트만 계산한다.

### 4.4 루틴 보드 영역

아래 3개 섹션으로 보드를 나눈다.

- `Focus Now`: 우선순위가 높고 아직 완료되지 않은 루틴
- `In Progress`: 일반 진행 중 루틴
- `Done`: 완료된 루틴

각 섹션은 카드 리스트를 가진다.
카드는 다음 정보를 가진다.

- 제목
- 카테고리 배지
- 중요도 표시
- 완료 여부
- 생성 시각 또는 간단한 메타 정보
- 토글 버튼
- 삭제 버튼

이 영역은 v3 라이브러리에서 가장 중요한 `리스트 렌더링`, `key`, `patch`, `이벤트 처리`를 보여주는 핵심이다.

### 4.5 하단 인사이트 패널

- 오늘 완료율
- 카테고리별 개수
- 현재 검색 결과 개수
- 마지막 사용자 액션 요약

이 패널은 상태 변화가 카드 목록 외의 다른 자식 컴포넌트에도 동시에 반영된다는 점을 보여준다.

## 5. 시각 및 애니메이션 방향

애니메이션은 `살짝 들어간다` 수준으로 제한한다.
목표는 화려함이 아니라 상태 변화가 눈에 잘 띄게 하는 것이다.

권장 애니메이션은 아래와 같다.

- 새 카드 추가 시 짧은 fade + slide up
- 완료 토글 시 카드 opacity와 scale 미세 변화
- 진행률 바 너비 부드럽게 변경
- 필터 변경 시 카드 목록 전환에 짧은 transition

피해야 할 것은 아래와 같다.

- 복잡한 물리 애니메이션
- 지나치게 긴 전환
- 로직보다 시각 효과가 더 눈에 띄는 연출

## 6. 필요한 루트 상태 구조

v3는 루트 전용 상태 구조를 따르므로, 모든 상태는 루트 `App` 컴포넌트에 둔다.

권장 상태 구조 예시는 아래와 같다.

```js
const [routines, setRoutines] = useState([
  {
    id: "r1",
    title: "알고리즘 문제 2개 풀기",
    category: "study",
    priority: "high",
    done: false,
    createdAt: 1710000000000,
  },
]);

const [draftTitle, setDraftTitle] = useState("");
const [draftCategory, setDraftCategory] = useState("study");
const [draftPriority, setDraftPriority] = useState("medium");
const [statusFilter, setStatusFilter] = useState("all");
const [priorityFilter, setPriorityFilter] = useState("all");
const [searchKeyword, setSearchKeyword] = useState("");
const [sortMode, setSortMode] = useState("created");
const [lastAction, setLastAction] = useState("앱이 시작되었습니다.");
```

### 6.1 상태 역할

- `routines`
  - 앱의 핵심 원본 데이터
  - 추가, 삭제, 토글 대상
- `draftTitle`
  - 새 루틴 입력값
- `draftCategory`
  - 새 루틴 카테고리
- `draftPriority`
  - 새 루틴 중요도
- `statusFilter`
  - 완료 상태 필터
- `priorityFilter`
  - 중요도 필터
- `searchKeyword`
  - 검색 입력값
- `sortMode`
  - 정렬 기준
- `lastAction`
  - 최근 사용자 행동을 보여주는 발표용 보조 상태

## 7. 파생 데이터 구조

원본 상태 외에 화면용 파생 데이터는 `useMemo`로 계산한다.

권장 파생 데이터는 아래와 같다.

```js
const filteredRoutines = useMemo(() => {
  // 상태, 중요도, 검색어, 정렬 기준에 따른 최종 리스트 계산
}, [routines, statusFilter, priorityFilter, searchKeyword, sortMode]);

const doneCount = useMemo(() => {
  return routines.filter((item) => item.done).length;
}, [routines]);

const activeCount = useMemo(() => {
  return routines.length - doneCount;
}, [routines, doneCount]);

const progressPercent = useMemo(() => {
  if (routines.length === 0) return 0;
  return Math.round((doneCount / routines.length) * 100);
}, [routines, doneCount]);

const groupedBoard = useMemo(() => {
  // Focus Now / In Progress / Done 3개 섹션으로 그룹화
}, [filteredRoutines]);
```

## 8. 컴포넌트 분해안

v3 제약상 자식은 stateless component이므로, 아래와 같이 `props-only` 컴포넌트로 나눈다.

### 8.1 App

- 루트 컴포넌트
- 모든 state와 Hook 소유
- 이벤트 핸들러 정의
- 자식 컴포넌트에 상태와 핸들러를 props로 전달

### 8.2 BoardHero

- 제목
- 완료 개수
- 남은 개수
- 진행률 바

입력 props 예시:

- `totalCount`
- `doneCount`
- `activeCount`
- `progressPercent`

### 8.3 RoutineComposer

- 제목 입력
- 카테고리 선택
- 중요도 선택
- 제출 버튼

입력 props 예시:

- `draftTitle`
- `draftCategory`
- `draftPriority`
- `onTitleInput`
- `onCategoryChange`
- `onPriorityChange`
- `onSubmit`

### 8.4 FilterBar

- 상태 필터
- 중요도 필터
- 검색 입력
- 정렬 선택

입력 props 예시:

- `statusFilter`
- `priorityFilter`
- `searchKeyword`
- `sortMode`
- 각 변경 핸들러

### 8.5 BoardSection

- 섹션 제목
- 카드 목록
- 빈 상태 메시지

입력 props 예시:

- `title`
- `items`
- `emptyMessage`
- `onToggle`
- `onRemove`

### 8.6 RoutineCard

- 루틴 하나를 표현하는 카드
- 완료/삭제 버튼
- 카테고리/우선순위 배지

입력 props 예시:

- `routine`
- `onToggle`
- `onRemove`

### 8.7 InsightPanel

- 마지막 액션
- 총 개수 / 검색 결과 수
- 간단한 통계 텍스트

입력 props 예시:

- `lastAction`
- `visibleCount`
- `totalCount`
- `doneCount`

## 9. 이벤트 핸들러 설계안

모든 이벤트 핸들러는 루트 `App` 안에 둔다.

권장 핸들러는 아래와 같다.

- `handleTitleInput(event)`
- `handleCategoryChange(event)`
- `handlePriorityChange(event)`
- `handleStatusFilterChange(event)`
- `handlePriorityFilterChange(event)`
- `handleSearchInput(event)`
- `handleSortChange(event)`
- `handleSubmitRoutine(event)`
- `handleToggleRoutine(id)`
- `handleRemoveRoutine(id)`

### 9.1 핵심 액션 예시

루틴 추가:

```js
function handleSubmitRoutine(event) {
  event.preventDefault();

  if (!draftTitle.trim()) return;

  const nextRoutine = {
    id: String(Date.now()),
    title: draftTitle.trim(),
    category: draftCategory,
    priority: draftPriority,
    done: false,
    createdAt: Date.now(),
  };

  setRoutines((prev) => [nextRoutine, ...prev]);
  setDraftTitle("");
  setLastAction(`"${nextRoutine.title}" 루틴을 추가했습니다.`);
}
```

완료 토글:

```js
function handleToggleRoutine(id) {
  setRoutines((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    )
  );
}
```

삭제:

```js
function handleRemoveRoutine(id) {
  setRoutines((prev) => prev.filter((item) => item.id !== id));
}
```

## 10. Hook 사용 위치

### 10.1 useState

`useState`는 아래 상태에 사용한다.

- 루틴 원본 배열
- 입력 draft 값들
- 필터 값들
- 정렬 값
- 마지막 액션 메시지

이렇게 하면 루트 하나에서 상태가 어떻게 유지되고 여러 자식으로 흘러가는지 설명하기 좋다.

### 10.2 useEffect

`useEffect`는 아래 용도로 쓰는 것을 권장한다.

#### 문서 제목 갱신

```js
useEffect(() => {
  document.title = `집중 루틴 ${doneCount}/${routines.length}`;

  return () => {
    document.title = "Week5 React-like Runtime";
  };
}, [doneCount, routines.length]);
```

이 effect는 아래를 설명하기 좋다.

- 렌더 후 effect 실행
- dependency 변경 시 재실행
- cleanup 실행

#### 선택적 localStorage 저장

문서 범위상 필수는 아니지만, 발표 완성도를 높이고 싶다면 아래도 가능하다.

```js
useEffect(() => {
  localStorage.setItem("focus-routines", JSON.stringify(routines));
}, [routines]);
```

단, localStorage를 사용할 경우 과제 발표에서 "부가 효과"의 예시라는 점을 분명히 설명하는 것이 좋다.

### 10.3 useMemo

`useMemo`는 아래 계산에 쓰는 것이 가장 효과적이다.

- 필터 + 검색 + 정렬을 거친 최종 표시 리스트
- 완료 개수
- 진행률
- 보드 그룹화 결과

청중에게는 아래 식으로 설명하면 좋다.

- 원본 상태는 `routines`
- 화면에 보여주는 값은 계산된 파생 데이터
- 파생 계산은 렌더 때마다 무조건 새로 만들지 않고 `useMemo`로 재사용

## 11. 상태 변화가 잘 드러나는 시연 시나리오

시연은 아래 순서가 가장 좋다.

1. 앱 최초 진입
- Hero와 보드가 보인다.
- 초기 루틴 3~5개가 보인다.

2. 새 루틴 추가
- 입력 패널에 제목 입력
- 카테고리/중요도 선택
- 제출
- 새 카드가 가장 위에 나타난다.
- 완료율과 통계가 즉시 바뀐다.

3. 완료 토글
- 카드 하나를 완료 처리
- Hero 통계, 진행률 바, Done 섹션이 함께 바뀐다.

4. 검색과 필터 적용
- 특정 키워드 검색
- 상태를 `진행 중`으로 제한
- 정렬을 `중요도순`으로 변경
- 카드 목록이 재구성된다.

5. 삭제
- 카드 삭제
- 빈 섹션 처리나 통계 감소를 보여준다.

이 순서면 상태 변화가 여러 자식 컴포넌트에 동시에 퍼지는 장면이 잘 드러난다.

## 12. v3 라이브러리 검증 포인트

이 앱은 아래 항목을 자연스럽게 검증한다.

- 루트 상태 관리
- 자식 stateless component 구조
- `useState`
- `useEffect`
- `useMemo`
- 이벤트 처리
- form value 반영
- 리스트 렌더링
- key 기반 항목 갱신
- diff/patch에 의한 부분 DOM 갱신
- `unmount` 대비 effect cleanup 구조

즉, 이 앱 하나로 v3 문서의 핵심 대부분을 시연할 수 있다.

## 13. 구현 우선순위

앱 구현은 아래 순서로 진행하는 것이 좋다.

1. 정적 레이아웃과 컴포넌트 분해
2. 루트 상태와 기본 렌더 연결
3. 입력/추가/토글/삭제 이벤트 연결
4. 필터/검색/정렬 연결
5. `useMemo` 파생 데이터 연결
6. `useEffect` 문서 제목 또는 저장 효과 연결
7. 마지막으로 가벼운 애니메이션 추가

즉, 애니메이션은 마지막 단계다.
핵심은 어디까지나 상태와 렌더 파이프라인 검증이다.

## 14. 발표 때 강조할 메시지

발표에서는 아래 메시지가 가장 중요하다.

- 이 앱은 단순한 정적 페이지가 아니라, 루트 상태 하나가 여러 컴포넌트를 동시에 갱신하는 구조를 보여준다.
- 자식 컴포넌트는 모두 stateless component이며, 데이터와 핸들러는 루트에서 내려보낸다.
- 입력, 필터, 정렬, 토글, 삭제가 모두 Virtual DOM + Diff + Patch로 연결된다.
- `useEffect`는 렌더 이후 작업을 처리하고, `useMemo`는 파생 계산을 재사용한다.

## 15. 최종 권장 요약

`집중 루틴 보드 앱`은 아래 조건을 모두 만족한다.

- 너무 단순하지 않다.
- 너무 뻔한 일반 투두 앱보다 한 단계 더 흥미롭다.
- 상태 변화가 많아 시연에 유리하다.
- week5 v3 라이브러리의 구조적 강점을 자연스럽게 보여줄 수 있다.

따라서 본 프로젝트의 시연용 앱 주제로 적합하다.
