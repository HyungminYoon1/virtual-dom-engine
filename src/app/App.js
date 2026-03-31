/*
 * Responsibility:
 * - 집중 루틴 보드 앱의 루트 상태와 전체 화면 조합을 담당한다.
 * - v3 제약에 맞게 모든 상태와 Hook은 이 루트 컴포넌트 안에만 둔다.
 */

import { h, useEffect, useMemo, useState } from "../index.js";
import { BoardHero } from "./components/BoardHero.js";
import { RoutineComposer } from "./components/RoutineComposer.js";
import { FilterBar } from "./components/FilterBar.js";
import { BoardSection } from "./components/BoardSection.js";
import { InsightPanel } from "./components/InsightPanel.js";

const CATEGORY_LABELS = Object.freeze({
  study: "공부",
  coding: "코딩",
  health: "건강",
  life: "생활",
});

const PRIORITY_LABELS = Object.freeze({
  high: "높음",
  medium: "보통",
  low: "낮음",
});

const STATUS_LABELS = Object.freeze({
  all: "전체 상태",
  active: "진행 중",
  done: "완료",
});

const SORT_LABELS = Object.freeze({
  created: "생성순",
  priority: "중요도순",
  title: "이름순",
});

const PRIORITY_SCORE = Object.freeze({
  high: 3,
  medium: 2,
  low: 1,
});

const DEFAULT_ROUTINES = Object.freeze([
  {
    id: "routine-1",
    title: "알고리즘 문제 2개 풀기",
    category: "coding",
    priority: "high",
    done: false,
    createdAt: 1710000000000,
  },
  {
    id: "routine-2",
    title: "CS 요약 노트 복습",
    category: "study",
    priority: "medium",
    done: false,
    createdAt: 1710001000000,
  },
  {
    id: "routine-3",
    title: "스트레칭 20분",
    category: "health",
    priority: "low",
    done: true,
    createdAt: 1710002000000,
  },
  {
    id: "routine-4",
    title: "포트폴리오 문장 다듬기",
    category: "life",
    priority: "high",
    done: false,
    createdAt: 1710003000000,
  },
]);

function canUseLocalStorage() {
  return typeof localStorage !== "undefined";
}

