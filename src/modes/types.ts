export interface ModeDefinition {
  id: string; // e.g., 'normal', 'team', 'speedrun'
  displayName: string;
  // 클라이언트 기능 플래그(예: 타이머/랭킹 UI 변형 등)
  clientFlags?: Record<string, boolean>;
}


