import React, { useState } from 'react';
import { BreathingIcon } from './icons/BreathingIcon';
import { useTranslation } from 'react-i18next';
import { KegelDiagram } from './KegelDiagram';

interface InstructionsModalProps {
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [diagramPhase, setDiagramPhase] = useState<'relax' | 'contract'>('relax');

  const getButtonClass = (phase: 'relax' | 'contract') => {
    const baseClass = "w-full py-2 px-4 rounded-lg font-semibold transition-colors";
    if (diagramPhase === phase) {
      return `${baseClass} bg-indigo-600 text-white`;
    }
    return `${baseClass} bg-gray-700 text-gray-300 hover:bg-gray-600`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 text-white max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-800 py-2 -mt-2">
          <h2 className="text-2xl font-bold text-indigo-400">{t('howToKegel')}</h2>
          <button onClick={onClose} className="text-gray-400 text-3xl leading-none hover:text-white">&times;</button>
        </div>
        <div className="space-y-6 text-gray-300">
          <div>
            <h3 className="font-semibold text-lg text-white mb-1">{t('findMuscles')}</h3>
            <p>{t('findMusclesDesc')}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-white mb-2">{t('visualGuide')}</h3>
            <div className="bg-gray-900/50 p-4 rounded-lg">
                <KegelDiagram phase={diagramPhase} />
                <div className="flex justify-center space-x-3 my-4">
                    <button onClick={() => setDiagramPhase('contract')} className={getButtonClass('contract')}>
                        {t('contract')}
                    </button>
                    <button onClick={() => setDiagramPhase('relax')} className={getButtonClass('relax')}>
                        {t('relax')}
                    </button>
                </div>
                <div className="text-center p-2 bg-gray-700/50 rounded-md">
                    <h4 className="font-semibold text-indigo-400">
                        {diagramPhase === 'contract' ? t('techniqueContractTitle') : t('techniqueRelaxTitle')}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                        {diagramPhase === 'contract' ? t('techniqueContractDesc') : t('techniqueRelaxDesc')}
                    </p>
                </div>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-gray-700 p-4 rounded-lg">
            <BreathingIcon />
            <div>
                <h3 className="font-semibold text-lg text-white mb-1">{t('breathe')}</h3>
                <p>{t('breatheDesc')}</p>
            </div>
          </div>
          <p className="text-sm text-center text-gray-500 pt-2">{t('consultDoctor')}</p>
        </div>
         <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-lg transition-colors"
            >
              {t('gotIt')}
            </button>
          </div>
      </div>
    </div>
  );
};

export default InstructionsModal;