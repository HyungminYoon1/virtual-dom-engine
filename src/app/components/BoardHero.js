/*
 * Responsibility:
 * - 상단 Hero 영역을 렌더링한다.
 * - 루트에서 계산한 핵심 통계를 크게 보여줘 앱 상태 변화를 한눈에 전달한다.
 */

import { h } from "../../index.js";

export function BoardHero(props) {
  return h("section", { className: "hero-card" },
    h("div", { className: "hero-copy" },
      h("p", { className: "eyebrow" }, "Focus Routine Board"),
      h("h1", { className: "hero-title" }, "집중 루틴 보드"),
      h("p", { className: "hero-description" }, `${props.todayLabel} 기준으로 오늘의 집중 루틴을 정리하고, 상태 변화가 여러 컴포넌트에 어떻게 퍼지는지 보여줍니다.`)
    ),
    h("div", { className: "hero-stats" },
      h("div", { className: "stat-card" },
        h("span", { className: "stat-label" }, "총 루틴"),
        h("strong", { className: "stat-value" }, String(props.totalCount))
      ),
      h("div", { className: "stat-card" },
        h("span", { className: "stat-label" }, "완료"),
        h("strong", { className: "stat-value" }, String(props.doneCount))
      ),
      h("div", { className: "stat-card" },
        h("span", { className: "stat-label" }, "남은 루틴"),
        h("strong", { className: "stat-value" }, String(props.activeCount))
      )
    ),
    h("div", { className: "progress-block" },
      h("div", { className: "progress-meta" },
        h("span", null, "오늘 진행률"),
        h("strong", null, `${props.progressPercent}%`)
      ),
      h("div", { className: "progress-track" },
        h("span", {
          className: "progress-fill",
          style: `width: ${props.progressPercent}%`,
        })
      )
    )
  );
}
