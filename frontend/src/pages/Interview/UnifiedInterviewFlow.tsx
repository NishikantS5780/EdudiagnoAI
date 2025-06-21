import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ResumeUploadStage } from "@/components/interview/stages/ResumeUploadStage";
import { MatchResultsStage } from "@/components/interview/stages/MatchResultsStage";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { interviewApi } from "@/services/interviewApi";
import MCQTest from "./MCQTest";
import VideoInterview from "./VideoInterview";
import { ThankYouStage } from "./ThankYouStage";
import DSAPlayground from "./DSAPlayground";

export default function UnifiedInterviewFlow() {
  const [urlSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<number>(0);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [matchFeedback, setMatchFeedback] = useState<string>("");
  // Thank you stage data
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    technicalSkills: 0,
    communication: 0,
    problemSolving: 0,
    culturalFit: 0,
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [hasDSATest, setHasDSATest] = useState(false);
  const [hasQuiz, setHasQuiz] = useState(false);

  // Build stages array based on what's required
  const getStages = () => {
    const baseStages = ["Resume Upload", "Match Results"];
    
    if (hasQuiz) {
      baseStages.push("MCQ Test");
    }
    
    if (hasDSATest) {
      baseStages.push("DSA Test");
    }
    
    baseStages.push("Video Interview", "Thank You");
    
    return baseStages;
  };

  const stages = getStages();

  useEffect(() => {
    const verifyInterviewLink = async () => {
      try {
        const jobId = urlSearchParams.get("job_id");
        if (!jobId) {
          setError("Missing job ID. Please use a valid interview link.");
          setIsLoading(false);
          return;
        }
        const response = await interviewApi.getAiInterviewedJob(jobId);
        const data = response.data;
        setJobId(data.id);
        setJobTitle(data.title);
        setCompanyName(data.company_name);
        setJobDescription(data.description);
        setHasDSATest(!!data.hasDSATest);
        setHasQuiz(!!data.hasQuiz);
        setIsLoading(false);
      } catch (error) {
        setError("Invalid interview link");
        setIsLoading(false);
      }
    };
    verifyInterviewLink();
  }, [urlSearchParams]);

  // Helper function to get the next stage after match results
  const getNextStageAfterMatch = () => {
    if (hasQuiz) return 2; // MCQ Test
    if (hasDSATest) return 2; // DSA Test (if no MCQ)
    return 2; // Video Interview (if no MCQ or DSA)
  };

  // Helper function to get the next stage after MCQ
  const getNextStageAfterMCQ = () => {
    if (hasDSATest) return 3; // DSA Test
    return 3; // Video Interview
  };

  // Helper function to get the next stage after DSA
  const getNextStageAfterDSA = () => {
    return 4; // Video Interview
  };

  // Helper function to get the next stage after video
  const getNextStageAfterVideo = () => {
    return 5; // Thank You
  };

  // Handler for when the video interview is complete
  const handleVideoInterviewComplete = (feedbackData?: any) => {
    if (feedbackData) {
      setFeedback(feedbackData.feedback);
      setScore(feedbackData.score);
      setScoreBreakdown(feedbackData.scoreBreakdown);
      setSuggestions(feedbackData.suggestions);
      setKeywords(feedbackData.keywords);
    }
    setCurrentStage(stages.length - 1); // Last stage (Thank You)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">{error}</h1>
          <p className="text-muted-foreground mb-6">
            We recommend reviewing the job requirements and updating your resume
            before trying again.
          </p>
        </div>
      </div>
    );
  }

  // Stepper UI (optional)
  const Stepper = () => (
    <div className="flex justify-center gap-4 mb-8">
      {stages.map((stage, idx) => (
        <div key={stage} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              idx === currentStage
                ? "bg-primary"
                : idx < currentStage
                ? "bg-green-500"
                : "bg-muted"
            }`}
          >
            {idx + 1}
          </div>
          <span
            className={`text-sm ${
              idx === currentStage ? "font-bold text-primary" : "text-muted-foreground"
            }`}
          >
            {stage}
          </span>
          {idx < stages.length - 1 && <div className="w-8 h-1 bg-muted rounded" />}
        </div>
      ))}
    </div>
  );

  // Render the current stage
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Stepper />
      {currentStage === 0 && (
        <ResumeUploadStage
          jobTitle={jobTitle}
          companyName={companyName}
          jobId={jobId}
          onComplete={(score: number, feedback: string) => {
            setMatchScore(score);
            setMatchFeedback(feedback);
            setCurrentStage(1);
          }}
        />
      )}
      {currentStage === 1 && (
        <MatchResultsStage
          matchScore={matchScore}
          matchFeedback={matchFeedback}
          jobTitle={jobTitle}
          companyName={companyName}
          interviewId={jobId.toString()}
          onScheduleLater={() => setCurrentStage(getNextStageAfterMatch())}
          onStartInterview={() => setCurrentStage(getNextStageAfterMatch())}
        />
      )}
      {hasQuiz && currentStage === 2 && (
        <MCQTest onComplete={() => setCurrentStage(getNextStageAfterMCQ())} />
      )}
      {hasDSATest && ((hasQuiz && currentStage === 3) || (!hasQuiz && currentStage === 2)) && (
        <DSAPlayground onComplete={() => setCurrentStage(getNextStageAfterDSA())} />
      )}
      {((hasQuiz && hasDSATest && currentStage === 4) || 
        (hasQuiz && !hasDSATest && currentStage === 3) || 
        (!hasQuiz && hasDSATest && currentStage === 3) || 
        (!hasQuiz && !hasDSATest && currentStage === 2)) && (
        <VideoInterview onComplete={handleVideoInterviewComplete} />
      )}
      {currentStage === stages.length - 1 && (
        <ThankYouStage
          feedback={feedback}
          score={score}
          scoreBreakdown={scoreBreakdown}
          suggestions={suggestions}
          keywords={keywords}
          companyName={companyName}
          jobTitle={jobTitle}
          jobId={jobId.toString()}
        />
      )}
    </div>
  );
} 