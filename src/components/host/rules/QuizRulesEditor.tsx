import React from 'react';
import { CalendarClock, Clock, Shuffle, UserCheck, Plus, Minus } from 'lucide-react';

export type SessionSettingsLike = {
  expiresIn: number;
  randomizeQuestions: boolean;
  singleAttempt: boolean;
  questionTimeLimit: number;
};

interface QuizRulesEditorProps {
  value: SessionSettingsLike;
  onChange: (v: SessionSettingsLike) => void;
  disabled?: boolean;
}

const QuizRulesEditor: React.FC<QuizRulesEditorProps> = ({ value, onChange, disabled = false }) => {
  const formatExpiryTime = (milliseconds: number): string => {
    const hours = milliseconds / (60 * 60 * 1000);
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = Math.floor(hours % 24);
      if (remainingHours === 0) return `${days}일`;
      return `${days}일 ${remainingHours}시간`;
    }
    return `${Math.floor(hours)}시간`;
  };

  const updateExpiryTime = (increment: boolean) => {
    const currentHours = value.expiresIn / (60 * 60 * 1000);
    let newHours;
    if (increment) {
      if (currentHours < 12) newHours = currentHours + 1;
      else if (currentHours < 24) newHours = 24;
      else newHours = Math.min(168, currentHours + 24);
    } else {
      if (currentHours > 24) newHours = currentHours - 24;
      else if (currentHours > 12) newHours = 12;
      else newHours = Math.max(1, currentHours - 1);
    }
    onChange({ ...value, expiresIn: newHours * 60 * 60 * 1000 });
  };

  const updateQuestionTime = (increment: boolean) => {
    const currentSeconds = value.questionTimeLimit;
    const newSeconds = increment ? Math.min(60, currentSeconds + 5) : Math.max(10, currentSeconds - 5);
    onChange({ ...value, questionTimeLimit: newSeconds });
  };

  const TimeControlButton = ({ onClick, color, icon }: { onClick: () => void; color: 'purple' | 'blue'; icon: 'plus' | 'minus' }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full text-gray-500 hover:text-${color}-600 hover:bg-${color}-50 focus:outline-none disabled:opacity-50 transition-colors`}
    >
      {icon === 'plus' ? <Plus size={16} /> : <Minus size={16} />}
    </button>
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 grid gap-3 sm:gap-4">
        {/* 만료 기간 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-nowrap">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 text-purple-600 mr-2">
              <CalendarClock size={18} />
            </div>
            <span className="font-medium whitespace-nowrap">만료 기간</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <TimeControlButton onClick={() => updateExpiryTime(false)} color="purple" icon="minus" />
            <div className="w-[60px] sm:w-[75px] text-center font-medium text-sm sm:text-base">{formatExpiryTime(value.expiresIn)}</div>
            <TimeControlButton onClick={() => updateExpiryTime(true)} color="purple" icon="plus" />
          </div>
        </div>

        <div className="border-t border-gray-100"></div>

        {/* 문제 시간 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-nowrap">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-600 mr-2">
              <Clock size={18} />
            </div>
            <span className="font-medium whitespace-nowrap">문제 시간</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <TimeControlButton onClick={() => updateQuestionTime(false)} color="blue" icon="minus" />
            <div className="w-[60px] sm:w-[75px] text-center font-medium text-sm sm:text-base">{value.questionTimeLimit}초</div>
            <TimeControlButton onClick={() => updateQuestionTime(true)} color="blue" icon="plus" />
          </div>
        </div>

        <div className="border-t border-gray-100"></div>

        {/* 추가 설정 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 text-green-600 mr-2 sm:mr-3">
              <Shuffle size={16} className="sm:h-[18px] sm:w-[18px]" />
            </div>
            <span className="font-medium flex-grow whitespace-nowrap text-sm sm:text-base">문제 랜덤 출제</span>
            <div className="relative inline-block w-10 h-6 ml-2">
              <input
                type="checkbox"
                id="randomize"
                className="opacity-0 w-0 h-0"
                checked={value.randomizeQuestions}
                onChange={(e) => onChange({ ...value, randomizeQuestions: e.target.checked })}
                disabled={disabled}
              />
              <label
                htmlFor="randomize"
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ease-in-out ${value.randomizeQuestions ? 'bg-green-500' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`absolute left-0.5 bottom-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out ${value.randomizeQuestions ? 'transform translate-x-4' : ''}`}
                ></span>
              </label>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-100 text-amber-600 mr-2 sm:mr-3">
              <UserCheck size={16} className="sm:h-[18px] sm:w-[18px]" />
            </div>
            <span className="font-medium flex-grow whitespace-nowrap text-sm sm:text-base">한 번만 참가</span>
            <div className="relative inline-block w-10 h-6 ml-2">
              <input
                type="checkbox"
                id="singleAttempt"
                className="opacity-0 w-0 h-0"
                checked={value.singleAttempt}
                onChange={(e) => onChange({ ...value, singleAttempt: e.target.checked })}
                disabled={disabled}
              />
              <label
                htmlFor="singleAttempt"
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ease-in-out ${value.singleAttempt ? 'bg-amber-500' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`absolute left-0.5 bottom-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out ${value.singleAttempt ? 'transform translate-x-4' : ''}`}
                ></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizRulesEditor;


