import React, { useMemo, useState } from 'react';
import { ModeRegistry } from '../../../modes';
import QuizRulesEditor, { SessionSettingsLike } from '../../host/rules/QuizRulesEditor';

interface GameModeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: { mode: string; options: SessionSettingsLike }) => void;
}

const DEFAULT_OPTIONS: SessionSettingsLike = {
  expiresIn: 24 * 60 * 60 * 1000,
  randomizeQuestions: false,
  singleAttempt: true,
  questionTimeLimit: 30,
};

const GameModeSelectModal: React.FC<GameModeSelectModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const modes = useMemo(() => Object.values(ModeRegistry), []);
  const [selectedMode, setSelectedMode] = useState<string>('normal');
  const [options, setOptions] = useState<SessionSettingsLike>(DEFAULT_OPTIONS);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({ mode: selectedMode, options });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-5 max-w-3xl w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-3">활동 설정</h3>

        <div className="space-y-2 mb-4">
          {modes.map((m) => (
            <label key={m.id} className="flex items-center p-2 rounded-lg border cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="gameMode"
                value={m.id}
                checked={selectedMode === m.id}
                onChange={() => setSelectedMode(m.id)}
                className="mr-2"
              />
              <span className="font-medium text-gray-800">{m.displayName}</span>
            </label>
          ))}
        </div>

        {selectedMode === 'normal' && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">노말 모드 규칙</h4>
            <QuizRulesEditor value={options} onChange={setOptions} />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelectModal;