function createRoutineId() {
  return `routine-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function parseStoredRoutines() {
  if (!canUseLocalStorage()) {
    return DEFAULT_ROUTINES.map((routine) => ({ ...routine }));
  }

  try {
    const rawValue = localStorage.getItem("focus-routines");

    if (!rawValue) {
      return DEFAULT_ROUTINES.map((routine) => ({ ...routine }));
    }

    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_ROUTINES.map((routine) => ({ ...routine }));
    }

    return parsed;
  } catch {
    return DEFAULT_ROUTINES.map((routine) => ({ ...routine }));
  }
}

function formatTodayLabel() {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date());
}

function sortRoutines(items, sortMode) {
  const nextItems = items.slice();

  nextItems.sort((left, right) => {
    if (sortMode === "title") {
      return left.title.localeCompare(right.title, "ko");
    }

    if (sortMode === "priority") {
      const priorityDelta = PRIORITY_SCORE[right.priority] - PRIORITY_SCORE[left.priority];

      if (priorityDelta !== 0) {
        return priorityDelta;
      }
    }

    return right.createdAt - left.createdAt;
  });

  return nextItems;
}

function filterRoutines(items, filters) {
  const normalizedKeyword = filters.searchKeyword.trim().toLowerCase();

  return items.filter((routine) => {
    if (filters.statusFilter === "active" && routine.done) {
      return false;
    }

    if (filters.statusFilter === "done" && !routine.done) {
      return false;
    }

    if (filters.priorityFilter !== "all" && routine.priority !== filters.priorityFilter) {
      return false;
    }

    if (!normalizedKeyword) {
      return true;
    }

    const categoryLabel = CATEGORY_LABELS[routine.category] ?? routine.category;
    const haystack = `${routine.title} ${categoryLabel}`.toLowerCase();
    return haystack.includes(normalizedKeyword);
  });
}

function groupRoutines(items) {
  return {
    focusNow: items.filter((routine) => !routine.done && routine.priority === "high"),
    inProgress: items.filter((routine) => !routine.done && routine.priority !== "high"),
    done: items.filter((routine) => routine.done),
  };
}

function getFilterSummary(statusFilter, priorityFilter, searchKeyword, sortMode) {
  const summary = [];

  if (statusFilter !== "all") {
    summary.push(`상태: ${STATUS_LABELS[statusFilter] ?? statusFilter}`);
  }

  if (priorityFilter !== "all") {
    summary.push(`중요도: ${PRIORITY_LABELS[priorityFilter] ?? priorityFilter}`);
  }

  if (searchKeyword.trim()) {
    summary.push(`검색: ${searchKeyword.trim()}`);
  }

  summary.push(`정렬: ${SORT_LABELS[sortMode] ?? sortMode}`);
  return summary;
}

export function App() {
  const [routines, setRoutines] = useState(() => parseStoredRoutines());
  const [draftTitle, setDraftTitle] = useState("");
  const [draftCategory, setDraftCategory] = useState("coding");
  const [draftPriority, setDraftPriority] = useState("medium");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortMode, setSortMode] = useState("created");
  const [lastAction, setLastAction] = useState("오늘의 집중 루틴을 준비했습니다.");

  const totalCount = routines.length;

  const doneCount = useMemo(() => {
    return routines.filter((routine) => routine.done).length;
  }, [routines]);

  const activeCount = useMemo(() => {
    return totalCount - doneCount;
  }, [totalCount, doneCount]);

  const progressPercent = useMemo(() => {
    if (totalCount === 0) {
      return 0;
    }

    return Math.round((doneCount / totalCount) * 100);
  }, [doneCount, totalCount]);

  const visibleRoutines = useMemo(() => {
    return sortRoutines(
      filterRoutines(routines, {
        statusFilter,
        priorityFilter,
        searchKeyword,
      }),
      sortMode
    );
  }, [priorityFilter, routines, searchKeyword, sortMode, statusFilter]);

  const groupedBoard = useMemo(() => {
    return groupRoutines(visibleRoutines);
  }, [visibleRoutines]);

  const visibleCount = useMemo(() => visibleRoutines.length, [visibleRoutines]);

  const focusNowCount = useMemo(() => groupedBoard.focusNow.length, [groupedBoard]);

  const activeFilterSummary = useMemo(() => {
    return getFilterSummary(statusFilter, priorityFilter, searchKeyword, sortMode);
  }, [priorityFilter, searchKeyword, sortMode, statusFilter]);

  const categorySummary = useMemo(() => {
    const summary = Object.keys(CATEGORY_LABELS).map((category) => {
      const count = visibleRoutines.filter((routine) => routine.category === category).length;
      return {
        category,
        label: CATEGORY_LABELS[category],
        count,
      };
    });

    return summary.filter((item) => item.count > 0);
  }, [visibleRoutines]);

  const topCategory = useMemo(() => {
    if (categorySummary.length === 0) {
      return "지금은 화면에 보이는 루틴이 없습니다.";
    }

    const [leader] = categorySummary.slice().sort((left, right) => right.count - left.count);
    return `${leader.label} 루틴이 ${leader.count}개로 가장 많습니다.`;
  }, [categorySummary]);

  const todayLabel = useMemo(() => formatTodayLabel(), []);

  useEffect(() => {
    document.title = `집중 루틴 ${doneCount}/${totalCount}`;

    return () => {
      document.title = "Week5 React-like Runtime";
    };
  }, [doneCount, totalCount]);

  useEffect(() => {
    if (!canUseLocalStorage()) {
      return;
    }

    localStorage.setItem("focus-routines", JSON.stringify(routines));
  }, [routines]);

  function handleTitleInput(event) {
    setDraftTitle(event.target.value);
  }

  function handleCategoryChange(event) {
    setDraftCategory(event.target.value);
  }

  function handlePriorityChange(event) {
    setDraftPriority(event.target.value);
  }

  function handleStatusFilterChange(event) {
    setStatusFilter(event.target.value);
    setLastAction("상태 필터를 변경했습니다.");
  }

  function handlePriorityFilterChange(event) {
    setPriorityFilter(event.target.value);
    setLastAction("중요도 필터를 변경했습니다.");
  }

  function handleSearchInput(event) {
    setSearchKeyword(event.target.value);
  }

  function handleSortChange(event) {
    setSortMode(event.target.value);
    setLastAction("정렬 기준을 변경했습니다.");
  }

  function handleSubmitRoutine(event) {
    event.preventDefault();

    const nextTitle = draftTitle.trim();

    if (!nextTitle) {
      setLastAction("빈 루틴은 추가할 수 없습니다.");
      return;
    }

    const nextRoutine = {
      id: createRoutineId(),
      title: nextTitle,
      category: draftCategory,
      priority: draftPriority,
      done: false,
      createdAt: Date.now(),
    };

    setRoutines((previousRoutines) => [nextRoutine, ...previousRoutines]);
    setDraftTitle("");
    setLastAction(`"${nextRoutine.title}" 루틴을 추가했습니다.`);
  }

  function handleToggleRoutine(routineId) {
    let nextAction = "루틴 상태를 변경했습니다.";

    setRoutines((previousRoutines) =>
      previousRoutines.map((routine) => {
        if (routine.id !== routineId) {
          return routine;
        }

        const nextDone = !routine.done;
        nextAction = nextDone
          ? `"${routine.title}" 루틴을 완료했습니다.`
          : `"${routine.title}" 루틴을 다시 진행 중으로 돌렸습니다.`;

        return {
          ...routine,
          done: nextDone,
        };
      })
    );

    setLastAction(nextAction);
  }

  function handleRemoveRoutine(routineId) {
    let nextAction = "루틴을 삭제했습니다.";

    setRoutines((previousRoutines) =>
      previousRoutines.filter((routine) => {
        if (routine.id === routineId) {
          nextAction = `"${routine.title}" 루틴을 삭제했습니다.`;
          return false;
        }

        return true;
      })
    );

    setLastAction(nextAction);
  }

  return h("main", { className: "app-shell" },
    h(BoardHero, {
      todayLabel,
      totalCount,
      doneCount,
      activeCount,
      progressPercent,
    }),
    h(RoutineComposer, {
      draftTitle,
      draftCategory,
      draftPriority,
      categoryLabels: CATEGORY_LABELS,
      priorityLabels: PRIORITY_LABELS,
      onTitleInput: handleTitleInput,
      onCategoryChange: handleCategoryChange,
      onPriorityChange: handlePriorityChange,
      onSubmit: handleSubmitRoutine,
    }),
    h(FilterBar, {
      statusFilter,
      priorityFilter,
      searchKeyword,
      sortMode,
      visibleCount,
      totalCount,
      activeFilterSummary,
      priorityLabels: PRIORITY_LABELS,
      onStatusFilterChange: handleStatusFilterChange,
      onPriorityFilterChange: handlePriorityFilterChange,
      onSearchInput: handleSearchInput,
      onSortChange: handleSortChange,
    }),
    h("section", { className: "board-layout" },
      h(BoardSection, {
        title: "Focus Now",
        description: "가장 먼저 처리해야 할 높은 중요도의 루틴입니다.",
        count: groupedBoard.focusNow.length,
        items: groupedBoard.focusNow,
        emptyMessage: "지금 당장 집중해야 할 루틴이 없습니다.",
        categoryLabels: CATEGORY_LABELS,
        priorityLabels: PRIORITY_LABELS,
        onToggle: handleToggleRoutine,
        onRemove: handleRemoveRoutine,
      }),
      h(BoardSection, {
        title: "In Progress",
        description: "현재 진행 중인 루틴입니다.",
        count: groupedBoard.inProgress.length,
        items: groupedBoard.inProgress,
        emptyMessage: "진행 중인 루틴이 없습니다.",
        categoryLabels: CATEGORY_LABELS,
        priorityLabels: PRIORITY_LABELS,
        onToggle: handleToggleRoutine,
        onRemove: handleRemoveRoutine,
      }),
      h(BoardSection, {
        title: "Done",
        description: "오늘 완료한 루틴입니다.",
        count: groupedBoard.done.length,
        items: groupedBoard.done,
        emptyMessage: "완료한 루틴이 아직 없습니다.",
        categoryLabels: CATEGORY_LABELS,
        priorityLabels: PRIORITY_LABELS,
        onToggle: handleToggleRoutine,
        onRemove: handleRemoveRoutine,
      })
    ),
    h(InsightPanel, {
      lastAction,
      visibleCount,
      totalCount,
      doneCount,
      focusNowCount,
      topCategory,
      categorySummary,
    })
  );
}
