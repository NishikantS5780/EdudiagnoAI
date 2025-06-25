import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { InterviewData } from "@/types/interview";
import CompanyLayout from "@/components/layout/CompanyLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download } from "lucide-react";
import { MCQResponse, MCQuestion } from "@/types/aiInterviewedJob";
import { interviewApi } from "@/services/interviewApi";
import { companyApi } from "@/services/companyApi";

interface InterviewReportProps {
  jobTitle: string;
}

const InterviewReport = ({ jobTitle }: InterviewReportProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizResponses, setQuizResponses] = useState<MCQResponse[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<MCQuestion[]>([]);
  const [mcqScores, setMcqScores] = useState({
    total: { correct: 0, total: 0 },
    technical: { correct: 0, total: 0 },
    aptitude: { correct: 0, total: 0 },
  });

  useEffect(() => {
    const calculateScores = () => {
      if (quizResponses.length === 0 || quizQuestions.length === 0) return;

      const scores = {
        total: { correct: 0, total: quizResponses.length },
        technical: { correct: 0, total: 0 },
        aptitude: { correct: 0, total: 0 },
      };

      quizResponses.forEach((response) => {
        const question = quizQuestions.find(
          (q) => q.id === response.question_id
        );
        if (!question) return;

        const chosenOption = question.options?.find(
          (opt) => opt.id === response.option_id
        );
        if (chosenOption?.correct) {
          scores.total.correct++;
          if (question.category === "technical") {
            scores.technical.correct++;
            scores.technical.total++;
          } else if (question.category === "aptitude") {
            scores.aptitude.correct++;
            scores.aptitude.total++;
          }
        } else {
          if (question.category === "technical") {
            scores.technical.total++;
          } else if (question.category === "aptitude") {
            scores.aptitude.total++;
          }
        }
      });

      setMcqScores(scores);
    };

    calculateScores();
  }, [quizResponses, quizQuestions]);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        if (!id) {
          return;
        }
        const response = await companyApi.getInterview(id.toString());

        if (!response.data) {
          toast.error("Interview not found");
          navigate("/dashboard/interviews");
          return;
        }

        const quizResponse = await companyApi.getQuizQuestionByAiInterviewedJobId(response.data.ai_interviewed_job_id.toString());
        const quizQuestionsResponse = await companyApi.getQuizResponsesByInterviewId(
          id as string
        );

        setQuizResponses(quizQuestionsResponse.data);
        setQuizQuestions(quizResponse.data);

        setInterview(response.data);
      } catch (error) {
        console.error("Error fetching interview:", error);
        toast.error("Failed to fetch interview data");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, []);

  const getScoreColor = (score: number | undefined) => {
    if (!score) return "#4b5563"; // Default gray color for undefined scores
    if (score >= 85) return "#059669"; // Green for high scores
    if (score >= 70) return "#2563eb"; // Blue for medium scores
    return "#dc2626"; // Red for low scores
  };

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
      </CompanyLayout>
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <CompanyLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Interview Report</h1>
          {interview.report_file_url ? (
            <a
              href={interview.report_file_url}
              className="flex gap-1 items-center bg-accent rounded p-2 hover:bg-accent/90 transition-all cursor-pointer"
              target="_blank"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </a>
          ) : interview.status == "incomplete" ? (
            <div className="text-destructive">Interview incomplete!</div>
          ) : (
            <div className="text-amber-600">Report not Generated yet!</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-semibold">
                    {interview?.firstname} {interview?.lastname}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {interview?.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{interview?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{interview?.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Education</p>
                  <p>{interview?.education}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p>{interview?.work_experience} years</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Overall Score:</span>
                <span
                  className={`text-xl font-bold ${getScoreColor(
                    interview?.overall_score
                  )}`}
                >
                  {interview?.overall_score || 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Technical Skills</span>
                  <span
                    className={getScoreColor(interview?.technical_skills_score)}
                  >
                    {interview?.technical_skills_score || 0}%
                  </span>
                </div>
                <Progress
                  value={interview?.technical_skills_score || 0}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Communication</span>
                  <span
                    className={getScoreColor(
                      interview?.communication_skills_score
                    )}
                  >
                    {interview?.communication_skills_score || 0}%
                  </span>
                </div>
                <Progress
                  value={interview?.communication_skills_score || 0}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Problem Solving</span>
                  <span
                    className={getScoreColor(
                      interview?.problem_solving_skills_score
                    )}
                  >
                    {interview?.problem_solving_skills_score || 0}%
                  </span>
                </div>
                <Progress
                  value={interview?.problem_solving_skills_score || 0}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Cultural Fit</span>
                  <span
                    className={getScoreColor(interview?.cultural_fit_score)}
                  >
                    {interview?.cultural_fit_score || 0}%
                  </span>
                </div>
                <Progress
                  value={interview?.cultural_fit_score || 0}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resume Match Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Match Score</span>
                  <span
                    className={getScoreColor(interview?.resume_match_score)}
                  >
                    {interview?.resume_match_score || 0}%
                  </span>
                </div>
                <Progress
                  value={interview?.resume_match_score || 0}
                  className="h-2"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Feedback</p>
                <p className="text-sm whitespace-pre-wrap break-words">
                  {interview?.resume_match_feedback}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">MCQ Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Total Score:</span>
              <span className="text-xl font-bold text-green-600">
                {mcqScores.total.correct}/{mcqScores.total.total}
              </span>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Technical MCQs:
                </span>
                <span className="text-sm font-medium">
                  {mcqScores.technical.correct}/{mcqScores.technical.total}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Aptitude MCQs:
                </span>
                <span className="text-sm font-medium">
                  {mcqScores.aptitude.correct}/{mcqScores.aptitude.total}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interview Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap break-words">
              {interview?.feedback}
            </p>
          </CardContent>
        </Card>
      </div>
    </CompanyLayout>
  );
};

export default InterviewReport;