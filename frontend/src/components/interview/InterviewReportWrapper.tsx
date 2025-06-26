import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { InterviewData } from "@/types/interview";
import { AiInterviewedJobData } from "@/types/aiInterviewedJob";
import { companyApi } from "@/services/companyApi";
import InterviewReport from "@/pages/Company/Interviews/InterviewReport";

const InterviewReportWrapper = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState<InterviewData>({});
  const [job, setJob] = useState<AiInterviewedJobData>({});
  useEffect(() => {
    if (!id) {
      return;
    }
    companyApi.getInterview(id).then((res) => {
      setInterview(res.data);
      companyApi.getAiInterviewedJobById(res.data.ai_interviewed_job_id.toString()).then((res) => {
        setJob(res.data);
      });
    });
  }, [id]);

  if (!interview || !job) return null;
  return <InterviewReport jobTitle={job.title || ""} />;
};

export default InterviewReportWrapper;
