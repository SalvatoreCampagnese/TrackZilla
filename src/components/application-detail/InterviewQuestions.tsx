
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useDateFormatter } from '@/hooks/useDateFormatter';

const INTERVIEW_ROUNDS = ['first', 'second', 'technical', 'final', 'hr'] as const;

interface InterviewQuestion {
  id: string;
  question: string;
  interview_round: string | null;
  role: string | null;
  technologies: string | null;
  created_at: string;
  user_id: string;
}

interface InterviewQuestionsProps {
  applicationId: string;
  companyName: string;
  roleDescription: string;
}

export const InterviewQuestions: React.FC<InterviewQuestionsProps> = ({
  applicationId,
  companyName,
  roleDescription
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { formatDate } = useDateFormatter();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [interviewRound, setInterviewRound] = useState('');
  const [role, setRole] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [applicationId]);

  const fetchQuestions = async () => {
    try {
      // Get questions for this specific application
      const { data: appQuestions, error: appError } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (appError) throw appError;

      // Get questions for the same company and role from other applications
      const { data: otherQuestions, error: otherError } = await supabase
        .from('interview_questions')
        .select(`
          *,
          job_applications!inner(company_name, role_description)
        `)
        .eq('job_applications.company_name', companyName)
        .eq('job_applications.role_description', roleDescription)
        .neq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (otherError) throw otherError;

      // Map the data to ensure all required fields are present
      const mappedAppQuestions: InterviewQuestion[] = (appQuestions || []).map(q => ({
        id: q.id,
        question: q.question,
        interview_round: q.interview_round,
        role: q.role || null,
        technologies: q.technologies || null,
        created_at: q.created_at,
        user_id: q.user_id
      }));

      const mappedOtherQuestions: InterviewQuestion[] = (otherQuestions || []).map(q => ({
        id: q.id,
        question: q.question,
        interview_round: q.interview_round,
        role: q.role || null,
        technologies: q.technologies || null,
        created_at: q.created_at,
        user_id: q.user_id
      }));

      // Combine and deduplicate questions
      const allQuestions = [
        ...mappedAppQuestions,
        ...mappedOtherQuestions
      ];

      setQuestions(allQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: t('interviewQuestions.errorLoading'),
        description: t('interviewQuestions.errorLoadingDescription'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim() || !user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('interview_questions')
        .insert({
          application_id: applicationId,
          user_id: user.id,
          question: newQuestion.trim(),
          interview_round: interviewRound || null,
          role: role.trim() || null,
          technologies: technologies.trim() || null
        });

      if (error) throw error;

      toast({
        title: t('interviewQuestions.questionAdded'),
        description: t('interviewQuestions.questionAddedDescription')
      });

      setNewQuestion('');
      setInterviewRound('');
      setRole('');
      setTechnologies('');
      setShowAddForm(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: t('interviewQuestions.errorAdding'),
        description: t('interviewQuestions.errorAddingDescription'),
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getRoundColor = (round: string | null) => {
    const colors = {
      'first': 'bg-blue-100 text-blue-800',
      'second': 'bg-green-100 text-green-800',
      'technical': 'bg-orange-100 text-orange-800',
      'final': 'bg-purple-100 text-purple-800',
      'hr': 'bg-pink-100 text-pink-800'
    };
    return colors[round as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          <div className="animate-pulse text-white">{t('interviewQuestions.loading')}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Question Form */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {t('interviewQuestions.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showAddForm ? (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('interviewQuestions.addInterviewQuestion')}
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="question" className="text-white">{t('interviewQuestions.question')}</Label>
                <Textarea
                  id="question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder={t('interviewQuestions.questionPlaceholder')}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role" className="text-white">{t('interviewQuestions.roleOptional')}</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder={t('interviewQuestions.rolePlaceholder')}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="technologies" className="text-white">{t('interviewQuestions.technologiesOptional')}</Label>
                  <Input
                    id="technologies"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder={t('interviewQuestions.technologiesPlaceholder')}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="round" className="text-white">{t('interviewQuestions.roundOptional')}</Label>
                <Select value={interviewRound} onValueChange={setInterviewRound}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={t('interviewQuestions.selectRound')} />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVIEW_ROUNDS.map(round => (
                      <SelectItem key={round} value={round}>{t(`interviewQuestions.rounds.${round}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddQuestion}
                  disabled={!newQuestion.trim() || submitting}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  {submitting ? t('interviewQuestions.adding') : t('interviewQuestions.addQuestion')}
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewQuestion('');
                    setInterviewRound('');
                    setRole('');
                    setTechnologies('');
                  }}
                  variant="outline"
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions List */}
      {questions.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">{t('interviewQuestions.emptyTitle')}</p>
            <p className="text-white/50 text-sm">{t('interviewQuestions.emptyDescription')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white leading-relaxed mb-3">{question.question}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {question.interview_round && (
                        <Badge className={getRoundColor(question.interview_round)}>
                          {t(`interviewQuestions.rounds.${question.interview_round}`, { defaultValue: question.interview_round })}
                        </Badge>
                      )}
                      {question.role && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {question.role}
                        </Badge>
                      )}
                      {question.technologies && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {question.technologies}
                        </Badge>
                      )}
                      <span className="text-white/50 text-xs ml-auto">
                        {formatDate(question.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
