import React, { useState } from 'react';
import { 
  MessageSquare, 
  CheckSquare, 
  Square, 
  Printer, 
  Plus, 
  FileText, 
  HelpCircle, 
  Edit3, 
  Save, 
  Sparkles,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { DoctorQuestion, LabReport } from '../types';

interface DoctorDiscussionPanelProps {
  report: LabReport;
  onOpenPrintSheet: () => void;
}

export const DoctorDiscussionPanel: React.FC<DoctorDiscussionPanelProps> = ({
  report,
  onOpenPrintSheet
}) => {
  const [questions, setQuestions] = useState<DoctorQuestion[]>(report.doctorQuestions);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleDiscussed = (id: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, discussed: !q.discussed } : q))
    );
  };

  const handleStartEditNote = (question: DoctorQuestion) => {
    setEditingNotesId(question.id);
    setNoteText(question.patientNotes || '');
  };

  const handleSaveNote = (id: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, patientNotes: noteText } : q))
    );
    setEditingNotesId(null);
  };

  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: DoctorQuestion = {
      id: `custom-q-${Date.now()}`,
      question: newQuestionText.trim(),
      whyItMatters: 'Custom question added by patient for personal health context.',
      discussed: false,
      priority: 'high'
    };

    setQuestions(prev => [newQ, ...prev]);
    setNewQuestionText('');
    setShowAddForm(false);
  };

  const discussedCount = questions.filter(q => q.discussed).length;

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-8" id="doctor-discussion-section">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Questions to Ask Your Doctor
            </h2>
            <span className="text-xs bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-full border border-teal-200">
              {questions.length} personalized questions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by clinical importance. Check off questions during your appointment and take personal notes.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-teal-600" />
            <span>Add Question</span>
          </button>

          <button
            onClick={onOpenPrintSheet}
            className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            <span>Print Discussion Sheet</span>
          </button>
        </div>
      </div>

      {/* Progress pill bar */}
      <div className="py-2.5 px-3 bg-slate-50 border-b border-slate-100 text-xs flex items-center justify-between flex-wrap gap-2">
        <span className="text-slate-600">
          Appointment Progress: <span className="font-bold text-slate-900">{discussedCount} of {questions.length}</span> questions discussed
        </span>
        <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-teal-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${questions.length > 0 ? (discussedCount / questions.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Add Custom Question Form */}
      {showAddForm && (
        <form onSubmit={handleAddCustomQuestion} className="bg-teal-50/50 p-4 rounded-xl border border-teal-200 mt-4 mb-2 animate-in fade-in duration-150">
          <p className="text-xs font-bold text-teal-900 mb-2">Add Your Own Question for the Doctor</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g. Could my knee pain or recent fatigue be connected with these results?"
              className="flex-1 text-xs bg-white border border-teal-300 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Questions List */}
      <div className="divide-y divide-slate-100 mt-2">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={`py-4 transition-colors ${
              q.discussed ? 'opacity-65 bg-slate-50/40' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Checkbox button */}
              <button
                onClick={() => toggleDiscussed(q.id)}
                className="mt-0.5 text-teal-600 hover:text-teal-700 shrink-0 transition-transform active:scale-95"
                title={q.discussed ? 'Mark as not discussed' : 'Mark as discussed with doctor'}
              >
                {q.discussed ? (
                  <CheckSquare className="w-5 h-5 text-teal-600 fill-teal-50" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                )}
              </button>

              {/* Question Content */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    #{idx + 1}
                  </span>
                  {q.priority === 'high' && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      High Priority
                    </span>
                  )}
                  {q.relatedTestName && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      Related: <span className="text-slate-700 font-semibold">{q.relatedTestName}</span>
                    </span>
                  )}
                </div>

                <p className={`text-sm font-semibold text-slate-900 ${q.discussed ? 'line-through text-slate-500' : ''}`}>
                  "{q.question}"
                </p>

                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-600">Why this matters: </span>
                  {q.whyItMatters}
                </p>

                {/* Patient Notes Display or Inline Edit */}
                {editingNotesId === q.id ? (
                  <div className="mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Type your notes or doctor's verbal instructions here..."
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-teal-500"
                      rows={2}
                    />
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNote(q.id)}
                        className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700 inline-flex items-center"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center justify-between text-xs">
                    {q.patientNotes ? (
                      <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200 text-slate-700 flex-1 mr-2 text-[11px]">
                        <span className="font-bold text-amber-900 block">Your Notes / Doctor's Response:</span>
                        <span>{q.patientNotes}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No notes added yet</span>
                    )}

                    <button
                      onClick={() => handleStartEditNote(q)}
                      className="inline-flex items-center text-[11px] font-semibold text-teal-700 hover:underline shrink-0"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      {q.patientNotes ? 'Edit Notes' : 'Add Note'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
