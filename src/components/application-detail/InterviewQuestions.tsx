
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

      // Combine and deduplicate questions
      const allQuestions = [
        ...(appQuestions || []),
        ...(otherQuestions || [])
      ];

      setQuestions(allQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error loading questions",
        description: "Could not load interview questions",
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
        title: "Question added",
        description: "Interview question has been saved successfully"
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
        title: "Error adding question",
        description: "Could not save the interview question",
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
          <div className="animate-pulse text-white">Loading questions...</div>
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
            Interview Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showAddForm ? (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Interview Question
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="question" className="text-white">Question</Label>
                <Textarea
                  id="question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter the interview question..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role" className="text-white">Role (Optional)</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Frontend Developer"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="technologies" className="text-white">Technologies (Optional)</Label>
                  <Input
                    id="technologies"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="e.g., React, Node.js, Python"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="round" className="text-white">Interview Round (Optional)</Label>
                <Select value={interviewRound} onValueChange={setInterviewRound}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select interview round" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first">First Interview</SelectItem>
                    <SelectItem value="second">Second Interview</SelectItem>
                    <SelectItem value="technical">Technical Interview</SelectItem>
                    <SelectItem value="final">Final Interview</SelectItem>
                    <SelectItem value="hr">HR Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddQuestion}
                  disabled={!newQuestion.trim() || submitting}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  {submitting ? 'Adding...' : 'Add Question'}
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
                  Cancel
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
            <p className="text-white/70">No interview questions yet</p>
            <p className="text-white/50 text-sm">Be the first to add a question!</p>
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
                          {question.interview_round} interview
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
                        {new Date(question.created_at).toLocaleDateString()}
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
