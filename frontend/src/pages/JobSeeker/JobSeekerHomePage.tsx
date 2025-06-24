import React, { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import JobSeekerLayout from "@/components/layout/JobSeekerLayout";
import { AppContext } from "@/context/AppContext";
import { jobSeekerApi } from "@/services/jobSeekerApi";

function JobSeekerHomePage() {
  const appContext = useContext(AppContext);
  const jobSeeker = appContext?.jobSeeker;

  const firstname = jobSeeker?.firstname || "Jobseeker";
  const lastname = jobSeeker?.lastname || "User";
  const profile_picture_url = jobSeeker?.profile_picture_url ||
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
  const last_updated_time = jobSeeker?.last_updated_time || null;
  const [appliedJobsData, setAppliedJobsData] = React.useState<any[]>([]);
  const [profileCompletion, setProfileCompletion] = React.useState<number>(0);
  const [missingFields, setMissingFields] = React.useState<string[]>([]);

  const jobStatuses = [
    "Actively searching jobs",
    "Preparing for interviews",
    "Appearing for interviews",
    "Received a job offer",
    "Casually exploring jobs",
    "Not looking for jobs",
  ];

  React.useEffect(() => {
    if (!jobSeeker?.id) return;
    jobSeekerApi.getAppliedJobs(jobSeeker.id)
      .then((jobs: any[]) => setAppliedJobsData(jobs || []))
      .catch(() => setAppliedJobsData([]));
  }, [jobSeeker?.id]);

  React.useEffect(() => {
    if (!jobSeeker?.id) return;
    jobSeekerApi.getProfileCompletion(jobSeeker.id)
      .then((res) => {
        setProfileCompletion(res.completion || 0);
        setMissingFields(res.missing_fields || []);
      })
      .catch(() => {
        setProfileCompletion(0);
        setMissingFields([]);
      });
  }, [jobSeeker?.id]);

  return (
    <JobSeekerLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <div className="bg-background rounded-lg shadow p-6">
              <div className="flex flex-col items-center">
                <img
                  className="h-20 w-20 rounded-full bg-muted mb-4"
                  src={profile_picture_url}
                  alt="User Profile"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
                  }}
                />
                <div className="text-center">
                  <h2 className="font-semibold text-base">
                    {firstname} {lastname}
                  </h2>
                  <div className="text-sm font-extralight">
                    {last_updated_time &&
                      "Last Updated on: " +
                        new Date(last_updated_time).toLocaleDateString()}
                  </div>
                  <div className="text-sm mt-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{profileCompletion}%</span> Profile Completed
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1 mb-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${profileCompletion}%` }}
                      ></div>
                    </div>
                    {missingFields.length > 0 && (
                      <div className="mt-2 text-xs text-red-600">
                        <div className="font-semibold mb-1">Complete your profile by adding:</div>
                        <ul className="list-disc pl-5">
                          {missingFields.map((field, idx) => (
                            <li key={idx}>{field}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Link
                to="/jobseeker/profile"
                className="w-full mt-6 bg-secondary hover:bg-secondary/80 text-white px-5 py-2 rounded-lg text-center block"
              >
                {profileCompletion === 100 ? "Update Profile" : "Complete Profile"}
              </Link>

            </div>
          </div>

          <div className="md:col-span-6">
            <>
              {appliedJobsData.length != 0 && (
                <div className="flex flex-col gap-4 mb-8">
                  <h2 className="font-bold pl-2 text-lg">Applied Jobs</h2>
                  {appliedJobsData.map((jobData, idx) => (
                    <Link
                      key={`applied-job-${jobData.id}`}
                      to={`/jobseeker/job/${jobData.id}`}
                      className="block group"
                    >
                      <Card className="flex flex-col sm:flex-row items-stretch border shadow hover:shadow-lg transition-shadow duration-200 bg-background group-hover:ring-2 group-hover:ring-blue-400 cursor-pointer">
                        <div className="flex flex-col justify-between flex-1 p-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-semibold text-blue-700 group-hover:underline">
                                {jobData.job_title}
                              </span>
                              {jobData.application_status && (
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${jobData.application_status === 'applied' ? 'bg-blue-100 text-blue-700' : jobData.application_status === 'shortlisted' ? 'bg-green-100 text-green-700' : jobData.application_status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{jobData.application_status.charAt(0).toUpperCase() + jobData.application_status.slice(1)}</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
                              <span className="inline-flex items-center text-xs font-bold bg-blue-200 text-blue-900 px-3 py-1 rounded-full shadow-sm">
                                <svg className="h-3 w-3 mr-1 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                                {jobData.job_location || 'Location N/A'}
                              </span>
                              <span className="inline-flex items-center text-xs font-bold bg-green-200 text-green-900 px-3 py-1 rounded-full shadow-sm">
                                <svg className="h-3 w-3 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="6" rx="2" /><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><path d="M22 13a18.15 18.15 0 0 1-20 0" /><path d="M12 12h.01" /></svg>
                                {jobData.work_mode || 'Type N/A'}
                              </span>
                              {jobData.company && (
                                <span className="inline-flex items-center text-xs font-bold bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full shadow-sm">
                                  <svg className="h-3 w-3 mr-1 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
                                  {jobData.company}
                                </span>
                              )}
                            </div>
                            {jobData.job_description && (
                              <div className="text-muted-foreground text-xs mt-2 font-medium line-clamp-2">
                                {jobData.job_description}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {jobData.skills && jobData.skills.split(',').map((skill: string, i: number) => (
                              <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-100">{skill.trim()}</span>
                            ))}
                            {jobData.qualification && (
                              <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-medium border border-purple-100">{jobData.qualification}</span>
                            )}
                            {jobData.education_degree && (
                              <span className="bg-pink-50 text-pink-700 px-2 py-0.5 rounded text-xs font-medium border border-pink-100">{jobData.education_degree}</span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

            </>
          </div>
          <div className="md:col-span-3">
              <div className="bg-background rounded-lg shadow p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Never pay anyone to get a job
                    </h3>
                    <p className="text-sm">
                      Fraudsters may ask you to invest money either to earn more
                      OR to get you a job. Never make such payments.
                    </p>
                    <a
                      href="#"
                      className="text-sm mt-2 inline-block underline"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </JobSeekerLayout>
  );
}

export default JobSeekerHomePage;
