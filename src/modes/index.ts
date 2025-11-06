import type { ModeDefinition } from './types';

// 간단한 런타임 레지스트리 (현재 미사용)
const ModeRegistry: Record<string, ModeDefinition> = {};

// 기본 'normal' 모드 등록
ModeRegistry['normal'] = {
  id: 'normal',
  displayName: '일반 모드',
};
export { ModeRegistry };
export type { ModeDefinition };


