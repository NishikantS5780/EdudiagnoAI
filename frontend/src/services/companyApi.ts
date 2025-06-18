import { config } from "@/config";
import axios from "axios";

import { JobData } from "@/types/job";
import { DSAQuestion, TestCase } from "@/types/job";
import { MCQuestion } from "@/types/job";
import { RecruiterLoginData, CompanyRegistrationData } from "@/types/recruiter";
import { InterviewQuestion } from "@/types/job";


export const companyApi = {
  register: async (data: CompanyRegistrationData) => {
    await axios.post(`${config.API_BASE_URL}/company`, data);
  },
  login: async (data: RecruiterLoginData) => {
    const res = await axios.post(
      `${config.API_BASE_URL}/company/login`,
      data
    );
    return res;
  },
  verifyLogin: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${config.API_BASE_URL}/company/verify-token`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res;
  },
  getAnaltyics: async () => {
    const response = await axios.get(
      `${config.API_BASE_URL}/company/analytics`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response;
  },
  createDSAQuestion: async (ai_interviewed_job_id: string, dsaQuestion: DSAQuestion) => {
    const res = await axios.post(
      `${config.API_BASE_URL}/company/dsa-question`,
      {
        ai_interviewed_job_id,
        ...dsaQuestion,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return res;
  },
  updateDSAQuestion: async (data: DSAQuestion) => {
    await axios.put(`${config.API_BASE_URL}/company/dsa-question`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  getDSAQuestion: async (ai_interviewed_job_id: string) => {
    const response = await axios.get(`${config.API_BASE_URL}/company/dsa-question`, {
      params: { ai_interviewed_job_id: ai_interviewed_job_id },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response;
  },
  deleteDSAQuestion: async (id: number) => {
    await axios.delete(`${config.API_BASE_URL}/company/dsa-question?id=${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  createTestCase: async (data: TestCase, dsaQuestionId: number) => {
    await axios.post(
      `${config.API_BASE_URL}/company/dsa-test-case`,
      { ...data, dsa_question_id: dsaQuestionId },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  },
  deleteTestCase: async (id: number) => {
    await axios.delete(`${config.API_BASE_URL}/company/dsa-test-case?id=${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  createCustomInterviewQuestion: async (question: InterviewQuestion, ai_interviewed_job_id: number) => {
    const res = await axios.post(
      `${config.API_BASE_URL}/company/custom-interview-question`,
      {
        question: question.question,
        question_type: question.question_type,
        order_number: question.order_number,
        ai_interviewed_job_id: ai_interviewed_job_id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res;
  },
  getCustomInterviewQuestionByJobId: async (ai_interviewed_job_id: number) => {
    const res = await axios.get(
      `${config.API_BASE_URL}/company/interview-question?ai_interviewed_job_id=${ai_interviewed_job_id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return res;
  },
  createAiInterviewedJob: async (data: JobData) => {
    const jobData = {
      title: data.title,
      description: data.description,
      department: data.department,
      city: data.city,
      location: data.location,
      type: data.type,
      min_experience: data.min_experience,
      max_experience: data.max_experience,
      duration_months: data.duration_months,
      key_qualification: data.key_qualification,
      salary_min: data.salary_min,
      salary_max: data.salary_max,
      currency: data.currency,
      show_salary: data.show_salary,
      requirements: data.requirements,
      benefits: data.benefits,
      status: data.status || "active",
    };

    const jobResponse = await axios.post(
      `${config.API_BASE_URL}/company/ai-interviewed-job`,
      jobData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    return jobResponse;
  },
  getAllAiInterviewedJobs: async (params: {
    limit?: number;
    start?: number;
    sort?: "ascending" | "descending";
    sort_field?:
    | "title"
    | "department"
    | "city"
    | "type"
    | "show_salary"
    | "status";
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.start) queryParams.append("start", params.start.toString());
    if (params?.sort) queryParams.append("sort", params.sort);
    if (params?.sort_field) queryParams.append("sort_field", params.sort_field);

    const res = await axios.get(
      `${config.API_BASE_URL}/company/ai-interviewed-job/all?${queryParams.toString()}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res;
  },
  getAiInterviewedJobById: (ai_interviewed_job_id: string) =>
    axios.get(`${config.API_BASE_URL}/company/ai-interviewed-job?id=${ai_interviewed_job_id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
  updateAiInterviewedJob: async (jobId: string, data: JobData) => {
    const res = await axios.put(
      `${config.API_BASE_URL}/company/ai-interviewed-job`,
      {
        ...data,
        id: parseInt(jobId),
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res;
  },
  generateAiInterviewedJobDescription: async (
    jobTitle: string,
    department: string,
    location: string,
    keyQualification: string,
    minExperience: string,
    maxExperience: string
  ) => {
    const res = await axios.post(
      `${config.API_BASE_URL}/job/generate-description`,
      {
        title: jobTitle,
        department: department,
        location: location,
        key_qualification: keyQualification,
        min_experience: minExperience,
        max_experience: maxExperience,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res;
  },
  generateAiInterviewedJobRequirements: async (
    jobTitle: string,
    department: string,
    location: string,
    keyQualification: string,
    minExperience: string,
    maxExperience: string,
    keywords: string
  ) => {
    const res = await axios.post(
      `${config.API_BASE_URL}/job/generate-requirements`,
      {
        title: jobTitle,
        department: department,
        location: location,
        key_qualification: keyQualification,
        min_experience: minExperience,
        max_experience: maxExperience,
        keywords: keywords,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res;
  },
  deleteAiInterviewedJob: async (jobId: string) => {
    const res = await axios.delete(`${config.API_BASE_URL}/company/ai-interviewed-job?id=${jobId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res;
  },
  createQuizQuestion: async (data: MCQuestion, ai_interviewed_job_id: number, file?: File) => {
    if (!data.description || !data.type || !data.category) {
      throw new Error("Missing details");
    }
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("category", data.category);
    formData.append("ai_interviewed_job_id", ai_interviewed_job_id.toString());
    if (data.time_seconds) {
      formData.append("time_seconds", data.time_seconds.toString());
    }
    if (file) {
      formData.append("image", file);
    }

    const res = await axios.post(
      `${config.API_BASE_URL}/company/quiz-question`,
      formData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res;
  },
  deleteQuizQuestion: async (id: number) => {
    await axios.delete(
      `${config.API_BASE_URL}/company/quiz-question?question_id=${id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  },
  createQuizOption: async (
    option: { label?: string; correct?: boolean },
    quiz_question_id?: number
  ) => {
    if (!option.label || !quiz_question_id) {
      return;
    }
    if (!option.correct) {
      option.correct = false;
    }

    const res = await axios.post(
      `${config.API_BASE_URL}/company/quiz-option`,
      {
        label: option.label,
        correct: option.correct,
        quiz_question_id: quiz_question_id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res;
  },
  getQuizQuestionByAiInterviewedJobId: async (ai_interviewed_job_id: string) => {
    const res = await axios.get(
      `${config.API_BASE_URL}/company/quiz-question?ai_interviewed_job_id=${ai_interviewed_job_id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res;
  },
  getInterview: async (id: string) => {
    const response = await axios.get(
      `${config.API_BASE_URL}/company/interview`,
      {
        params: { id },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response;
  },

  deleteInterview: async (id: string) => {
    const response = await axios.delete(`${config.API_BASE_URL}/company/interview`, {
      params: { id },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return response;
  },

  getQuizResponsesByInterviewId: async (interview_id: string) => {
    const res = await axios.get(
      `${config.API_BASE_URL}/company/quiz-response?interview_id=${interview_id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res;
  },

  getInterviewQuestionsAndResponses: async (interviewId: string) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${config.API_BASE_URL}/company/interview-question-and-response?interview_id=${interviewId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res;
  },
};