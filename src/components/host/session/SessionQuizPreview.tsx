import React from 'react';
import { Eye } from 'lucide-react';
import { Quiz } from '../../../types';

// 프리뷰 컴포넌트 props 타입
interface SessionPreviewProps {
  quiz?: Quiz;
  revealAnswers?: boolean;
}

// 세션 미리보기 전용 컴포넌트
const SessionSettingsFrame: React.FC<SessionPreviewProps> = ({ quiz, revealAnswers = false }) => {

  // 퀴즈에 문제가 있는지 확인하는 헬퍼 함수
  const hasQuestions = () => {
    return quiz && quiz.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0;
  };
  
  // 문제 미리보기 탭 렌더링
  const renderPreviewTab = () => {
    // 질문 데이터가 없으면 빈 배열 반환하도록 안전하게 처리
    const questions = hasQuestions() ? quiz!.questions : [];

    // 문제 형식별 스타일 정의
    const getQuestionTypeStyle = (type: string) => {
      switch (type) {
        case 'multiple-choice':
          return {
            badge: 'bg-blue-100 text-blue-800',
            border: 'border-blue-200',
            bg: 'bg-blue-50'
          };
        case 'short-answer':
          return {
            badge: 'bg-green-100 text-green-800',
            border: 'border-green-200',
            bg: 'bg-green-50'
          };
        case 'opinion':
          return {
            badge: 'bg-orange-100 text-orange-800',
            border: 'border-orange-200',
            bg: 'bg-orange-50'
          };
        default:
          return {
            badge: 'bg-blue-100 text-blue-800',
            border: 'border-blue-200',
            bg: 'bg-blue-50'
          };
      }
    };

    // 문제 형식별 라벨 정의
    const getQuestionTypeLabel = (type: string) => {
      switch (type) {
        case 'multiple-choice':
          return '객관식';
        case 'short-answer':
          return '주관식';
        case 'opinion':
          return '의견 수집';
        default:
          return '객관식';
      }
    };

    return (
      <div className="p-3 sm:p-4">
        {!hasQuestions() ? (
          <div className="text-center py-10 sm:py-12 bg-white rounded-xl shadow-sm text-gray-500 flex flex-col items-center">
            <Eye size={32} className="text-gray-400 mb-2" />
            <span>등록된 문제가 없습니다</span>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {questions.map((question, index) => {
              const typeStyle = getQuestionTypeStyle(question.type);
              const typeLabel = getQuestionTypeLabel(question.type);
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
                  <div className="mb-3">
                    <div className={`inline-block px-2 py-1 ${typeStyle.badge} text-xs rounded-md mb-2`}>
                      문제 {index + 1} - {typeLabel}
                    </div>
                    <div className="font-bold text-gray-800 mb-3">{question.text}</div>
                  </div>
                  
                  {/* 객관식 문제 */}
                  {question.type === 'multiple-choice' && question.options && Array.isArray(question.options) && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex} 
                          className={`relative border rounded-lg p-2 sm:p-3 transition-colors
                            ${revealAnswers && optionIndex === question.correctAnswer 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center">
                            <div className={`
                              w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold
                              ${revealAnswers && optionIndex === question.correctAnswer ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}
                            `}>
                              {optionIndex + 1}
                            </div>
                            <span className="text-xs sm:text-sm">{option}</span>
                            {revealAnswers && optionIndex === question.correctAnswer && (
                              <div className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-0.5 sm:py-1 rounded-full">
                                정답
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 주관식 문제 */}
                  {question.type === 'short-answer' && (
                    <div className={`${typeStyle.bg} ${typeStyle.border} border rounded-lg p-3`}>
                      <div className="space-y-3">
                        {revealAnswers ? (
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">정답:</div>
                            <div className="bg-white border border-green-300 rounded-md p-2">
                              <span className="text-sm text-green-700 font-medium">
                                {question.correctAnswerText}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">정답이 가려진 상태입니다</div>
                        )}
                        
                        {revealAnswers && question.additionalAnswers && question.additionalAnswers.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">추가 정답:</div>
                            <div className="space-y-1">
                              {question.additionalAnswers.map((answer, answerIndex) => (
                                <div key={answerIndex} className="bg-white border border-green-200 rounded-md p-2">
                                  <span className="text-sm text-green-600">{answer}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {revealAnswers && (
                          <div className="text-xs text-gray-500">
                            정답 인정 방식: {question.answerMatchType === 'contains' ? '포함' : '정확히 일치'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 의견 수집 문제 */}
                  {question.type === 'opinion' && (
                    <div className={`${typeStyle.bg} ${typeStyle.border} border rounded-lg p-3`}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-center py-4">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                              </svg>
                            </div>
                            <div className="text-sm text-orange-700 font-medium">자유로운 의견 수집</div>
                            <div className="text-xs text-orange-600 mt-1">정답이 없으며 점수에 영향을 주지 않습니다</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs">
                          <div className={`w-3 h-3 rounded-full ${question.isAnonymous ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                          <span className={question.isAnonymous ? 'text-orange-700 font-medium' : 'text-gray-500'}>
                            익명 수집
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 객관식이 아닌데 options가 있는 경우 (호환성) */}
                  {question.type !== 'multiple-choice' && question.type !== 'short-answer' && question.type !== 'opinion' && question.options && Array.isArray(question.options) && (
                    <div className="text-center py-4 text-gray-500">
                      알 수 없는 문제 형식입니다
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden">
      {renderPreviewTab()}
    </div>
  );
};

export default SessionSettingsFrame; 