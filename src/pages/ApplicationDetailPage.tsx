import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Calendar, Euro, MapPin, Edit, ChevronDown, ChevronUp, Crown, Lock } from 'lucide-react';
import { InterviewQuestions } from '@/components/application-detail/InterviewQuestions';
import { CompanyReviews } from '@/components/application-detail/CompanyReviews';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JOB_STATUS_LABELS } from '@/types/job';
import { toast } from '@/hooks/use-toast';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');

  useEffect(() => {
    if (!id || !user) return;

    const fetchApplication = async () => {
      try {
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .eq('id', id)
          .eq('deleted', false)
          .single();

        if (error) throw error;

        const mappedApplication: JobApplication = {
          id: data.id,
          jobDescription: data.job_description,
          applicationDate: data.application_date,
          companyName: data.company_name,
          roleDescription: data.role_description,
          salary: data.salary,
          workMode: data.work_mode as JobApplication['workMode'],
          status: data.status as JobApplication['status'],
          tags: data.tags || [],
          createdAt: data.created_at
        };

        setApplication(mappedApplication);
      } catch (error) {
        console.error('Error fetching application:', error);
        toast({
          title: "Error loading application",
          description: "Could not load application details",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, user, navigate]);

  const getWorkModeIcon = (workMode: string) => {
    switch (workMode) {
      case 'remoto':
        return '🏠';
      case 'ibrido':
        return '🏢🏠';
      case 'in-presenza':
        return '🏢';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'in-corso': 'bg-blue-100 text-blue-800',
      'ghosting': 'bg-gray-100 text-gray-800',
      'primo-colloquio': 'bg-green-100 text-green-800',
      'secondo-colloquio': 'bg-green-100 text-green-800',
      'colloquio-tecnico': 'bg-orange-100 text-orange-800',
      'colloquio-finale': 'bg-purple-100 text-purple-800',
      'offerta-ricevuta': 'bg-emerald-100 text-emerald-800',
      'rifiutato': 'bg-red-100 text-red-800',
      'ritirato': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleEditApplication = () => {
    navigate(`/add-job?edit=${id}`);
  };

  const handleTabChange = (value: string) => {
    if (!subscribed && (value === 'questions' || value === 'reviews')) {
      toast({
        title: "Pro feature",
        description: "Interview questions and company reviews are only available for Pro users.",
        variant: "destructive",
      });
      navigate('/?tab=pro');
      return;
    }
    setActiveTab(value);
  };

  const shouldTruncateDescription = (text: string) => {
    // Approximate 2 lines based on character count and line breaks
    const maxChars = 120; // Roughly 60 characters per line
    const lineBreaks = (text.match(/\n/g) || []).length;
    return text.length > maxChars || lineBreaks > 1;
  };

  const truncateDescription = (text: string) => {
    const maxChars = 120;
    const lines = text.split('\n');
    
    if (lines.length > 2) {
      return lines.slice(0, 2).join('\n') + '...';
    }
    
    if (text.length > maxChars) {
      return text.substring(0, maxChars) + '...';
    }
    
    return text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Application not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            Go back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button
            onClick={handleEditApplication}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Application
          </Button>
        </div>

        {/* Application Overview */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl text-white mb-2 flex items-center gap-3">
                  <Building2 className="w-6 h-6" />
                  {application.companyName}
                </CardTitle>
                <p className="text-lg text-white/80 mb-4">{application.roleDescription}</p>
                <Badge className={getStatusColor(application.status)}>
                  {JOB_STATUS_LABELS[application.status]}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span>{new Date(application.applicationDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Euro className="w-4 h-4" />
                <span>{application.salary}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span>{getWorkModeIcon(application.workMode)} {application.workMode}</span>
              </div>
            </div>

            {application.tags && application.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {application.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">Job Description:</h3>
              <div className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">
                {isDescriptionExpanded 
                  ? application.jobDescription 
                  : truncateDescription(application.jobDescription)
                }
              </div>
              {shouldTruncateDescription(application.jobDescription) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-2 text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto"
                >
                  {isDescriptionExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      View less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      View more
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Interview Questions and Company Reviews */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md border border-white/20">
            <TabsTrigger 
              value="questions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-white/70 relative"
            >
              Interview Questions
              {!subscribed && <Crown className="w-3 h-3 ml-1 text-yellow-400" />}
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-white/70 relative"
            >
              Company Reviews
              {!subscribed && <Crown className="w-3 h-3 ml-1 text-yellow-400" />}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions" className="mt-6">
            {subscribed ? (
              <InterviewQuestions 
                applicationId={application.id}
                companyName={application.companyName}
                roleDescription={application.roleDescription}
              />
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 text-center">
                  <Lock className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Pro Feature</h3>
                  <p className="text-white/70 mb-6">
                    Interview questions are only available for Pro users. Upgrade to unlock this feature and more!
                  </p>
                  <Button 
                    onClick={() => navigate('/?tab=pro')}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            {subscribed ? (
              <CompanyReviews 
                companyName={application.companyName}
                roleDescription={application.roleDescription}
              />
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 text-center">
                  <Lock className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Pro Feature</h3>
                  <p className="text-white/70 mb-6">
                    Company reviews are only available for Pro users. Upgrade to unlock this feature and more!
                  </p>
                  <Button 
                    onClick={() => navigate('/?tab=pro')}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
